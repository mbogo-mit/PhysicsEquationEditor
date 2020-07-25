let ListOfKeyUnitVariables = ["m","g","s","A","K","o","c","r","q"];
ListOfKeyUnitVariables = ListOfKeyUnitVariables.concat(Object.keys(DerivedUnits));
let ListOfFunctions = ["\\sum", "\\prod","\\sqrt","\\sin", "\\cos", "\\tan", "\\csc", "\\sec", "\\cot", "\\sinh", "\\cosh", "\\tanh", "\\coth", "\\arcsin", "\\arccos", "\\arctan", "\\exp", "\\lg", "\\ln", "\\log",];

function CheckIfUnitsMatchInMathField(ls){
  ls = ReplaceVariablesWithUnits(ls);
  //console.log(ls);
  let mathJsStr = ConvertLatexStringToMathJsReadableString(ls);
  //console.log(mathJsStr);
  try{
    mathJsStr = IterateThroughSimplifications(mathJsStr);
    //console.log(mathJsStr);
    //now we have to check if the units match in the expression
    mathJsStr = math.rationalize(mathJsStr).toString();
    //console.log(mathJsStr);
    let numerator = mathJsStr.substring(0, mathJsStr.indexOf("/"));
    numerator = math.simplify(numerator).toString();
    //console.log((numerator.indexOf('+') == -1 && numerator.indexOf('-') == -1));
  }
  catch(err){
    console.log(err);
  }


}

function IterateThroughSimplifications(mathJsStr){
  let replacedADerivedUnit = true;
  while(replacedADerivedUnit){
    //start of a new round of trying to replace the simplified equation with more basic dervied units
    replacedADerivedUnit = false;
    mathJsStr = math.simplify(mathJsStr).toString();
    for (const [key, value] of Object.entries(DerivedUnits)) {
      if(mathJsStr.indexOf(key) != -1){
        //replacing a more derived unit with its less derived counter parts. For example replacing V -> J*A^(-1)*s^(-1)
        //then in later loops if the string is still not simplified I could replace J -> N*m
        let re = new RegExp(key,"g");
        mathJsStr = mathJsStr.replace(re, `(${value})`);
        replacedADerivedUnit = true;
        break;
      }
    }
  }

  return mathJsStr;
}

function ReplaceVariablesWithUnits(ls){
  //console.log(ls);
  let vars = Object.keys(DefinedVariables).concat(Object.keys(PreDefinedVariables));
  //sorting them by length so the longer string are the ones that get tested first because the longer strings
  //may have pieces of shorter string in them so if we are trying to find the variable "a_{r}"", and we defined "a" and "a_{r}"
  //if "a" comes before "a_{r}" it will find instances of "a_{r}". But if "a_{r}" goes first than those variables will be already
  //taken care of before "a" can screw things up
  vars.sort(function(a,b){
  	if(a.length > b.length){
    	return -1;
    }
    else{
    	return 1;
    }
  });

  //now we have to go character by character and replace variables with their unitsLatex string
  let i = 0;
  let delta = 0;
  let s = "";
  let newLs = "";
  let foundMatch = false;
  while(i < ls.length){
    foundMatch = false;
    s = ls.substring(i);
    //we need to identify what set of characters is at the index we are at

    //lets first check if its a Defined Variable
    for(var c = 0; c < vars.length; c++){
      if(s.indexOf(vars[c]) == 0){
        let unitsLatex = (Object.keys(DefinedVariables).includes(vars[c])) ? DefinedVariables[vars[c]].unitsLatex : PreDefinedVariables[vars[c]].unitsLatex;
        foundMatch = true;
        delta = vars[c].length;
        //we need to check if this variable is getting raised to some kind of power and if so we need to put latex paranthesis around the expression
        let rapExpression = false;
        if(s.length > delta){//make sure we are not out of bounds
          if(s[delta] == "^"){
            rapExpression = true;
            newLs += "\\left( " + unitsLatex + "\\right)";
          }
        }

        if(!rapExpression){
          newLs += unitsLatex;
        }

        break;
      }
    }

    if(!foundMatch && s[0] == "\\"){
      //it is possible that it is an operator or a greek letter
      for(var c = 0; c < ListOfOperators.length; c++){
        if(s.indexOf(ListOfOperators[c]) == 0){
          foundMatch = true;
          newLs += ListOfOperators[c];
          delta = ListOfOperators[c].length;
          break;
        }
      }

      if(!foundMatch){
        for(var c = 0; c < LatexGreekLetters.length; c++){
          if(s.indexOf(LatexGreekLetters[c]) == 0){
            foundMatch = true;
            newLs += LatexGreekLetters[c];
            delta = LatexGreekLetters[c].length;
            break;
          }
        }
      }

    }

    if(!foundMatch){
      delta = 1;
      newLs += s[0];//just pass the value directly to the new latex string
    }

    i += delta;

  }

  return newLs;

}

function ConvertLatexStringToMathJsReadableString(ls){
  console.log("ConvertLatexStringToMathJsReadableString",ls);
  ls = TakeOutFractionLatexFormatting(ls);//so now fractions go from "\frac{a}{b} to {a}/{b}"
  ls = ReplaceSpecialLatexCharacterWithBasicCharacterCounterpart(ls);
  //console.log(ls);
  ls = AddExplicitMultiplicationOperator(ls);
  ls = ls.replace(/\\/g,"");

  return ls;
}

function ReplaceSpecialLatexCharacterWithBasicCharacterCounterpart(ls){
  ls = ls.replace(/\\cdot/g,"*").replace(/\\times/g,"*").replace(/\\ast/g,"*");//replacing latex special operators with standard operators
  ls = ls.replace(/\\pm/g,"+").replace(/[^\{(]-/g,"+");//replacing latex special operators with standard operators
  ls = ls.replace(/[^\{(]-/g,"+").replace(/[=]/g,"+");//replace all minuses that are not exponents with plus because mathjs doesn't like to simplify things that are subtracting
  ls = ls.replace(/\\left\(/g,"(").replace(/\\right\)/g,")");//replacing latex parentheses with normal "(" and ")"
  ls = ls.replace(/\{/g,"(").replace(/\}/g,")");//replacing brackets for parentheses
  ls = ls.replace(/\\\s/g, '');//removing "\ " blackslash with space after
  ls = ls.replace(/\s/g, "");//removing empty space
  return ls;
}

function TakeOutFractionLatexFormatting(ls){
  let index = 0;
  while(ls.indexOf("\\frac") != -1){
    index = ls.indexOf("\\frac");
    let i = FindIndexOfClosingBracket(ls.substring(index + 6)) + (index + 6);//this string finds the first closing bracket of the fraction latext string  {"}"{}
    let i2 = FindIndexOfClosingBracket(ls.substring(i + 2)) + (i + 2);//this string finds the second closing bracket for the fraction latex string        {}{"}"
    //this substring removes \\frac and replaces it with a "(" then puts a "/" in between {}{} -> {}/{} then wraps the end with ")"
    ls = ls.substring(0, index) + "(" + ls.substring(index + 5, i + 1) + "/" + ls.substring(i + 1, i2 + 1) + ")" + ls.substring(i2 + 1);
    //after the line above the latex string goes from "....\\frac{a}{b}...." -> "({a}/{b})"
  }

  return ls;
}

function FlattenFractionsInLatexString(ls){
  let index = 0;
  while(ls.indexOf("\\frac") != -1){
    index = ls.indexOf("\\frac");
    let i1 = FindIndexOfClosingBracket(ls.substring(index + 6)) + (index + 6);//this finds \\frac{"}"{}
    let i2 = FindIndexOfClosingBracket(ls.substring(i1 + 2)) + i1 + 2;//this finds \frac{}{"}"
    // "....\\frac{}{" + "inverse denominator" + "}........"
    ls = ls.substring(0, i1 + 2) + DenominatorIntoInverseNumerator(ls.substring(i1 + 2, i2)) + ls.substring(i2);

    ls = ls.substring(0, index) + ls.substring(index + 5);//this removes the "\frac" latex keyword
    // "....{}{inverse denonimator}........"
  }
}

function DenominatorIntoInverseNumerator(ls){
  //this function takes a demominator ex: (a+b)c -> (a+b)^(-1)c^(-1)
}

function AddExplicitMultiplicationOperator(ls){
  //this function adds explicit multiplication operators into the string so that abc becomes a*b*c
  let newLs = "";
  let index = 0;
  let delta = 0;
  let foundMatch = false;
  let previousCharacterWasOperator = true;
  let basicOperators = ["+","-","*","=","^","(","/"];
  while(index < ls.length){
    let s = ls.substring(index);
    let indexOfOperator = basicOperators.indexOf(s[0]);
    if(indexOfOperator != -1){
      delta = 1;
      if(s[indexOfOperator] == "("){
        if(!previousCharacterWasOperator){
          newLs += "*";
        }
      }
      newLs += s[0];

    }else{
      if(!previousCharacterWasOperator){
        let a = ListOfKeyUnitVariables.concat(ListOfFunctions).concat([")"]);
        for(var i = 0; i < a.length; i++){
          if(s.indexOf(a[i]) == 0){
            if(a[i] != ")"){
              newLs += "*"
            }
            newLs += a[i];//adding an explicity multiplication
            delta = a[i].length;
            break;
          }
        }
      }
      else{
        delta = 1;
        newLs += s[0];
      }
    }

    previousCharacterWasOperator = (indexOfOperator != -1);
    index += delta;

  }

  return newLs;
}

function FindIndexOfClosingBracket(ls){
  let unclosedBrackets = 1;
  let i = 0;
  while(unclosedBrackets > 0){
    if(ls[i] == "{"){
      unclosedBrackets += 1;
    }
    else if(ls[i] == "}"){
      unclosedBrackets -= 1;
    }

    if(unclosedBrackets > 0){
      i++;
    }

  }
  return i;
}

/*
function ParseLatexStringIntoAlgebraJsExpression(ls){

  let exprs = [];
  exprs.push(new Expression());

  let index = 0;
  let delta = 0;
  let operation = null;
  let currentExpression = null;
  let foundMatch = false;

  while(index < ls.length){
    foundMatch = false;
    currentExpression = null;
    let s = ls.substring(index);
    if(operation == ""){
      //we are checking if the current index we are at is an operation
      let sequentialOperators = SequentialOperators.multiply.concat(SequentialOperators.add).concat(SequentialOperators.subtract);
      for(var c = 0; c < sequentialOperators.length; c++){
        if(s.indexOf(sequentialOperators[c]) == 0){
          operation = sequentialOperators[c];
          delta = sequentialOperators[c].length;
          foundMatch = true;
        }
      }
    }

    if(!foundMatch){//if we still haven't figured out what is at this index we need to check if it is a variable
      let i = AlegbraJsUnitVariables.indexOf(s[0]);
      if(i != -1){
        currentExpression = new Expression(AlegbraJsUnitVariables[i]);
        foundMatch = true;
        delta = 1;
      }
    }

    //if this thing is not a plus, minus, multiply or variable it is either a \frac,\left(,^, or function like sqrt, or cos

    if(!foundMatch){
      //checking to see if this is a fraction
      if(s.indexOf("\\frac") == 0){
        let frac = GetNumeratorAndDenominatorSubstringFromLatexString(s);
        currentExpression = ParseLatexStringIntoAlgebraJsExpression(frac.numerator).divide(ParseLatexStringIntoAlgebraJsExpression(frac.denominator));
        foundMatch = true;
        delta = ("\\frac{" + frac.numerator + "}{" + frac.denominator + "}").length;
      }
    }

    if(!foundMatch){
      //checking if this is a \left(
      if(s.indexOf("\\left(") == 0){
        let parenthesesExpressionSubstring = GetParenthesesExpressionSubstringFromLatexString(s);
        currentExpression = ParseLatexStringIntoAlgebraJsExpression(parenthesesExpressionSubstring);
        delta = ("\\left(" + parenthesesExpressionSubstring + "\\right)").length;
      }
    }

    index += delta;
  }



}
*/
function RecursivePLSIAJE(){//P.L.S.I.A.J.E stands for ParseLatexStringIntoAlgebraJsExpression

}
