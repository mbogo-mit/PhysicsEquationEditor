math.createUnit( {
  sr: '1 m^2/m^2',
  kat: '1 s^-1',
},
{
  override: true
});

math.createUnit('vector');

math.import({
  myDotProduct: function (v1, v2) {
    //converting math js object to string
    v1 = v1.toString();
    v2 = v2.toString();
    //v1 = [1 unit, 1 unit, 1 unit], v2 = [1 unit, 1 unit, 1 unit]
    //format vector strings into arrays so we can multiply and add their components
    v1 = v1.substring(v1.indexOf("[") + 1,v1.indexOf("]"));//removing brackets from begining and end
    v1 = v1.split(",");//making v1 into an array
    v2 = v2.substring(v2.indexOf("[") + 1,v2.indexOf("]"));//removing brackets from begining and end
    v2 = v2.split(",");//making v2 into an array

    let expr = `(${v1[0]} * ${v2[0]} + ${v1[1]} * ${v2[1]} + ${v1[2]} * ${v2[2]}) / 1 vector^2`;
    return `(${math.evaluate(expr).toString()})`;

  },
  myCrossProduct: function (v1, v2) {
    //converting math js object to string
    v1 = v1.toString();
    v2 = v2.toString();
    //v1 = [1 unit, 1 unit, 1 unit], v2 = [1 unit, 1 unit, 1 unit]
    //format vector strings into arrays so we can multiply and add their components
    v1 = v1.substring(v1.indexOf("[") + 1,v1.indexOf("]"));//removing brackets from begining and end
    v1 = v1.split(",");//making v1 into an array
    v2 = v2.substring(v2.indexOf("[") + 1,v2.indexOf("]"));//removing brackets from begining and end
    v2 = v2.split(",");//making v2 into an array
    //a x b = <a2 * b3 - a3 * b2, a3 * b1 - a1 * b3, a1 * b2 - a2 * b1>
    let expr = `[${v1[1]} * ${v2[2]} - ${v1[2]} * ${v2[1]}, ${v1[2]} * ${v2[0]} - ${v1[0]} * ${v2[2]}, ${v1[0]} * ${v2[1]} - ${v1[1]} * ${v2[0]}]/ 1 vector`;
    return `(${math.evaluate(expr).toString()})`;

  }
})

function CheckForErrorsInExpression(ls, lineNumber){
  console.log(ls);
  ls = RemoveCommentsFromLatexString(ls);
  ls = PutBracketsAroundAllSubsSups(ls);
  ls = ReplaceVariablesWithMathjsUnits(ls);
  ls = CleanLatexString(ls, ["fractions","addition","parentheses","brackets", "white-space"]);
  ls = FindAndWrapVectorsThatAreBeingMultiplied(ls);
  console.log(ls);
  ls = CleanLatexString(ls,["multiplication"]);
  console.log(ls);
  //console.log(ls);
  let expressions = ls.split(";");
  let exprs = [];
  expressions.map(function(value, i){
    exprs.push(value.split("="));
    console.log(value);
  });
  let results = [];
  console.log(exprs);
  for(let i = 0; i < exprs.length; i++){
    results.push([]);
    for(let j = 0; j < exprs[i].length; j++){
      //now that we have parsed the latex string into a mathjs readable string we evaluate it and grab any errors
      //that math js throws and interprets them for the user
      try {
        console.log("exprs[i][j]", exprs[i][j]);
        let str = math.evaluate(exprs[i][j]).toString();
        results[i].push({success: str});
      }
      catch(err){
        results[i].push({error: err.message});
      }
    }

  }

  //console.log(results);
  ParseResultsArrayAndGenerateLoggerList(results, lineNumber);

}

function ParseResultsArrayAndGenerateLoggerList(results, lineNumber){
  let log = {
    success: [],
    info: [],
    warning: [],
    error: [],
  };

  results.map(function(r, index){

    let successes = [];
    let errors = [];
    r.map(function(data, i){

      if(data.success != undefined){
        successes.push(data.success);
      }

      if(data.error){
        errors.push(data.error);
      }

    });

    if(successes.length > 1){
      //check if units match for success equations
      let equationUnitsMatch = false;

      try {
        //trying to add the units of each equation and see if they add if they don't then they are not the same unit so an error will occur
        math.evaluate(successes.join(" + "));
        equationUnitsMatch = true;
      }
      catch(err){
        equationUnitsMatch = false;
      }

      if(!equationUnitsMatch){
        log.error.push({
          error: EL.createLoggerErrorFromMathJsError("Units do not equal each other"),
          info: successes,
          lineNumber: lineNumber,
        });
      }
    }

    if(errors.length > 0){
      errors.map(function(error, index){
        log.error.push({
          error: EL.createLoggerErrorFromMathJsError(error),
          info: "",
          lineNumber: lineNumber,
        });
      });
    }


  });

  EL.addLog(log);

}

function ReplaceVariablesWithMathjsUnits(ls){
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

  //now we have to go character by character and replace variables with their unitsMathjs string
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
        let variable = (Object.keys(DefinedVariables).includes(vars[c])) ? Object.assign({}, DefinedVariables[vars[c]]) : Object.assign({}, PreDefinedVariables[vars[c]]);
        //we need to check if this variable is a vector and if so then we have to format unitsMathjs variable differently
        let unitsMathjs = variable.unitsMathjs;
        if(variable.type == "vector"){
          unitsMathjs = `[(${unitsMathjs}) vector, (${unitsMathjs}) vector, (${unitsMathjs}) vector]`;//making math js representation of a vector
        }
        foundMatch = true;
        delta = vars[c].length;

        newLs += ` (${unitsMathjs}) `;

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

function CleanLatexString(ls, types){
  //so this function removes latex based formating like \frac
  if(types.includes('fractions')){
    ls = TakeOutFractionLatexFormatting(ls);//all \frac for matting is gone: \frac{...}{...} -> {...}/{...}
  }
  ls = ReplaceSpecialLatexCharacterWithBasicCharacterCounterpart2(ls, types);

  return ls;
}

function ReplaceSpecialLatexCharacterWithBasicCharacterCounterpart2(ls, types){
  if(types.includes("multiplication")){
    ls = ls.replace(/\\cdot/g,"*").replace(/\\times/g,"*").replace(/\\ast/g,"*");//replacing latex special operators with standard operators
  }
  if(types.includes("addition")){
    ls = ls.replace(/\\pm/g,"+");//replacing latex special operators with standard operators
  }
  if(types.includes("parentheses")){
    ls = ls.replace(/\\left\(/g,"(").replace(/\\right\)/g,")");//replacing latex parentheses with normal "(" and ")"
  }
  if(types.includes("brackets")){
    ls = ls.replace(/\{/g,"(").replace(/\}/g,")");//replacing brackets for parentheses
  }
  if(types.includes("white-space")){
    ls = ls.replace(/\\\s/g, '');//removing "\ " blackslash with space after
  }

  return ls;
}

function FindAndWrapVectorsThatAreBeingMultiplied(ls){
  while(ls.lastIndexOf('\\times') != -1 || ls.lastIndexOf("\\cdot") != -1){
    let crossProductIndex = ls.lastIndexOf('\\times');
    let dotProductIndex = ls.lastIndexOf("\\cdot");
    //the default is to do cross product first because when two vectors are crossed the resulting vector can still  be dotted  with another vector. But once two vectors are dotted, the resulting vector can't then be crossed with another vector
    let multiply = {
      index: (crossProductIndex != -1) ? crossProductIndex: dotProductIndex,
      type: (crossProductIndex != -1) ? "\\times": "\\cdot",
      func: (crossProductIndex != -1) ? "myCrossProduct": "myDotProduct",
     };

     //console.log(multiply);

    let v1StartIndex = FindFirstVectorStartIndex(ls, multiply.index);
    let v2EndIndex = FindSecondVectorEndIndex(ls, multiply.index + multiply.type.length + 1);//we want to start parsing everything after the multiplication operator

    //console.log(v1StartIndex, v2EndIndex);

    if(v1StartIndex != null && v2EndIndex != null){
      //this string removes the multiplication operator and wraps the vectors in a function and uses each vector as a parameter for the function
      ls = ls.substring(0,v1StartIndex) + (multiply.func) + "(" + ls.substring(v1StartIndex, multiply.index) + ", " + ls.substring(multiply.index + multiply.type.length + 1, v2EndIndex + 1) + ")" + ls.substring(v2EndIndex + 1);
    }
    else{
      //if it broke once then it will just keep breaking so we just got to end it
      return ls;
    }

  }

  return ls;
}

function FindFirstVectorStartIndex(ls, endIndex){
  let unwantedChars = ["=","(","+","-","\\times","\\cdot"];
  let i = endIndex;
  while(i > 0){
    if(ls[i] == ")"){
      //this parenthesis could hold a vector inside of it so we need to find the closing parenthesis and check if a vector is inside the range
      let closingParenthesis = FindIndexOfOpeningParenthesis(ls.substring(0,i));
      if(closingParenthesis != null){
        //we need to check if there is a vector inside these parentheses
        if(ThereIsAVectorInsideString(ls.substring(closingParenthesis, i + 1))){
          //there is one case where this parenthesis is the opening parenthesis for the function myDotProduct or myCrossProduct and if so we need to include those indexes so that we are wrapping the whole statement
          //checking if the parethesis belongs to the function myDotProduct
          if(closingParenthesis - "myDotProduct".length >= 0){
            if(ls.substring(closingParenthesis - "myDotProduct".length, closingParenthesis) == "myDotProduct"){
              return closingParenthesis - "myDotProduct".length;
            }
          }

          if(closingParenthesis - "myCrossProduct".length >= 0){
            if(ls.substring(closingParenthesis - "myCrossProduct".length, closingParenthesis) == "myCrossProduct"){
              return closingParenthesis - "myCrossProduct".length;
            }
          }

          //none of the special cases returned so we just return the index of the closingParenthesis
          return closingParenthesis;
        }
        i = closingParenthesis;//just skip over the indexes before that because all that stuff is in parentheses and will be dealt with using other functions
      }

    }
    else{
      //we need to check if out of all the characters we have parsed if any of them were unwanted chars
      for(var c = 0; c < unwantedChars.length; c++){
        let char = unwantedChars[c];
        //if this is not true then this can't be the unwanted character we are looking for because there is not enough characters before this character to even spell out the unwanted character
        if((i + 1) - char.length >= 0){
          if(ls.substring((i + 1) - char.length, i + 1) == char){
            //we found an unwanted character
            return null;
          }
        }
      }
    }

    i--;
  }

  return null;
}


function FindSecondVectorEndIndex(ls, startIndex){
  let unwantedChars = ["=",")","+","-","\\times","\\cdot"];
  let i = startIndex;
  while(i < ls.length){
    if(ls[i] == "("){
      //this parenthesis could hold a vector inside of it so we need to find the closing parenthesis and check if a vector is inside the range
      let closingParenthesis =  FindIndexOfClosingParenthesis(ls.substring(i + 1));
      if(closingParenthesis){
        closingParenthesis += (i + 1);//this correts for the shift that occurs from only using a substring in the FindIndexOfClosingParenthesis function
        //we need to check if there is a vector inside these parentheses
        if(ThereIsAVectorInsideString(ls.substring(i, closingParenthesis + 1))){
          return closingParenthesis;
        }
        i = closingParenthesis;//just skip over the indexes before that because all that stuff is in parentheses and will be dealt with using other functions
      }

    }
    else{
      //if we find any unwanted characters before finding the second vector then there is a formating error on the part of the user so we will just return null
      for(var c = 0; c < unwantedChars.length; c++){
        if(ls.substring(i).indexOf(unwantedChars[c]) == 0){
          return null;//we found an unwanted character when we were trying to find a vector to multiply
        }
      }
    }


    i++;
  }

  return null;
}

function FindIndexOfClosingParenthesis(ls){
  let unclosedBrackets = 1;
  let i = 0;
  while(unclosedBrackets > 0){
    if(i > ls.length){
      return null;
    }
    if(ls[i] == "("){
      unclosedBrackets += 1;
    }
    else if(ls[i] == ")"){
      unclosedBrackets -= 1;
    }

    if(unclosedBrackets > 0){
      i++;
    }

  }
  return i;
}

function FindIndexOfOpeningParenthesis(ls){
  let unclosedBrackets = 1;
  let i = ls.length - 1;
  while(unclosedBrackets > 0){
    if(i < 0){
      return null;
    }
    if(ls[i] == ")"){
      unclosedBrackets += 1;
    }
    else if(ls[i] == "("){
      unclosedBrackets -= 1;
    }

    if(unclosedBrackets > 0){
      i--;
    }

  }
  return i;
}

function ThereIsAVectorInsideString(str){
  //checking that it has brackets and commas
  return str.indexOf("([") != -1 && str.indexOf("])") != -1 && str.indexOf(",") != -1;
}
