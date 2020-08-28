const express = require('express');
const path = require('path');
const ejs = require('ejs');
const app = express();
const PORT = 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.listen(PORT, () => console.log(`listening at http://localhost:${PORT}`));

app.get('/editor', (req, res, next)=>{
  res.render('pages/editor',{loe: ListOfEquations, lopc: ListOfPhysicsConstants});
});

app.get('/', (req, res, next)=>{
  res.render('pages/index');
});

function RID(){
  let c = "abcdefghijklmnopqrstuvwxyz0123456789";
  let rid = "";
  for(var i = 0; i < 10; i++){
    let r = Math.random() * c.length;
    rid += c.substring(r, r+1);
  }

  return rid;
}


ListOfEquations = {
  mechanics: [
    {
      name: "Velocity",
      infoId: RID(),
      info: {
        videos: [
          {
            iframe: "",
            title: "",
            thumbnail: "",
          }
        ],
      },
      equations: [
        "\\bar{v}=\\frac{\\Delta s}{\\Delta t}",
        "\\vec{v}= \\frac{d\\vec{s}}{dt}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1,"time": 2,"length": 1},
        {"velocity": 1,"length": 1, "time": 1},
      ],
    },
    {
      name: "Acceleration",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\bar{a}= \\frac{\\Delta\\vec{v}}{\\Delta t}",
        "\\vec{a}= \\frac{d\\vec{v}}{dt}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 2,"time": 2,"acceleration": 1},
        {"velocity": 1,"acceleration": 1, "time": 1},
      ],
    },
    {
      name: "Linear Kinematics",
      infoId: RID(),
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "v=v_{0}+at",
        "s=s_{0}+v_{0}t+\\frac{1}{2}at^{2}",
        "v^{2}=v_{0}^{2} + 2a\\left(s-s_{0}\\right)",
        "\\bar{v}=\\frac{1}{2}\\left(v+v_{0}\\right)"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 2,"time": 1,"acceleration": 1},
        {"velocity": 1,"time": 1,"length": 2,"acceleration": 1},
        {"velocity": 2,"length": 2,"acceleration": 1},
        {"velocity": 3}
      ],
    },
    {
      name: "Newton's 2nd Law",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\sum \\vec{F} = m\\vec{a}",
        "\\sum \\vec{F} = \\frac{d\\vec{p}}{dt}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"acceleration": 1,"force": 1,"mass": 1},
        {"force": 1,"momentum": 1, "time": 1},
      ],
    },
    {
      name: "Weight",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\vec{W}=mg\\hat{y}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"force": 1,"mass": 1,"acceleration": 1},
      ],
    },
    {
      name: "Dry Friction",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "f_{s}\\leq \\mu_{s}N",
        "f_{k}\\leq \\mu_{k}N"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"force": 2, "coefficient of friction": 1},
        {"force": 2, "coefficient of friction": 1},
      ],
    },
    {
      name: "Centripetal Accel.",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "a_{c}=\\frac{v^{2}}{r}",
        "\\vec{a_{c}}=-\\omega^{2}\\vec{r}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1,"acceleration": 1,"length": 1},
        {"acceleration": 1,"angular velocity": 1,"length": 1},
      ],
    },
    {
      name: "Momentum",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\vec{p}=m\\vec{v}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1,"mass": 1,"momentum": 1},
      ],
    },
    {
      name: "Impulse",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\vec{J}=\\bar{F}\\Delta t",
        "\\vec{J}=\\int\\left(\\vec{F}dt\\right)"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"time": 2,"force": 1,"impulse": 1},
        {"time": 1,"force": 1,"impulse": 1},
      ],
    },
    {
      name: "Impulse-momentum",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\bar{F}\\Delta t=m\\Delta\\vec{v}",
        "\\int\\left(\\vec{F}dt\\right)=\\Delta\\vec{p}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 2,"time": 2,"mass": 1,"force": 1},
        {"time": 1,"force": 1,"momentum": 2},
      ],
    },
    {
      name: "Work",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "W=\\bar{F}\\Delta s \\cos\\left(\\theta\\right)",
        "W=\\int\\left(\\vec{F}\\cdot d\\vec{s}\\right)"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 2,"energy/work": 1,"plane angle": 1},
        {"length": 1,"energy/work": 1,"force": 1},
      ],
    },
    {
      name: "Work-Energy",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\bar{F}\\Delta s\\cos\\left(\\theta\\right)=\\Delta E",
        "\\int\\left(\\vec{F}\\cdot d\\vec{s}\\right)=\\Delta E"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 2,"energy/work": 2,"plane angle": 1,"force": 1},
        {"length": 1,"energy/work": 2,"force": 1},
      ],
    },
    {
      name: "Kinetic Energy",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "K=\\frac{1}{2}mv^{2}",
        "K=\\frac{p^{2}}{2m}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"energy/work": 1,"mass": 1,"velocity": 1},
        {"energy/work": 1,"momentum": 1,"mass": 1},
      ],
    },
    {
      name: "General P.E.",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\Delta U=-\\int\\left(\\vec{F}\\cdot d\\vec{s}\\right)",
        "F=-\\nabla\\left(U\\right)"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1,"energy/work": 2,"force": 1},
        {"energy/work": 1,"force": 1},
      ],
    },
    {
      name: "Gravitational P.E.",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\Delta U_{g}=mg\\Delta h"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 2,"energy/work": 2,"mass": 1,"acceleration": 1},
      ],
    },
    {
      name: "Efficiency",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\eta=\\frac{W_{out}}{E_{in}}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"energy/work": 2, "energy efficiency": 1},
      ],
    },
    {
      name: "Power",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\bar{P}=\\frac{\\Delta W}{\\Delta t}",
        "P=\\frac{dW}{dt}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"time": 2,"energy/work": 2,"power": 1},
        {"energy/work": 1,"power": 1, "time": 1},
      ],
    },
    {
      name: "Power-Velocity",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "P=Fv\\cos\\left(\\theta\\right)",
        "P=\\vec{F}\\cdot\\vec{v}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1,"force": 1,"power": 1,"plane angle": 1},
        {"velocity": 1,"force": 1,"power": 1},
      ],
    },
    {
      name: "Angular Velocity",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\bar{\\omega}=\\frac{\\Delta\\theta}{\\Delta t}",
        "\\omega=\\frac{d\\theta}{dt}",
        "\\vec{v}=\\vec{\\omega}\\times\\vec{r}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"time": 2,"angular velocity": 1,"plane angle": 2},
        {"angular velocity": 1,"plane angle": 1, "time": 1},
        {"velocity": 1,"angular velocity": 1,"length": 1},
      ],
    },
    {
      name: "Angular Acceleration",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\bar{\\alpha}=\\frac{\\Delta\\omega}{\\Delta t}",
        "\\vec{\\alpha}=\\frac{d\\omega}{dt}",
        "\\vec{a}=\\vec{\\alpha}\\times\\vec{r}-\\omega^{2}\\vec{r}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"time": 2,"angular acceleration": 1,"angular velocity": 2},
        {"angular acceleration": 1,"angular velocity": 1, "time": 1},
        {"acceleration": 1,"angular acceleration": 1,"length": 1, "angular velocity": 1},
      ],
    },
    {
      name: "Rotational Kinematics",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\omega=\\omega_{0}+\\alpha t",
        "\\theta=\\theta_{0}+\\omega_{0}t+\\frac{1}{2}\\alpha t^{2}",
        "\\omega^{2}=\\omega_{0}^{2}+2a(\\theta-\\theta_{0})",
        "\\bar{\\omega}=\\frac{1}{2}(\\omega+\\omega_{0})"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"time": 1,"angular velocity": 2, "angular acceleration": 1},
        {"time": 1,"plane angle": 2, "angular velocity": 1,"angular acceleration": 1},
        {"plane angle": 2,"angular velocity": 2,"angular acceleration": 1},
        {"angular velocity": 3},
      ],
    },
    {
      name: "Torque",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\tau=rF\\sin\\left(\\theta\\right)",
        "\\vec{\\tau}=\\vec{r}\\times\\vec{F}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1,"torque/moment of force": 1, "force": 1, "plane angle": 1},
        {"torque/moment of force": 1,"length": 1,"force": 1},
      ],
    },
    {
      name: "2nd Law Of Rotation",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\sum\\vec{\\tau}=I\\vec{\\alpha}",
        "\\sum\\vec{\\tau}=\\frac{d\\vec{L}}{dt}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"torque/moment of force": 1, "moment of inertia": 1, "angular acceleration": 1},
        {"angular momentum": 1, "torque/moment of force": 1, "time": 1},
      ],
    },
    {
      name: "Moment of Inertia",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "I=\\sum mr^{2}",
        "I=\\int\\left(r^{2}dm\\right)"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"moment of inertia": 1, "mass": 1, "length": 1},
        {"moment of inertia": 1, "mass": 1, "length": 1},
      ],
    },
    {
      name: "Rotational Work",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "W=\\bar{\\tau}\\theta",
        "W=\\int\\left(\\tau\\cdot d\\theta\\right)"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"energy/work": 1, "torque/moment of force": 1, "plane angle": 1},
        {"energy/work": 1, "torque/moment of force": 1, "plane angle": 1},
      ],
    },
    {
      name: "Rotational Power",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "P=\\tau\\omega\\cos\\left(\\theta\\right)",
        "P=\\vec{\\tau}\\cdot\\vec{\\omega}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"power": 1, "torque/moment of force": 1,"angular velocity": 1, "plane angle": 1},
        {"power": 1, "torque/moment of force": 1,"angular velocity": 1},
      ],
    },
    {
      name: "Rotational K.E.",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "K=\\frac{1}{2}I\\omega^{2}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"energy/work": 1, "moment of inertia": 1, "angular velocity": 1},
      ],
    },
    {
      name: "Angular Momentum",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "L=mrv\\sin\\left(\\theta\\right)",
        "\\vec{L}=\\vec{r}\\times\\vec{p}",
        "\\vec{L}=I\\vec{\\omega}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1,"length": 1,"mass": 1,"plane angle": 1,"angular momentum": 1},
        {"moment of inertia": 1,"angular velocity": 1,"angular momentum": 1},
        {"angular momentum": 1, "moment of inertia": 1, "angular velocity": 1},
      ],
    },
    {
      name: "Angular Impulse",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\vec{H}=\\vec{\\tau}\\Delta t",
        "\\vec{H}=\\int\\left(\\tau dt\\right)"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"time": 2, "angular impulse": 1, "torque/moment of force": 1},
        {"time": 1, "angular impulse": 1, "torque/moment of force": 1},
      ],
    },
    {
      name: "Universal Gravitation",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\vec{F_{g}}=-\\frac{Gm_{1}m_{2}}{r^{2}}\\hat{r}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1, "mass": 2, "force": 1, "Newtonian constant of gravitation": 1},
      ],
    },
    {
      name: "Gravitational Field",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\vec{g}=-\\frac{Gm}{r^{2}}\\hat{r}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1, "mass": 1, "acceleration": 1, "Newtonian constant of gravitation": 1},
      ],
    },
    {
      name: "Gravitational P.E.",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "U_{g}=-\\frac{Gm_{1}m_{2}}{r}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1,"energy/work": 1,"mass": 2, "Newtonian constant of gravitation": 1},
      ],
    },
    {
      name: "Gravitational Potential",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "V_{g}=-\\frac{Gm}{r}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1, "mass": 1, "Newtonian constant of gravitation": 1, "gravitational potential": 1},
      ],
    },
    {
      name: "Orbital Speed",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "v=\\sqrt{\\frac{Gm}{r}}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1,"length": 1, "mass": 1, "gravitational potential": 1},
      ],
    },
    {
      name: "Escape Speed",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "v=\\sqrt{\\frac{2Gm}{r}}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1,"length": 1, "mass": 1, "gravitational potential": 1},
      ],
    },
    {
      name: "Hooke's Law",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\vec{F}=-k\\Delta x",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 2, "spring constant": 1, "force": 1},
      ],
    },
    {
      name: "Spring P.E.",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "U_{s}=\\frac{1}{2}k\\Delta x^{2}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 2,"energy/work": 1, "spring constant": 1},
      ],
    },
    {
      name: "S.H.O.",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "T=2\\pi\\sqrt{\\frac{m}{k}}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"time": 1, "mass": 1, "spring constant": 1},
      ],
    },
    {
      name: "Simple Pendulum",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "T=2\\pi\\sqrt{\\frac{l}{g}}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"time": 1,"length": 1, "acceleration": 1},
      ],
    },
    {
      name: "Frequency",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "f=\\frac{1}{T}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"time": 1, "frequency": 1},
      ],
    },
    {
      name: "Angular Frequency",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\omega=2\\pi f",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"angular velocity": 1, "frequency": 1},
      ],
    },
    {
      name: "Density",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\rho=\\frac{m}{V}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"mass density": 1, "mass": 1, "volume": 1},
      ],
    },
    {
      name: "Pressure",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "P=\\frac{F}{A}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"force": 1, "area": 1, "pressure": 1},
      ],
    },
    {
      name: "Pressure in a Fluid",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "P=P_{0}+\\rho gh",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"pressure": 2,"length": 1, "mass density": 1, "acceleration": 1},
      ],
    },
    {
      name: "Buoyancy",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "B=\\rho g V_{displaced}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"force": 1, "mass density": 1, "volume": 1, "acceleration": 1},
      ],
    },
    {
      name: "Mass Flow Rate",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\bar{q_{m}}=\\frac{\\Delta m}{\\Delta t}",
        "q_{m}=\\frac{dm}{dt}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"time": 2, "mass": 2, "mass flow rate": 1},
        {"time": 1, "mass": 1, "mass flow rate": 1},
      ],
    },
    {
      name: "Volume Flow Rate",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\bar{q_{v}}=\\frac{\\Delta V}{\\Delta t}",
        "q_{v}=\\frac{dV}{dt}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"time": 2, "volume": 2, "volume flow rate": 1},
        {"time": 1, "volume": 1, "volume flow rate": 1},
      ],
    },
    {
      name: "Mass Continuity",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\rho_{1}A_{1}v_{1}=\\rho_{2}A_{2}v_{2}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 2, "mass density": 2, "area": 2},
      ],
    },
    {
      name: "Volume Continuity",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "A_{1}v_{1}=A_{2}v_{2}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 2, "area": 2},
      ],
    },
    {
      name: "Bernoulli's Equation",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "P_{1}+\\rho gy_{1}+\\frac{1}{2}\\rho v_{1}^{2}=P_{2}+\\rho gy_{2}+\\frac{1}{2}\\rho v_{2}^{2}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 2, "pressure": 2, "length": 2, "acceleration": 1, "mass density": 1},
      ],
    },
    {
      name: "Dynamic Viscosity",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\frac{\\bar{F}}{A}=\\eta\\frac{\\Delta v_{x}}{\\Delta z}",
        "\\frac{F}{A}=\\eta\\frac{dv_{x}}{dz}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1, "force": 1, "area": 1, "dynamic viscosity": 1, "length": 1},
        {"velocity": 1, "force": 1, "area": 1, "dynamic viscosity": 1, "length": 1},
      ],
    },
    {
      name: "Kinematic Viscosity",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\nu=\\frac{\\eta}{\\rho}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"kinematic viscosity": 1, "mass density": 1, "dynamic viscosity": 1},
      ],
    },
    {
      name: "Drag",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "F_{drag}=\\frac{1}{2}\\rho CAv^{2}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1, "mass density": 1, "area": 1, "force": 1, "unitless": 1},
      ],
    },
    {
      name: "Mach Number",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "M=\\frac{v}{c}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1, "speed of light in vacuum": 1, "unitless": 1},
      ],
    },
    {
      name: "Reynolds Number",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "R_e=\\frac{\\rho vD}{\\eta}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1, "mass density": 1, "dynamic viscosity": 1, "length": 1},
      ],
    },
    {
      name: "Froude Number",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "F_r=\\frac{v}{\\sqrt{gl}}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1,"length": 1, "unitless": 1, "acceleration": 1},
      ],
    },
    {
      name: "Young's Modulus",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\frac{F}{A}=E\\frac{\\Delta l}{l_{0}}",
        "\\sigma=E\\epsilon"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 2, "dynamic viscosity": 1, "elasticity": 1, "force": 1, "area": 1},
        {"elasticity": 1, "stress": 1, "strain": 1},
      ],
    },
    {
      name: "Shear Modulus",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\frac{F}{A}=G\\frac{\\Delta x}{y}",
        "\\tau=G\\gamma"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 2, "pressure": 1, "force": 1, "area": 1},
        {"pressure": 1, "strain": 1, "stress": 1,},
      ],
    },
    {
      name: "Bulk Modulus",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\frac{F}{A}=B\\frac{\\Delta V}{V_{0}}",
        "P=B\\theta"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"force": 1, "area": 1, "volume": 2, "pressure": 1},
        {"pressure": 2, "plane angle": 1},
      ],
    },
    {
      name: "Surface Tension",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\gamma=\\frac{F}{l}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"force": 1, "length": 1, "surface tension": 1},
      ],
    },
  ],
  thermal: [
    {
      name: "Solid Expansion",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\Delta l=\\alpha l_{0}\\Delta T",
        "\\Delta A=2\\alpha A_{0}\\Delta T",
        "\\Delta V=3\\alpha V_{0}\\Delta T"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 2, "coefficient of thermal expansion": 1, "thermodynamic temperature": 1},
        {"area": 2, "coefficient of thermal expansion": 1, "thermodynamic temperature": 1},
        {"volume": 2, "coefficient of thermal expansion": 1, "thermodynamic temperature": 1},
      ],
    },
    {
      name: "Liquid Expansion",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\Delta V=\\beta V_{0}\\Delta T",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"volume": 2, "thermodynamic temperature": 1, "coefficient of thermal expansion": 1},
      ],
    },
    {
      name: "Sensible Heat",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "Q=mc\\Delta T",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"energy/work": 1, "mass": 1, "specific heat capacity": 1, "thermodynamic temperature": 1},
      ],
    },
    {
      name: "Latent Heat",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "Q=mL",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"energy/work": 1, "mass": 1, "specific latent heat": 1},
      ],
    },
    {
      name: "Ideal Gas Law",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "PV=nRT",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"volume": 1, "amount of substance": 1, "molar gas constant": 1, "thermodynamic temperature": 1, "pressure": 1},
      ],
    },
    {
      name: "Molecular Constants",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "nR=Nk_b",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"unitless": 1, "molar gas constant": 1, "amount of substance": 1, "Boltzmann constant": 1,},
      ],
    },
    {
      name: "Maxwell-Boltzmann",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "p\\left(v\\right)=\\frac{4v^{2}}{\\sqrt{\\pi}}\\left(\\frac{m}{2k_bT}\\right)^{\\frac{3}{2}}e^{\\frac{-mv^{2}}{2k_bT}}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1, "mass": 1, "Boltzmann constant": 1, "thermodynamic temperature": 1, "momentum": 1},
      ],
    },
    {
      name: "Molecular K.E.",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\bar{K}=\\frac{3}{2}k_bT",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"energy/work": 1, "Boltzmann constant": 1, "thermodynamic temperature": 1},
      ],
    },
    {
      name: "Molecular Speed",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "v_{p}=\\sqrt{\\frac{2k_bT}{m}}",
        "\\bar{v}=\\sqrt{\\frac{8k_bT}{\\pi m}}",
        "v_{rms}=\\sqrt{\\frac{3k_bT}{m}}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1, "mass": 1, "Boltzmann constant": 1, "thermodynamic temperature": 1},
        {"velocity": 1, "mass": 1, "Boltzmann constant": 1, "thermodynamic temperature": 1},
        {"velocity": 1, "mass": 1, "Boltzmann constant": 1, "thermodynamic temperature": 1},
      ],
    },
    {
      name: "Heat Flow Rate",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\bar{P}=\\frac{\\Delta Q}{\\Delta t}",
        "P=\\frac{dQ}{dt}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"time": 1, "power": 1, "energy/work": 1, },
        {"time": 1, "power": 1, "energy/work": 1, },
      ],
    },
    {
      name: "Thermal Conduction",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "P=\\frac{\\kappa A\\Delta T}{l}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"power": 1, "area": 1, "thermodynamic temperature": 1, "length": 1, "thermal conductivity": 1},
      ],
    },
    {
      name: "Stefan-Boltzmann Law",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "P=\\epsilon\\sigma A\\left(T^{4}-T_{0}^{4}\\right)",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"power": 1, "area": 1, "thermodynamic temperature": 2, "Stefan-Boltzmann constant": 1, "unitless": 1},
      ],
    },
    {
      name: "Displacement Law",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\lambda_{max}=\\frac{b}{T}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1, "thermodynamic temperature": 1, "Wien displacement constant": 1},
      ],
    },
    {
      name: "Internal Energy",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\Delta U=\\frac{3}{2}nR\\Delta T",
        "\\Delta U=\\frac{3}{2}Nk_b\\Delta T"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"energy/work": 1, "amount of substance": 1, "molar gas constant": 1, "thermodynamic temperature": 1, },
        {"energy/work": 1, "unitless": 1, "Boltzmann constant": 1, "thermodynamic temperature": 1, },
      ],
    },
    {
      name: "Thermodynamic Work",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "W=-\\int\\left(PdV\\right)",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"energy/work": 1, "pressure": 1, "volume": 1,},
      ],
    },
    {
      name: "1st Law Of Thermo.",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\Delta U=Q+W",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"energy/work": 3},
      ],
    },
    {
      name: "Entropy",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\Delta S=\\frac{\\Delta Q}{T}",
        "S=k_blog\\left(w\\right)"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"entropy": 1, "energy/work": 1, "thermodynamic temperature": 1},
        {"entropy": 1, "unitless": 1, "Boltzmann constant": 1},
      ],
    },
    {
      name: "Efficiency",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\eta_{real}=1-\\frac{Q_C}{Q_H}",
        "\\eta_{ideal}=1-\\frac{T_{C}}{T_{H}}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"energy efficiency": 1, "energy/work": 2},
        {"energy efficiency": 1, "thermodynamic temperature": 2},
      ],
    },
  ],
  waveOptics: [
    {
      name: "Periodic Waves",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "v=f\\lambda",
        "y\\left(x,t\\right)=A\\sin\\left(2\\pi\\left(ft-\\frac{x}{\\lambda}+\\phi\\right)\\right)"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1,"length": 1, "frequency": 1},
        {"length": 3, "velocity": 1, "time": 1, "plane angle": 1, "frequency": 1},
      ],
    },
    {
      name: "Frequency",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "f=\\frac{1}{T}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"frequency": 1, "time": 1},
      ],
    },
    {
      name: "Beat Frequency",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "f_{beat}=f_{high}-f_{low}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"frequency": 3},
      ],
    },
    {
      name: "Intensity",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "I=\\frac{\\bar{P}}{A}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"intensity of radiant energy": 1, "power": 1, "area": 1},
      ],
    },
    {
      name: "Intensity Level",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "L_{I}=10 log\\left(\\frac{I}{I_{0}}\\right)",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"unitless": 1, "intensity of radiant energy": 2},
      ],
    },
    {
      name: "Pressure Level",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "L_{p}=20 log\\left(\\frac{\\Delta P}{\\Delta P_{0}}\\right)",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"unitless": 1, "pressure": 2},
      ],
    },
    {
      name: "Doppler Effect",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\frac{f_{0}}{f_{s}}=\\frac{\\lambda_{s}}{\\lambda_{0}}",
        "\\frac{f_{0}}{f_{s}}=\\frac{c\\pm v_{0}}{c\\mp v_{s}}",
        "\\frac{\\Delta f}{f}\\approx\\frac{\\Delta\\lambda}{\\lambda}",
        "\\frac{\\Delta f}{f}\\approx\\frac{\\Delta v}{c}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 2, "frequency": 2},
        {"velocity": 2,"frequency": 2, "speed of light in vacuum": 1},
        {"length": 2, "frequency": 2},
        {"velocity": 2,"frequency": 2, "speed of light in vacuum": 1},
      ],
    },
    {
      name: "Mach Angle",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\sin\\left(\\mu\\right)=\\frac{c}{v}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1, "speed of light in vacuum": 1, "plane angle": 1},
      ],
    },
    {
      name: "Cerenkov Angle",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\cos\\left(\\theta\\right)=\\frac{c}{nv}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1, "plane angle": 1, "speed of light in vacuum": 1, "index of refraction": 1},
      ],
    },
    {
      name: "Interference Fringes",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "n\\lambda=d\\sin\\left(\\theta\\right)",
        "\\frac{n\\lambda}{d}\\approx\\frac{x}{l}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1, "unitless": 1, "plane angle": 1},
        {"length": 3, "unitless": 1,},
      ],
    },
    {
      name: "Index Of Refraction",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "n=\\frac{c}{v}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1, "index of refraction": 1, "speed of light in vacuum": 1},
      ],
    },
    {
      name: "Snell's Law",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "n_{1}\\sin\\left(\\theta_{1}\\right)=n_{2}\\sin\\left(\\theta_{2}\\right)",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"plane angle": 2, "index of refraction": 2},
      ],
    },
    {
      name: "Critical Angle",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\sin\\left(\\theta_c\\right)=\\frac{n_{2}}{n_{1}}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"plane angle": 1, "index of refraction": 2},
      ],
    },
    {
      name: "Image Location",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\frac{1}{d_{focal}}=\\frac{1}{d_{0}}+\\frac{1}{d_{1}}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 3},
      ],
    },
    {
      name: "Image Size",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "M=\\frac{h_{i}}{h_{0}}=\\frac{d_{i}}{d_{0}}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 2, "unitless": 1},
      ],
    },
    {
      name: "Spherical Mirrors",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "r_{focal}\\approx\\frac{r}{2}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 2},
      ],
    },
  ],
  em: [
    {
      name: "Coulomb's Law",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "F=k\\frac{q_{1}q_{2}}{r^{2}}",
        "\\vec{F}=\\frac{1}{4\\pi\\epsilon_{0}}\\frac{q_{1}q_{2}}{r^{2}}\\hat{r}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1, "electric charge": 2, "Coulomb constant": 1},
        {"length": 1, "Permittivity of vacuum": 1,},
      ],
    },
    {
      name: "Electric Field",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\vec{E}=\\frac{\\vec{F_{E}}}{{q}}",
        "\\vec{E}=k\\sum\\frac{q}{r^{2}}\\hat{r}",
        "\\vec{E}=k\\int\\left(\\frac{dq}{r^{2}}\\hat{r}\\right)"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"electric field strength": 1, "force": 1, "electric charge": 1},
        {"length": 1, "electric field strength": 1, "electric charge": 1, "Coulomb constant": 1},
        {"length": 1, "electric field strength": 1, "Coulomb constant": 1, "electric charge": 1},
      ],
    },
    {
      name: "Electric Potential",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\Delta V=\\frac{\\Delta U_{E}}{q}",
        "V=k\\sum\\frac{q}{r}",
        "V=k\\int\\left(\\frac{dq}{r}\\right)"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"electric potential": 1, "energy/work": 1, "electric charge": 1},
        {"length": 1, "electric potential": 1, "Coulomb constant": 1, "electric charge": 1},
        {"length": 1, "electric potential": 1, "Coulomb constant": 1, "electric charge": 1},
      ],
    },
    {
      name: "Field & Potential",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\bar{E}=\\frac{\\Delta V}{d}",
        "\\vec{E}=-\\nabla V",
        "-\\int\\left(E\\cdot d\\vec{r}\\right)=\\Delta V"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1, "electric field strength": 1, "electric potential": 1},
        {"electric field strength": 1, "electric potential": 1},
        {"length": 1, "electric field strength": 1, "electric potential": 1},
      ],
    },
    {
      name: "Capacitance",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "C=\\frac{Q}{V}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"capacitance": 1, "electric charge": 1, "electric potential": 1},
      ],
    },
    {
      name: "Plate Capacitor",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "C=\\frac{\\kappa\\epsilon_{0}A}{d}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1, "Permittivity of vacuum": 1,"area": 1,"capacitance": 1, "unitless": 1},
      ],
    },
    {
      name: "Cylindrical Capacitor",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "C=\\frac{2\\pi\\kappa\\epsilon_{0}l}{ln\\left(\\frac{r_{2}}{r_{1}}\\right)}",
      ],
      quantities: [
        {"length": 3,"Permittivity of vacuum": 1, "capacitance": 1, "unitless": 1},
      ],
    },
    {
      name: "Spherical Capacitor",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "C=\\frac{4\\pi\\kappa\\epsilon_{0}}{\\left(\\frac{1}{r_{1}}\\right)-\\left(\\frac{1}{r_{2}}\\right)}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 2, "Permittivity of vacuum": 1,"capacitance": 1, "unitless": 1, },
      ],
    },
    {
      name: "Capacitor P.E.",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "U_{c}=\\frac{1}{2}QV",
        "U_{c}=\\frac{1}{2}CV^{2}",
        "U_{c}=\\frac{1}{2}\\frac{Q^{2}}{C}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"energy/work": 1, "electric charge": 1, "electric potential": 1},
        {"energy/work": 1, "capacitance": 1, "electric potential": 1},
        {"energy/work": 1, "capacitance": 1, "electric charge": 1},
      ],
    },
    {
      name: "Electric Current",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\bar{I}=\\frac{\\Delta q}{\\Delta t}",
        "I=\\frac{dq}{dt}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"electric current": 1, "electric charge": 1, "time": 1},
        {"electric current": 1, "electric charge": 1, "time": 1},
      ],
    },
    {
      name: "Charge Density",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\rho=\\frac{Q}{V}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"electric charge density": 1, "electrci charge": 1, "volume": 1},
      ],
    },
    {
      name: "Current Density",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "J=\\frac{I}{A}",
        "\\vec{J}=\\rho\\vec{v}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"current density": 1, "electric current": 1, "area": 1},
        {"velocity": 1, "electric charge density": 1, "current density": 1},
      ],
    },
    {
      name: "Ohm's Law",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "V=IR",
        "\\vec{E}=\\rho\\vec{J}",
        "\\vec{J}=\\sigma\\vec{E}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"electric potential": 1, "electric current": 1, "electric resistance": 1},
        {"electric field strength": 1, "electric charge density": 1, "current density": 1},
        {"current density": 1, "electric field strength": 1, "conductivity": 1},
      ],
    },
    {
      name: "Resitivity-Conductivity",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\rho=\\frac{1}{\\sigma}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"conductivity": 1, "resistivity": 1},
      ],
    },
    {
      name: "Electric Resistance",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "R=\\frac{\\rho l}{A}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1, "electric resistance": 1, "resistivity": 1, "area": 1},
      ],
    },
    {
      name: "Electric Power",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "P=VI=",
        "P=I^{2}R",
        "P=\\frac{V^{2}}{R}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"power": 1, "electric potential": 1, "electric current": 1},
        {"power": 1, "electric resistance": 1, "electric current": 1},
        {"power": 1, "electric potential": 1, "electric resistance": 1},
      ],
    },
    {
      name: "Resistors in series",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "R_{s}=\\sum R_{i}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"electric resistance": 2},
      ],
    },
    {
      name: "Resistors in parallel",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\frac{1}{R_{p}}=\\sum\\frac{1}{R_{i}}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"electric resistance": 2},
      ],
    },
    {
      name: "Capacitors in series",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\frac{1}{C_{s}}=\\sum\\frac{1}{C_{i}}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"capacitance": 2},
      ],
    },
    {
      name: "Capacitors in parallel",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "C_{p}=\\sum C_{i}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"capacitance": 2},
      ],
    },
    {
      name: "Magnetic force, charge",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "F_{B}=qvB\\sin\\left(\\theta\\right)",
        "\\vec{F_{B}}=q\\vec{v}\\times\\vec{B}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1,"force": 1, "electric charge": 1, "plane angle": 1, "magnetic flux density": 1},
        {"velocity": 1,"force": 1, "magnetic flux density": 1, "electric charge": 1,},
      ],
    },
    {
      name: "Magnetic Force, current",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "F_{B}=IlB\\sin\\left(\\theta\\right)",
        "d\\vec{F_{B}}=Id\\vec{l}\\times\\vec{B}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"force": 1, "electric current": 1, "length": 1, "magnetic flux density": 1, "plane angle": 1},
        {"magnetic flux density": 1, "force": 1, "electric current": 1, "length": 1},
      ],
    },
    {
      name: "Biot-savart Law",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\vec{B}=\\frac{\\mu_{0}I}{4\\pi}\\int\\left(\\frac{d\\vec{s}\\times\\hat{r}}{r^{2}}\\right)",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 2, "Permeability of vacuum": 1, "magnetic flux density": 1, "electric current": 1, },
      ],
    },
    {
      name: "Solenoid",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "B=\\mu_{0}nI",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"Permeability of vacuum": 1, "electric current": 1, "magnetic flux density": 1, "wave number": 1},
      ],
    },
    {
      name: "Straight Wire",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "B=\\frac{\\mu_{0}I}{2\\pi r}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1, "Permeability of vacuum": 1, "magnetic flux density": 1, "electric current": 1,},
      ],
    },
    {
      name: "Parallel Wires",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\frac{F_{B}}{\\Delta l}=\\frac{\\mu_{0}}{2\\pi}\\frac{I_{1}I_{2}}{r}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 2, "Permeability of vacuum": 1, "force": 1, "electric current": 2,},
      ],
    },
    {
      name: "Electric Flux",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\Phi_{E}=EA\\cos\\left(\\theta\\right)",
        "\\Phi_{E}=\\int\\left(\\vec{E}\\cdot d\\vec{A}\\right)"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
        {},
      ],
    },
    {
      name: "Magnetic Flux",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\Phi_{B}=BA\\cos\\left(\\theta\\right)",
        "\\Phi_{B}=\\int\\left(\\vec{B}\\cdot d\\vec{A}\\right)"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"magnetic flux": 1, "magnetic flux density": 1, "area": 1, "plane angle": 1},
        {"magnetic flux": 1, "magnetic flux density": 1, "area": 1},
      ],
    },
    {
      name: "Motional Emf",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\xi=Blv",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1, "electric potential": 1, "magnetic flux density": 1, "velocity": 1},
      ],
    },
    {
      name: "Induced Emf",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\bar{\\xi}=-\\frac{\\Delta\\Phi_{B}}{\\Delta t}",
        "\\bar{\\xi}=-\\frac{d\\Phi_{B}}{dt}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"time": 1, "electric potential": 1, "magnetic flux": 1},
        {"time": 1, "electric potential": 1, "magnetic flux": 1},
      ],
    },
    {
      name: "Gauss's Law",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\int\\left(\\vec{E}\\cdot d\\vec{A}\\right)=\\frac{Q}{\\epsilon_{0}}",
        "\\nabla\\cdot\\vec{E}=\\frac{\\rho}{\\epsilon_{0}}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"electric field strength": 1, "area": 1, "electric charge": 1, "Permittivity of vacuum": 1},
        {"Permittivity of vacuum": 1, "electric field strength": 1, "electric charge density": 1},
      ],
    },
    {
      name: "Faraday's Law",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\oint\\vec{E}\\cdot d\\vec{s}=-\\frac{\\partial\\Phi_{B}}{\\partial t}",
        "\\nabla\\times\\vec{E}=-\\frac{\\partial\\vec{B}}{\\partial t}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"time": 1,"length": 1, "electric field strength": 1, "magnetic flux": 1},
        {"time": 1, "magnetic flux density": 1, "electric field strength": 1, },
      ],
    },
    {
      name: "Ampere's Law",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\oint\\vec{B}\\cdot d\\vec{s}=\\mu_{0}\\epsilon_{0}\\frac{\\partial\\phi_{E}}{\\partial t}+\\mu_{0}I",
        "\\nabla\\times\\vec{B}=\\mu_{0}\\epsilon_{0}\\frac{\\partial\\vec{E}}{\\partial t}+\\mu_{0}\\vec{J}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"time": 1,"length": 1, "Permittivity of vacuum": 1, "Permeability of vacuum": 1, "electric current": 1, "magnetic flux density": 1},
        {"time": 1, "Permittivity of vacuum": 1, "Permeability of vacuum": 1, "magnetic flux density": 1, "current density": 1, "magnetic flux density": 1},
      ],
    },
    {
      name: "electromagnetic Plane Wave",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\vec{E}\\left(x,t\\right)=E_{0}\\sin\\left(2\\pi\\left(ft-\\frac{x}{\\lambda}+\\phi\\right)\\right)\\hat{j}",
        "\\vec{B}\\left(x,t\\right)=B_{0}\\sin\\left(2\\pi\\left(ft-\\frac{x}{\\lambda}+\\phi\\right)\\right)\\hat{k}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"time": 1,"length": 2, "electric field strength": 2, "frequency": 1, "plane angle": 1, },
        {"time": 1,"length": 2, "magnetic flux density": 2, "frequency": 1, "plane angle": 1},
      ],
    },
    {
      name: "em wave energy density",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\eta=\\epsilon_{0}E^{2}",
        "\\eta=\\frac{1}{\\mu_{0}}B^{2}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"Permittivity of vacuum": 1, "energy density": 1, "electric field strength": 1, },
        {"Permeability of vacuum": 1, "energy density": 1, "magnetic flux density": 1},
      ],
    },
    {
      name: "Poynting Vector",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\vec{S}=\\frac{1}{\\mu_{0}}\\vec{E}\\times\\vec{B}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"Permeability of vacuum": 1, "magnetic flux density": 1, "electric field strength": 1, "energy flux density": 1},
      ],
    },
    {
      name: "em radiation pressure",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "P=\\frac{1}{2}\\eta",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
      ],
    },
  ],
  modern: [
    {
      name: "Lorentz Factor",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\gamma=\\frac{1}{\\sqrt{1-\\frac{v^{2}}{c^{2}}}}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1,"speed of light in vacuum": 1,"unitless": 1},
      ],
    },
    {
      name: "Time Dilation",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "t=\\frac{t_{0}}{\\sqrt{1-\\frac{v^{2}}{c^{2}}}}",
        "t=\\gamma t_{0}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"time": 2, "velocity": 1, "speed of light in vacuum": 1,},
        {"time": 2, "unitless": 1},
      ],
    },
    {
      name: "Length Contraction",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "l=l_{0}\\sqrt{1-\\frac{v^{2}}{c^{2}}}",
        "l=\\frac{l_{0}}{\\gamma}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1,"length": 2, "speed of light in vacuum": 1,},
        {"length": 2, "unitless": 1},
      ],
    },
    {
      name: "Relative Velocity",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "{u}'=\\frac{u+v}{1+u\\frac{v}{c^{2}}}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 3, "speed of light in vacuum": 1,},
      ],
    },
    {
      name: "Relativistic Energy",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "E=\\frac{mc^{2}}{\\sqrt{1-\\frac{v^{2}}{c^{2}}}}",
        "E=\\gamma mc^{2}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"energy/work": 1, "speed of light in vacuum": 1, "mass": 1, "velocity": 1},
        {"speed of light in vacuum": 1, "energy/work": 1, "mass": 1},
      ],
    },
    {
      name: "Relativistic Momentum",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\vec{p}=\\frac{m\\vec{v}}{\\sqrt{1-\\frac{v^{2}}{c^{2}}}}",
        "\\vec{p}=\\gamma m\\vec{v}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1, "momentum": 1, "mass": 1, "speed of light in vacuum": 1,},
        {"velocity": 1, "unitless": 1, "mass": 1, "momentum": 1,},
      ],
    },
    {
      name: "Energy-momentum",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "E^{2}=p^{2}c^{2}+m^{2}c^{4}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"speed of light in vacuum": 1, "energy/work": 1, "momentum": 1, "mass": 1},
      ],
    },
    {
      name: "Mass-energy",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "E=mc^{2}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"speed of light in vacuum": 1, "mass": 1, "energy/work": 1},
      ],
    },
    {
      name: "Relativistic K.E.",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "K=\\left(\\frac{1}{\\sqrt{1-\\frac{v^{2}}{c^{2}}}}-1\\right)mc^{2}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1, "speed of light in vacuum": 1, "energy/work": 1, "mass": 1, },
      ],
    },
    {
      name: "Relativistic Doppler Effect",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\frac{\\lambda}{\\lambda_{0}}=\\frac{f_{0}}{f}",
        "\\frac{\\lambda}{\\lambda_{0}}=\\sqrt{\\left(1+\\frac{v}{c}\\right)\\left(1-\\frac{v}{c}\\right)^{-1}}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"frequency": 2,"length": 2},
        {"length": 2, "velocity": 1, "speed of light in vacuum": 1,}
      ],
    },
    {
      name: "Photon Energy",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "E=hf",
        "E=pc"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"energy/work": 1, "Planck constant": 1, "frequency": 1},
        {"speed of light in vacuum": 1, "energy/work": 1, "momentum": 1,},
      ],
    },
    {
      name: "Photon Momentum",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "p=\\frac{h}{\\lambda}",
        "p=\\frac{E}{c}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1, "momentum": 1, "Planck constant": 1},
        {"speed of light in vacuum": 1, "energy/work": 1, "momentum": 1,},
      ],
    },
    {
      name: "Photoelectric Effect",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "K_{max}=E-\\phi",
        "K_{max}=h\\left(f-f_{0}\\right)"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"energy/work": 2,},
        {"energy/work": 1, "frequency": 1, "Planck constant": 1},
      ],
    },
    {
      name: "Schrodinger's Equation",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "i\\hbar\\frac{\\partial}{\\partial t}\\Psi\\left(\\vec{r},t\\right)=-\\frac{\\hbar^{2}}{2m}\\nabla^{2}\\Psi\\left(\\vec{r},t\\right)+U\\left(\\vec{r}\\right)\\Psi\\left(\\vec{r},t\\right)",
        "E\\psi\\left(\\vec{r}\\right)=-\\frac{\\hbar^{2}}{2m}\\nabla^{2}\\psi\\left(\\vec{r}\\right)+U\\left(\\vec{r}\\right)\\psi\\left(\\vec{r}\\right)"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"time": 1, "length": 1, "Planck constant": 1, "mass": 1, "energy/work": 1,},
        {"time": 1, "length": 1, "Planck constant": 1, "mass": 1, "energy/work": 1,},
      ],
    },
    {
      name: "Uncertainty Principle",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\Delta p_{x}\\Delta x \\geq\\frac{\\hbar}{2}",
        "\\Delta E \\Delta t \\geq\\frac{\\hbar}{2}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"momentum": 1, "length": 1, "Planck constant": 1},
        {"energy/work": 1, "time": 1, "Planck constant": 1},
      ],
    },
    {
      name: "Rydberg equation",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "\\frac{1}{\\lambda}=-R_{\\infty}\\left(\\frac{1}{n^{2}}-\\frac{1}{n_{0}^{2}}\\right)",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1, "Rydberg constant": 1, "unitless": 2, },
      ],
    },
    {
      name: "Half Life",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "N=N_{0}2^{\\frac{-t}{T_{\\frac{1}{2}}}}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"time": 2, "unitless": 2, },
      ],
    },
    {
      name: "Absorbed Dose",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "D=\\frac{E}{m}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"energy/work": 1, "mass": 1, "specific energy": 1},
      ],
    },
    {
      name: "Effective Dose",
      infoId: RID(),
      info: {
        videos: [],
      },
      equations: [
        "H=QD",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
      ],
    },
  ],
};

ListOfPhysicsConstants = [
  {
    quantity: "velocity",
    quantityDescription: "speed of light in vacuum",
    symbol: "c",
    value: "299792458",
    unit: "\\frac{m}{s}",
    unitString: "m/s",
    unitsMathjs: "1 m/s",
  },
  {
    quantity: "Planck constant",
    quantityDescription: "Planck constant",
    symbol: "h",
    value: "6.62607004081\\times 10^{-34}",
    unit: "J\\cdot s",
    unitString: "J*s",
    unitsMathjs: "1 J s",
  },
  {
    quantity: "Planck constant",
    quantityDescription: "Reduced Plank's constant (h/2pi)",
    symbol: "\\hbar",
    value: "1.05457180027\\times 10^{-34}",
    unit: "J\\cdot s",
    unitString: "J*s",
    unitsMathjs: "1 J s",
  },
  {
    quantity: "Newtonian constant of gravitation",
    quantityDescription: "Newtonian constant of gravitation",
    symbol: "G",
    value: "6.6740831\\times 10^{-11}",
    unit: "\\frac{m^{3}}{kg\\cdot s^{2}}",
    unitString: "(m^3)/(kg*s^2)",
    unitsMathjs: "1 m^3 / (kg s^2)",
  },
  {
    quantity: "acceleration",
    quantityDescription: "Acceleration due to gravity",
    symbol: "g",
    value: "9.8",
    unit: "\\frac{m}{s^2}",
    unitString: "m/s^2",
    unitsMathjs: "1 m / s^2",
  },
  {
    quantity: "Boltzmann constant",
    quantityDescription: "Boltzmann constant",
    symbol: "k_{b}",
    value: "1.380658\\times 10^{-23}",
    unit: "\\frac{J}{K}",
    unitString: "J/K",
    unitsMathjs: "1 J/K",
  },
  {
    quantity: "molar gas constant",
    quantityDescription: "molar gas constant",
    symbol: "R",
    value: "8.314510",
    unit: "\\frac{J}{mol}\\cdot K",
    unitString: "(J*K)/(mol)",
    unitsMathjs: "1 J K / mol",
  },
  {
    quantity: "Avogadro's number",
    quantityDescription: "Avogadro's number",
    symbol: "N_{A}",
    value: "6.0221367\\times 10^{23}",
    unit: "mol^{-1}",
    unitString: "1/mol",
    unitsMathjs: "1 / mol",
  },
  {
    quantity: "electric charge",
    quantityDescription: "Charge of electron",
    symbol: "e",
    value: "1.602176620898\\times 10^{-19}",
    unit: "C",
    unitString: "C",
    unitsMathjs: "1 C",
  },
  {
    quantity: "Permeability of vacuum",
    quantityDescription: "Permeability of vacuum",
    symbol: "\\mu_{0}",
    value: "4\\pi\\times 10^{-7}",
    unit: "\\frac{N}{A^{2}}",
    unitString: "N/(A^2)",
    unitsMathjs: "1 N / A^2",
  },
  {
    quantity: "Permittivity of vacuum",
    quantityDescription: "Permittivity of vacuum",
    symbol: "\\epsilon_{0}",
    value: "8.854187817\\times 10^{-12}",
    unit: "\\frac{F}{m}",
    unitString: "F/m",
    unitsMathjs: "1 F / m",
  },
  {
    quantity: "Coulomb constant",
    quantityDescription: "Coulomb constant",
    symbol: "k",
    value: "8.987552\\times 10^{9}",
    unit: "N\\cdot\\frac{m^{2}}{C^{2}}",
    unitString: "N*(m^2)/(C^2)",
    unitsMathjs: "1 N m^2 / C^2",
  },
  {
    quantity: "Faraday constant",
    quantityDescription: "Faraday constant",
    symbol: "F",
    value: "96485.309",
    unit: "\\frac{C}{mol}",
    unitString: "C/mol",
    unitsMathjs: "1 C / mol",
  },
  {
    quantity: "mass",
    quantityDescription: "electron mass",
    symbol: "m_{e}",
    value: "9.1093835611\\times 10^{-31}",
    unit: "kg",
    unitString: "kg",
    unitsMathjs: "1 kg",
  },
  {
    quantity: "mass",
    quantityDescription: "proton mass",
    symbol: "m_{p}",
    value: "1.67262189821\\times 10^{-27}",
    unit: "kg",
    unitString: "kg",
    unitsMathjs: "1 kg",
  },
  {
    quantity: "mass",
    quantityDescription: "neutron mass",
    symbol: "m_{n}",
    value: "1.6726231\\times 10^{-27}",
    unit: "kg",
    unitString: "kg",
    unitsMathjs: "1 kg",
  },
  {
    quantity: "mass",
    quantityDescription: "Atomic mass unit",
    symbol: "u",
    value: "1.6605402\\times 10^{-27}",
    unit: "kg",
    unitString: "kg",
    unitsMathjs: "1 kg",
  },
  {
    quantity: "Stefan-Boltzmann constant",
    quantityDescription: "Stefan-Boltzmann constant",
    symbol: "\\sigma",
    value: "5.67051\\times 10^{-8}",
    unit: "\\frac{W}{m^{2}}\\cdot K^{4}",
    unitString: "W/(m^2)*K^4",
    unitsMathjs: "1 W K^4 / m^2",
  },
  {
    quantity: "Rydberg constant",
    quantityDescription: "Rydberg constant",
    symbol: "R_{\\infty}",
    value: "10973731.534",
    unit: "m^{-1}",
    unitString: "1/m",
    unitsMathjs: "1 / m",
  },
  {
    quantity: "Bohr magneton",
    quantityDescription: "Bohr magneton",
    symbol: "\\mu_{B}",
    value: "9.2740154\\times 10^{-24}",
    unit: "\\frac{J}{T}",
    unitString: "J/T",
    unitsMathjs: "1 J / T",
  },
  {
    quantity: "magnetic flux",
    quantityDescription: "magnetic flux quantum h/2e",
    symbol: "\\Phi_{0}",
    value: "2.06783383113\\times 10^{-15}",
    unit: "Wb",
    unitString: "Wb",
    unitsMathjs: "1 Wb",
  },
  {
    quantity: "Wien displacement constant",
    quantityDescription: "Wien displacement constant",
    symbol: "b",
    value: "2.897756\\times 10^{-3}",
    unit: "m\\cdot K",
    unitString: "m*K",
    unitsMathjs: "1 m K",
  },
];
