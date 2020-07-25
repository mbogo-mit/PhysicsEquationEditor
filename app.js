const express = require('express');
const request = require('request');
const path = require('path');
const ejs = require('ejs');
const app = express();
const PORT = 3000;
const APPID = "UX9RLT-6T2797PJPJ";

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.listen(PORT, () => console.log(`listening at http://localhost:${PORT}`));

app.get('/', (req, res, next)=>{
  res.render('pages/index',{loe: ListOfEquations, lopc: ListOfPhysicsConstants, ImportVariableDefinitions: ImportVariableDefinitions});
});

ListOfEquations = {
  mechanics: [
    {
      name: "Velocity",
      info: {},
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
      info: {},
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
      info: {},
      equations: [
        "v=v_{0}+at",
        "s=s_{0}+v_{0}t+\\frac{1}{2}at^{2}",
        "v^{2}=v_{0}^{2} + 2a(s-s_{0})",
        "\\bar{v}=\\frac{1}{2}(v+v_{0})"
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
      info: {},
      equations: [
        "\\sum F = m\\vec{a}",
        "\\sum F = \\frac{d\\vec{p}}{dt}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"acceleration": 1,"force": 1,"mass": 1},
        {"force": 1,"momentum": 1, "time": 1},
      ],
    },
    {
      name: "Weight",
      info: {},
      equations: [
        "\\vec{W}=m\\vec{g}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"force": 1,"mass": 1,"acceleration": 1},
      ],
    },
    {
      name: "Dry Friction",
      info: {},
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
      info: {},
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
      info: {},
      equations: [
        "\\vec{p}=m\\vec{v}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1,"mass": 1,"momentum": 1},
      ],
    },
    {
      name: "Impulse",
      info: {},
      equations: [
        "\\vec{J}=\\bar{F}\\Delta t",
        "\\vec{J}=\\int\\vec{F}dt"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"time": 2,"force": 1,"impulse": 1},
        {"time": 1,"force": 1,"impulse": 1},
      ],
    },
    {
      name: "Impulse-momentum",
      info: {},
      equations: [
        "\\bar{F}\\Delta t=m\\Delta\\vec{v}",
        "\\int\\vec{F}dt=\\Delta\\vec{p}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 2,"time": 2,"mass": 1,"force": 1},
        {"time": 1,"force": 1,"momentum": 2},
      ],
    },
    {
      name: "Work",
      info: {},
      equations: [
        "W=\\bar{F}\\Delta s \\cos\\theta",
        "W=\\int\\vec{F}\\cdot d\\vec{s}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 2,"energy/work": 1,"plane angle": 1},
        {"length": 1,"energy/work": 1,"force": 1},
      ],
    },
    {
      name: "Work-Energy",
      info: {},
      equations: [
        "\\bar{F}\\Delta s\\cos\\theta=\\Delta E",
        "\\int\\vec{F}\\cdot d\\vec{s}=\\Delta E"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 2,"energy/work": 2,"plane angle": 1,"force": 1},
        {"length": 1,"energy/work": 2,"force": 1},
      ],
    },
    {
      name: "Kinetic Energy",
      info: {},
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
      info: {},
      equations: [
        "\\Delta U=-\\int\\vec{F}\\cdot d\\vec{s}",
        "F=-\\nabla(U)"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1,"energy/work": 2,"force": 1},
        {"energy/work": 1,"force": 1},
      ],
    },
    {
      name: "Gravitational P.E.",
      info: {},
      equations: [
        "\\Delta U_{g}=mg\\Delta h"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 2,"energy/work": 2,"mass": 1,"acceleration": 1},
      ],
    },
    {
      name: "Efficiency",
      info: {},
      equations: [
        "\\eta=\\frac{W_{out}}{E_{in}}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"energy/work": 2, "energy efficiency": 1},
      ],
    },
    {
      name: "Power",
      info: {},
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
      info: {},
      equations: [
        "P=Fv\\cos\\theta",
        "P=\\vec{F}\\cdot\\vec{v}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1,"force": 1,"power": 1,"plane angle": 1},
        {"velocity": 1,"force": 1,"power": 1},
      ],
    },
    {
      name: "Angular Velocity",
      info: {},
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
      info: {},
      equations: [
        "\\bar{\\alpha}=\\frac{\\Delta\\omega}{\\Delta t}",
        "\\vec{\\alpha}=\\frac{d\\omega}{dt}",
        "\\vec{a}=\\vec{\\alpha}\\times\\vec{r}-\\omega^{2}\\vec{r}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"time": 2,"angular acceleration": 1,"angular velocity": 2},
        {"angular acceleration": 1,"angular velocity": 1, "time": 1},
        {"acceleration": 1,"angular acceleration": 1,"length": 1,},
      ],
    },
    {
      name: "Rotational Kinematics",
      info: {},
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
      info: {},
      equations: [
        "\\tau=rF\\sin\\theta",
        "\\vec{\\tau}=\\vec{r}\\times\\vec{F}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1,"torque/moment of force": 1, "force": 1, "plane angle": 1},
        {"torque/moment of force": 1,"length": 1,"force": 1},
      ],
    },
    {
      name: "2nd Law Of Rotation",
      info: {},
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
      info: {},
      equations: [
        "I=\\sum mr^{2}",
        "I=\\int r^{2}dm"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"moment of inertia": 1, "mass": 1, "length": 1},
        {"moment of inertia": 1, "mass": 1, "length": 1},
      ],
    },
    {
      name: "Rotational Work",
      info: {},
      equations: [
        "W=\\bar{\\tau}\\theta",
        "W=\\int\\tau\\cdot d\\theta"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"energy/work": 1, "torque/moment of force": 1, "plane angle": 1},
        {"energy/work": 1, "torque/moment of force": 1, "plane angle": 1},
      ],
    },
    {
      name: "Rotational Power",
      info: {},
      equations: [
        "P=\\tau\\omega\\cos\\theta",
        "P=\\vec{\\tau}\\cdot\\vec{\\omega}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"power": 1, "torque/moment of force": 1,"angular velocity": 1, "plane angle": 1},
        {"power": 1, "torque/moment of force": 1,"angular velocity": 1},
      ],
    },
    {
      name: "Rotational K.E.",
      info: {},
      equations: [
        "K=\\frac{1}{2}I\\omega^{2}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"energy/work": 1, "moment of inertia": 1, "angular velocity": 1},
      ],
    },
    {
      name: "Angular Momentum",
      info: {},
      equations: [
        "L=mrv\\sin\\theta",
        "\\vec{L}=\\vec{r}\\times\\vec{p}",
        "\\vec{L}=I\\vec{\\omega}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1,"length": 1,"mass": 1,"plane angle": 1,"angular momentum": 1},
        {"moment of inertia": 1,"angular velocity": 1,"angular momentum": 1},
        [],
      ],
    },
    {
      name: "Angular Impulse",
      info: {},
      equations: [
        "\\vec{H}=\\vec{\\tau}\\Delta t",
        "\\vec{H}=\\int\\tau dt"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"time": 2, "angular impulse": 1, "torque/moment of force": 1},
        {"time": 1, "angular impulse": 1, "torque/moment of force": 1},
      ],
    },
    {
      name: "Universal Gravitation",
      info: {},
      equations: [
        "\\vec{F_{g}}=-\\frac{Gm_{1}m_{2}}{r^{2}}\\hat{r}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1, "mass": 2, "force": 1, "Newtonian constant of gravitation": 1},
      ],
    },
    {
      name: "Gravitational Field",
      info: {},
      equations: [
        "\\vec{g}=-\\frac{Gm}{r^{2}}\\hat{r}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1, "mass": 1, "acceleration": 1, "Newtonian constant of gravitation": 1},
      ],
    },
    {
      name: "Gravitational P.E.",
      info: {},
      equations: [
        "U_{g}=-\\frac{Gm_{1}m_{2}}{r}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1,"energy/work": 1,"mass": 2, "Newtonian constant of gravitation": 1},
      ],
    },
    {
      name: "Gravitational Potential",
      info: {},
      equations: [
        "V_{g}=-\\frac{Gm}{r}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1, "mass": 1, "Newtonian constant of gravitation": 1, "gravitational potential": 1},
      ],
    },
    {
      name: "Orbital Speed",
      info: {},
      equations: [
        "v=\\sqrt{\\frac{Gm}{r}}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1,"length": 1, "mass": 1, "gravitational potential": 1},
      ],
    },
    {
      name: "Escape Speed",
      info: {},
      equations: [
        "v=\\sqrt{\\frac{2Gm}{r}}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1,"length": 1, "mass": 1, "gravitational potential": 1},
      ],
    },
    {
      name: "Hooke's Law",
      info: {},
      equations: [
        "\\vec{F}=-k\\Delta x",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 2, "spring constant": 1, "force": 1},
      ],
    },
    {
      name: "Spring P.E.",
      info: {},
      equations: [
        "U_{s}=\\frac{1}{2}k\\Delta x^{2}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 2,"energy/work": 1, "spring constant": 1},
      ],
    },
    {
      name: "S.H.O.",
      info: {},
      equations: [
        "T=2\\pi\\sqrt{\\frac{m}{k}}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"time": 1, "mass": 1, "spring constant": 1},
      ],
    },
    {
      name: "Simple Pendulum",
      info: {},
      equations: [
        "T=2\\pi\\sqrt{\\frac{l}{g}}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"time": 1,"length": 1, "acceleration": 1},
      ],
    },
    {
      name: "Frequency",
      info: {},
      equations: [
        "f=\\frac{1}{T}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"time": 1, "frequency": 1},
      ],
    },
    {
      name: "Angular Frequency",
      info: {},
      equations: [
        "\\omega=2\\pi f",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"angular velocity": 1, "frequency": 1},
      ],
    },
    {
      name: "Density",
      info: {},
      equations: [
        "\\rho=\\frac{m}{V}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"mass density": 1, "mass": 1, "volume": 1},
      ],
    },
    {
      name: "Pressure",
      info: {},
      equations: [
        "P=\\frac{F}{A}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"force": 1, "area": 1, "pressure": 1},
      ],
    },
    {
      name: "Pressure in a Fluid",
      info: {},
      equations: [
        "P=P_{0}+\\rho gh",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"pressure": 2,"length": 1, "mass density": 1, "acceleration": 1},
      ],
    },
    {
      name: "Buoyancy",
      info: {},
      equations: [
        "B=\\rho g V_{displaced}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"force": 1, "mass density": 1, "volume": 1, "acceleration": 1},
      ],
    },
    {
      name: "Mass Flow Rate",
      info: {},
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
      info: {},
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
      info: {},
      equations: [
        "\\rho_{1}A_{1}v_{1}=\\rho_{2}A_{2}v_{2}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 2, "mass density": 2, "area": 2},
      ],
    },
    {
      name: "Volume Continuity",
      info: {},
      equations: [
        "A_{1}v_{1}=A_{2}v_{2}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 2, "area": 2},
      ],
    },
    {
      name: "Bernoulli's Equation",
      info: {},
      equations: [
        "P_{1}+\\rho gy_{1}+\\frac{1}{2}\\rho v_{1}^{2}=P_{2}+\\rho gy_{2}+\\frac{1}{2}\\rho v_{2}^{2}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 2, "pressure": 2, "length": 2, "acceleration": 1, "mass density": 1},
      ],
    },
    {
      name: "Dynamic Viscosity",
      info: {},
      equations: [
        "\\frac{\\bar{F}}{A}=\\eta\\frac{\\Delta v_{x}}{\\Delta z}",
        "\\frac{F}{A}=\\eta\\frac{dv_{x}}{dz}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1},
        {"velocity": 1},
      ],
    },
    {
      name: "Kinematic Viscosity",
      info: {},
      equations: [
        "v=\\frac{\\eta}{\\rho}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1, "mass density": 1, "dynamic viscosity": 1},
      ],
    },
    {
      name: "Drag",
      info: {},
      equations: [
        "R=\\frac{1}{2}\\rho CAv^{2}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1, "mass density": 1, "area": 1},
      ],
    },
    {
      name: "Mach Number",
      info: {},
      equations: [
        "Ma=\\frac{v}{c}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1, "speed of light in vacuum": 1},
      ],
    },
    {
      name: "Reynolds Number",
      info: {},
      equations: [
        "Re=\\frac{\\rho vD}{\\eta}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1, "mass density": 1},
      ],
    },
    {
      name: "Froude Number",
      info: {},
      equations: [
        "Fr=\\frac{v}{\\sqrt{gl}}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1,"length": 1},
      ],
    },
    {
      name: "Young's Modulus",
      info: {},
      equations: [
        "\\frac{F}{A}=E\\frac{\\Delta l}{l_{0}}",
        "\\sigma=E\\varepsilon"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1},
        [],
      ],
    },
    {
      name: "Shear Modulus",
      info: {},
      equations: [
        "\\frac{F}{A}=G\\frac{\\Delta x}{y}",
        "\\tau=G\\gamma"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1},
        [],
      ],
    },
    {
      name: "Bulk Modulus",
      info: {},
      equations: [
        "\\frac{F}{A}=K\\frac{Delta V}{V_{0}}",
        "P=K\\theta"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
        {},
      ],
    },
    {
      name: "Surface Tension",
      info: {},
      equations: [
        "\\gamma=\\frac{F}{l}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"force": 1, "length": 1},
      ],
    },
  ],
  thermal: [
    {
      name: "Solid Expansion",
      info: {},
      equations: [
        "\\Delta l=\\alpha l_{0}\\Delta T",
        "\\Delta A=2\\alpha A_{0}\\Delta T",
        "\\Delta V=3\\alpha V_{0}\\Delta T"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1},
        {},
        {},
      ],
    },
    {
      name: "Liquid Expansion",
      info: {},
      equations: [
        "\\Delta V=\\beta V_{0}\\Delta T",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
      ],
    },
    {
      name: "Sensible Heat",
      info: {},
      equations: [
        "Q=mc\\Delta T",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
      ],
    },
    {
      name: "Latent Heat",
      info: {},
      equations: [
        "Q=mL",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
      ],
    },
    {
      name: "Ideal Gas Law",
      info: {},
      equations: [
        "PV=nRT",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"volume": 1, "amount of substance": 1, "molar gas constant": 1, "thermodynamic temperature": 1, "pressure": 1},
      ],
    },
    {
      name: "Molecular Constants",
      info: {},
      equations: [
        "nR=Nk",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
      ],
    },
    {
      name: "Maxwell-Boltzmann",
      info: {},
      equations: [
        "p(v)=\\frac{4v_{2}}{\\sqrt{\\pi}}(\\frac{m}{2kT})^{\\frac{3}{2}}e^{\\frac{-mv^{2}}{2kT}}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1},
      ],
    },
    {
      name: "Molecular K.E.",
      info: {},
      equations: [
        "<K>=\\frac{3}{2}kT",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
      ],
    },
    {
      name: "Molecular Speed",
      info: {},
      equations: [
        "v_{p}=\\sqrt{\\frac{2kT}{m}}",
        "<v>=\\sqrt{\\frac{8kT}{\\pi m}}",
        "v_{rms}=\\sqrt{\\frac{3kT}{m}}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1},
        {"velocity": 1},
        {"velocity": 1},
      ],
    },
    {
      name: "Heat Flow Rate",
      info: {},
      equations: [
        "\\bar{P}=\\frac{\\Delta Q}{\\Delta t}",
        "P=\\frac{dQ}{dt}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"time": 1},
        {"time": 1},
      ],
    },
    {
      name: "Thermal Conduction",
      info: {},
      equations: [
        "P=\\frac{kA\\Delta T}{l}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
      ],
    },
    {
      name: "Stefan-Boltzmann Law",
      info: {},
      equations: [
        "P=\\varepsilon\\sigma A(T^{4}-T_{0}^{4})",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
      ],
    },
    {
      name: "Displacement Law",
      info: {},
      equations: [
        "\\lambda_{max}=\\frac{b}{T}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
      ],
    },
    {
      name: "Internal Energy",
      info: {},
      equations: [
        "\\Delta U=\\frac{3}{2}nR\\Delta T",
        "\\Delta U=\\frac{3}{2}NK\\Delta T"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
        {},
      ],
    },
    {
      name: "Thermodynamic Work",
      info: {},
      equations: [
        "W=-\\int PdV",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
      ],
    },
    {
      name: "1st Law Of Thermo.",
      info: {},
      equations: [
        "\\Delta U=Q+W",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
      ],
    },
    {
      name: "Entropy",
      info: {},
      equations: [
        "\\Delta S=\\frac{\\Delta Q}{T}",
        "S=klog(w)"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
        {},
      ],
    },
    {
      name: "Efficiency",
      info: {},
      equations: [
        "\\eta_{real}=1-\\frac{Q_C}{Q_H}",
        "\\eta_{ideal}=1-\\frac{T_{C}}{T_{H}}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
        [],
      ],
    },
    {
      name: "C.O.P.",
      info: {},
      equations: [
        "COP_{real}=\\frac{Q_{C}}{Q_{H}-Q_{C}}",
        "COP_{ideal}=\\frac{T_{C}}{T_{H}-T_{C}}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
        {},
      ],
    },
  ],
  waveOptics: [
    {
      name: "Periodic Waves",
      info: {},
      equations: [
        "v=f\\lambda",
        "f(x,t)=A\\sin(2\\pi(ft-\\frac{x}{\\lambda}+\\phi))"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1,"length": 1},
        [],
      ],
    },
    {
      name: "Frequency",
      info: {},
      equations: [
        "f=\\frac{1}{T}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
      ],
    },
    {
      name: "Beat Frequency",
      info: {},
      equations: [
        "f_{beat}=f_{high}-f_{low}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
      ],
    },
    {
      name: "Intensity",
      info: {},
      equations: [
        "I=\\frac{<P>}{A}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
      ],
    },
    {
      name: "Intensity Level",
      info: {},
      equations: [
        "L_{I}=10 log(\\frac{I}{I_{0}})",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
      ],
    },
    {
      name: "Pressure Level",
      info: {},
      equations: [
        "L_{p}=20 log(\\frac{\\Delta P}{\\Delta P_{0}})",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
      ],
    },
    {
      name: "Doppler Effect",
      info: {},
      equations: [
        "\\frac{f_{0}}{f_{s}}=\\frac{\\lambda_{s}}{\\lambda_{0}}=\\frac{c\\pm v_{0}}{c\\mp v_{s}}",
        "\\frac{\\Delta f}{f}\\approx\\frac{\\Delta\\lambda}{\\lambda}\\approx\\frac{\\Delta v}{c}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1,"length": 1},
        {"velocity": 1,"length": 1},
      ],
    },
    {
      name: "Mach Angle",
      info: {},
      equations: [
        "\\sin\\mu=\\frac{c}{v}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1, "speed of light in vacuum": 1},
      ],
    },
    {
      name: "Cerenkov Angle",
      info: {},
      equations: [
        "\\cos\\theta=\\frac{c}{nv}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1},
      ],
    },
    {
      name: "Interference Fringes",
      info: {},
      equations: [
        "n\\lambda=d\\sin\\theta",
        "\\frac{n\\lambda}{d}\\approx\\frac{x}{L}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1},
        {"length": 1},
      ],
    },
    {
      name: "Index Of Refraction",
      info: {},
      equations: [
        "n=\\frac{c}{v}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1},
      ],
    },
    {
      name: "Snell's Law",
      info: {},
      equations: [
        "n_{1}\\sin\\theta_{1}=n_{2}\\sin\\theta_{2}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
      ],
    },
    {
      name: "Critical Angle",
      info: {},
      equations: [
        "\\sin\\theta_c=\\frac{n_{2}}{n_{1}}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
      ],
    },
    {
      name: "Image Location",
      info: {},
      equations: [
        "\\frac{1}{f}=\\frac{1}{d_{0}}+\\frac{1}{d_{1}}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1},
      ],
    },
    {
      name: "Image Size",
      info: {},
      equations: [
        "M=\\frac{h_{i}}{h_{0}}=\\frac{d_{i}}{d_{0}}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1},
      ],
    },
    {
      name: "Spherical Mirrors",
      info: {},
      equations: [
        "f\\approx\\frac{r}{2}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1},
      ],
    },
  ],
  em: [
    {
      name: "Coulomb's Law",
      info: {},
      equations: [
        "F=k\\frac{q_{1}q_{2}}{r^{2}}",
        "\\vec{F}=\\frac{1}{4\\pi\\varepsilon_{0}}\\frac{q_{1}q_{2}}{r^{2}}\\hat{r}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1},
        {"length": 1},
      ],
    },
    {
      name: "Electric Field",
      info: {},
      equations: [
        "\\vec{E}=\\vec{F_{E}}{q}",
        "\\vec{E}=k\\sum\\frac{q}{r^{2}}\\hat{r}",
        "\\vec{E}=k\\int\\frac{dq}{r^{2}}\\hat{r}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        [],
        {"length": 1},
        {"length": 1},
      ],
    },
    {
      name: "Electric Potential",
      info: {},
      equations: [
        "\\Delta V=\\frac{\\Delta U_{E}}{q}",
        "V=k\\sum\\frac{q}{r}",
        "V=k\\int\\frac{dq}{r}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
        {"length": 1},
        {"length": 1},
      ],
    },
    {
      name: "Field & Potential",
      info: {},
      equations: [
        "\\bar{E}=\\frac{\\Delta V}{d}",
        "\\vec{E}=-\\nabla V",
        "-\\int E\\cdot d\\vec{r}=\\Delta V"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1},
        {},
        {"length": 1},
      ],
    },
    {
      name: "Capacitance",
      info: {},
      equations: [
        "C=\\frac{Q}{V}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
      ],
    },
    {
      name: "Plate Capacitor",
      info: {},
      equations: [
        "C=\\frac{\\kappa\\varepsilon_{0}A}{d}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1},
      ],
    },
    {
      name: "Cylindrical Capacitor",
      info: {},
      equations: [
        "C=\\frac{2\\pi\\kappa\\varepsilon_{0}l}{ln(\\frac{r_{2}}{r_{1}})}",
      ],
      quantities: [
        {"length": 1},
      ],
    },
    {
      name: "Spherical Capacitor",
      info: {},
      equations: [
        "C=\\frac{4\\pi\\kappa\\varepsilon_{0}}{(\\frac{1}{r_{1}})-(\\frac{1}{r^{2}})}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1},
      ],
    },
    {
      name: "Capacitor P.E.",
      info: {},
      equations: [
        "U_{c}=\\frac{1}{2}QV=\\frac{1}{2}CV^{2}=\\frac{1}{2}\\frac{Q^{2}}{C}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
      ],
    },
    {
      name: "Electric Current",
      info: {},
      equations: [
        "\\bar{I}=\\frac{\\Delta q}{\\Delta t}",
        "I=\\frac{dq}{dt}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"time": 1},
        {"time": 1},
      ],
    },
    {
      name: "Charge Density",
      info: {},
      equations: [
        "\\rho=\\frac{Q}{V}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
      ],
    },
    {
      name: "Current Density",
      info: {},
      equations: [
        "J=\\frac{I}{A}",
        "\\vec{J}=\\rho\\vec{v}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
        {"velocity": 1},
      ],
    },
    {
      name: "Ohm's Law",
      info: {},
      equations: [
        "V=IR",
        "\\vec{E}=\\rho\\vec{J}",
        "\\vec{J}=\\sigma\\vec{E}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
        {},
        {},
      ],
    },
    {
      name: "Resitivity-Conductivity",
      info: {},
      equations: [
        "\\rho=\\frac{1}{\\sigma}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
      ],
    },
    {
      name: "Electric Resistance",
      info: {},
      equations: [
        "R=\\frac{\\rho l}{A}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1},
      ],
    },
    {
      name: "Electric Power",
      info: {},
      equations: [
        "P=VI=I^{2}R=\\frac{V^{2}}{R}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
      ],
    },
    {
      name: "Resistors in series",
      info: {},
      equations: [
        "R_{s}=\\sum R_{i}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
      ],
    },
    {
      name: "Resistors in parallel",
      info: {},
      equations: [
        "\\frac{1}{R_{p}}=\\sum\\frac{1}{R_{i}}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
      ],
    },
    {
      name: "Capacitors in series",
      info: {},
      equations: [
        "\\frac{1}{C_{s}}=\\sum\\frac{1}{C_{i}}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
      ],
    },
    {
      name: "Capacitors in parallel",
      info: {},
      equations: [
        "C_{p}=\\sum C_{i}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
      ],
    },
    {
      name: "Magnetic force, charge",
      info: {},
      equations: [
        "F_{B}=qvB\\sin\\theta",
        "\\vec{F_{B}}=q\\vec{v}\\times\\vec{B}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1,"length": 1},
        {"velocity": 1,"length": 1},
      ],
    },
    {
      name: "Magnetic Force, current",
      info: {},
      equations: [
        "F_{B}=IlB\\sin\\theta",
        "d\\vec{F_{B}}=Id\\vec{l}\\times\\vec{B}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
        {},
      ],
    },
    {
      name: "Biot-savart Law",
      info: {},
      equations: [
        "\\vec{B}=\\frac{\\mu_{0}I}{4\\pi}\\int\\frac{d\\vec{s}\\times\\hat{r}}{r^{2}}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1},
      ],
    },
    {
      name: "Solenoid",
      info: {},
      equations: [
        "B=\\mu_{0}nI",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
      ],
    },
    {
      name: "Straight Wire",
      info: {},
      equations: [
        "B=\\frac{\\mu_{0}I}{2\\pi r}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1},
      ],
    },
    {
      name: "Parallel Wires",
      info: {},
      equations: [
        "\\frac{F_{B}}{l}=\\frac{\\mu_{0}}{2\\pi}\\frac{I_{1}I_{2}}{r}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1},
      ],
    },
    {
      name: "Electric Flux",
      info: {},
      equations: [
        "\\phi_{E}=EA\\cos\\theta",
        "\\phi_{E}=\\int\\vec{E}\\cdot d\\vec{A}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
        {},
      ],
    },
    {
      name: "Magnetic Flux",
      info: {},
      equations: [
        "\\phi_{E}=BA\\cos\\theta",
        "\\phi_{E}=\\int\\vec{B}\\cdot d\\vec{A}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
        {},
      ],
    },
    {
      name: "Motional Emf",
      info: {},
      equations: [
        "\\xi=Blv",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1},
      ],
    },
    {
      name: "Induced Emf",
      info: {},
      equations: [
        "\\bar{\\xi}=-\\frac{\\Delta\\phi_{B}}{\\Delta t}",
        "\\bar{\\xi}=-\\frac{d\\phi_{B}}{dt}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"time": 1},
        {"time": 1},
      ],
    },
    {
      name: "Gauss's Law",
      info: {},
      equations: [
        "\\iint\\vec{E}\\cdot d\\vec{A}=\\frac{Q}{\\varepsilon_{0}}",
        "\\nabla\\cdot\\vec{E}=\\frac{\\rho}{\\varepsilon_{0}}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
        {},
      ],
    },
    {
      name: "Faraday's Law",
      info: {},
      equations: [
        "\\oint\\vec{E}\\cdot d\\vec{s}=-\\frac{\\partial\\phi_{B}}{\\partial t}",
        "\\nabla\\times\\vec{E}=-\\frac{\\partial\\vec{B}}{\\partial t}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"time": 1,"length": 1},
        {"time": 1},
      ],
    },
    {
      name: "Ampere's Law",
      info: {},
      equations: [
        "\\oint\\vec{B}\\cdot d\\vec{s}=\\mu_{0}\\varepsilon_{0}\\frac{\\partial\\phi_{E}}{\\partial t}+\\mu_{0}I",
        "\\nabla\\times\\vec{B}=\\mu_{0}\\varepsilon_{0}\\frac{\\partial\\vec{E}}{\\partial t}+\\mu_{0}\\vec{J}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"time": 1,"length": 1},
        {"time": 1},
      ],
    },
    {
      name: "electromagnetic Plane Wave",
      info: {},
      equations: [
        "\\vec{E}(x,t)=E_{0}\\sin[2\\pi(ft-\\frac{x}{\\lambda}+\\phi)]\\hat{j}",
        "\\vec{B}(x,t)=B_{0}\\sin[2\\pi(ft-\\frac{x}{\\lambda}+\\phi)]\\hat{k}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"time": 1,"length": 1},
        {"time": 1,"length": 1},
      ],
    },
    {
      name: "em wave energy density",
      info: {},
      equations: [
        "\\eta=\\varepsilon_{0}E^{2}",
        "\\eta=\\frac{1}{\\mu_{0}}B^{2}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
        {},
      ],
    },
    {
      name: "Poynting Vector",
      info: {},
      equations: [
        "\\vec{S}=\\frac{1}{\\mu_{0}}\\vec{E}\\times\\vec{B}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
      ],
    },
    {
      name: "em radiation pressure",
      info: {},
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
      info: {},
      equations: [
        "\\gamma=\\frac{1}{\\sqrt{1-\\frac{v^{2}}{c^{2}}}}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1},
      ],
    },
    {
      name: "Time Dilation",
      info: {},
      equations: [
        "t=\\frac{t_{0}}{\\sqrt{1-\\frac{v^{2}}{c^{2}}}}",
        "t=\\gamma t_{0}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1},
        {},
      ],
    },
    {
      name: "Length Contraction",
      info: {},
      equations: [
        "l=l_{0}\\sqrt{1-\\frac{v^{2}}{c^{2}}}",
        "l=\\frac{l_{0}}{\\gamma}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1,"length": 1},
        {"length": 1},
      ],
    },
    {
      name: "Relative Velocity",
      info: {},
      equations: [
        "{u}'=\\frac{u+v}{1+u\\frac{v}{c^{2}}}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1},
      ],
    },
    {
      name: "Relativistic Energy",
      info: {},
      equations: [
        "E=\\frac{mc^{2}}{\\sqrt{1-\\frac{v^{2}}{c^{2}}}}",
        "E=\\gamma mc^{2}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1},
        {"velocity": 1},
      ],
    },
    {
      name: "Relativistic Momentum",
      info: {},
      equations: [
        "\\vec{p}=\\frac{m\\vec{v}}{\\sqrt{1-\\frac{v^{2}}{c^{2}}}}",
        "\\vec{p}=\\gamma m\\vec{v}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1},
        {"velocity": 1},
      ],
    },
    {
      name: "Energy-momentum",
      info: {},
      equations: [
        "E^{2}=p^{2}c^{2}+m^{2}c^{4}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1},
      ],
    },
    {
      name: "Mass-energy",
      info: {},
      equations: [
        "E=mc^{2}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1},
      ],
    },
    {
      name: "Relativistic K.E.",
      info: {},
      equations: [
        "K=(\\frac{1}{\\sqrt{1-\\frac{v^{2}}{c^{2}}}}-1)mc^{2}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1},
      ],
    },
    {
      name: "Relativistic Doppler Effect",
      info: {},
      equations: [
        "\\frac{\\lambda}{\\lambda_{0}}=\\frac{f_{0}}{f}=\\sqrt{(\\frac{1+\\frac{v}{c}}{1-\\frac{v}{c}})}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"velocity": 1,"length": 1},
      ],
    },
    {
      name: "Photon Energy",
      info: {},
      equations: [
        "E=hf",
        "E=pc"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
        {"velocity": 1},
      ],
    },
    {
      name: "Photon Momentum",
      info: {},
      equations: [
        "p=\\frac{h}{\\lambda}",
        "p=\\frac{E}{c}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1},
        {"velocity": 1},
      ],
    },
    {
      name: "Photoelectric Effect",
      info: {},
      equations: [
        "K_{max}=E-\\phi",
        "K_{max}=h(f-f_{0})"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
        {},
      ],
    },
    {
      name: "Schredinger's Equation",
      info: {},
      equations: [
        "i\\hslash\\frac{\\partial}{\\partial t}\\Psi(\\vec{r},t)=-\\frac{\\hslash^{2}}{2m}\\nabla^{2}\\Psi(\\vec{r},t)+U(\\vec{r})\\Psi(\\vec{r},t)",
        "E\\psi(\\vec{r})=-\\frac{\\hslash^{2}}{2m}\\nabla^{2}\\psi(\\vec{r})+U(\\vec{r})\\psi(\\vec{r})"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
        {},
      ],
    },
    {
      name: "Uncertainty Principle",
      info: {},
      equations: [
        "\\Delta p_{x}\\Delta x \\geq\\frac{\\hslash}{2}",
        "\\Delta E \\Delta t \\geq\\frac{\\hslash}{2}"
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
        {},
      ],
    },
    {
      name: "Rydberg equation",
      info: {},
      equations: [
        "\\frac{1}{\\lambda}=-R_{\\infty}(\\frac{1}{n^{2}}-\\frac{1}{n_{0}^{2}})",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"length": 1},
      ],
    },
    {
      name: "Half Life",
      info: {},
      equations: [
        "N=N_{0}2^{\\frac{-t}{T_{\\frac{1}{2}}}}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {"time": 1},
      ],
    },
    {
      name: "Absorbed Dose",
      info: {},
      equations: [
        "D=\\frac{E}{m}",
      ],
      quantities: [//describes the quantities that are being related in the respective equations
        {},
      ],
    },
    {
      name: "Effective Dose",
      info: {},
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
    value: "299 792 458",
    unit: "\\frac{m}{s}",
    unitString: "m/s",
    unitsLatex: "ms^{-1}",
    unitsMathjs: "1 m/s",
  },
  {
    quantity: "Planck constant",
    quantityDescription: "Planck constant",
    symbol: "h",
    value: "6.626 070 040(81)\\times 10^{-34}",
    unit: "J\\cdot s",
    unitString: "J*s",
    unitsLatex: "Js",
    unitsMathjs: "1 J s",
  },
  {
    quantity: "Newtonian constant of gravitation",
    quantityDescription: "Newtonian constant of gravitation",
    symbol: "G",
    value: "6.674 08(31)\\times 10^{-11}",
    unit: "\\frac{m^{3}}{kg\\cdot s^{2}}",
    unitString: "(m^3)/(kg*s^2)",
    unitsLatex: "Nm^{2}g^{-2}",
    unitsMathjs: "1 m^3 / (kg s^2)",
  },
  {
    quantity: "force",
    quantityDescription: "Acceleration due to gravity",
    symbol: "\\vec{g}",
    value: "9.8",
    unit: "\\frac{m}{s^2}",
    unitString: "m/s^2",
    unitsLatex: "ms^{-2}",
    unitsMathjs: "1 m / s^2",
  },
  {
    quantity: "Boltzmann constant",
    quantityDescription: "Boltzmann constant",
    symbol: "k",
    value: "1.380658\\times 10^{-23}",
    unit: "\\frac{J}{K}",
    unitString: "J/K",
    unitsLatex: "JK^{-1}",
    unitsMathjs: "1 J/K",
  },
  {
    quantity: "Molar gas constant",
    quantityDescription: "Molar gas constant",
    symbol: "R",
    value: "8.314510",
    unit: "\\frac{J}{mol}\\cdot K",
    unitString: "(J*K)/(mol)",
    unitsLatex: "JKo^{-1}",
    unitsMathjs: "1 J K / mol",
  },
  {
    quantity: "Avogadro's number",
    quantityDescription: "Avogadro's number",
    symbol: "N_{A}",
    value: "6.0221367\\times 10^{23}",
    unit: "mol^{-1}",
    unitString: "1/mol",
    unitsLatex: "o^{-1}",
    unitsMathjs: "1 / mol",
  },
  {
    quantity: "electric charge",
    quantityDescription: "Charge of electron",
    symbol: "e",
    value: "1.602 176 6208(98)\\times 10^{-19}",
    unit: "C",
    unitString: "C",
    unitsLatex: "As",
    unitsMathjs: "1 C",
  },
  {
    quantity: "Permeability of vacuum",
    quantityDescription: "Permeability of vacuum",
    symbol: "\\mu_{0}",
    value: "4\\pi\\times 10^{-7}",
    unit: "\\frac{N}{A^{2}}",
    unitString: "N/(A^2)",
    unitsLatex: "NA^{-2}",
    unitsMathjs: "1 N / A^2",
  },
  {
    quantity: "Permittivity of vacuum",
    quantityDescription: "Permittivity of vacuum",
    symbol: "\\epsilon_{0}",
    value: "8.854 187 817...\\times 10^{-12}",
    unit: "\\frac{F}{m}",
    unitString: "F/m",
    unitsLatex: "Fm^{-1}",
    unitsMathjs: "1 F / m",
  },
  {
    quantity: "Coulomb constant",
    quantityDescription: "Coulomb constant",
    symbol: "K",
    value: "8.987552\\times 10^{9}",
    unit: "N\\cdot\\frac{m^{2}}{C^{2}}",
    unitString: "N*(m^2)/(C^2)",
    unitsLatex: "Nm^{2}A^{-2}s^{-2}}",
    unitsMathjs: "1 N m^2 / C^2",
  },
  {
    quantity: "Faraday constant",
    quantityDescription: "Faraday constant",
    symbol: "F",
    value: "96485.309",
    unit: "\\frac{C}{mol}",
    unitString: "C/mol",
    unitsLatex: "Aso^{-1}",
    unitsMathjs: "1 C / mol",
  },
  {
    quantity: "mass",
    quantityDescription: "electron mass",
    symbol: "m_{e}",
    value: "9.109 383 56(11)\\times 10^{-31}",
    unit: "kg",
    unitString: "kg",
    unitsLatex: "g",
    unitsMathjs: "1 kg",
  },
  {
    quantity: "mass",
    quantityDescription: "proton mass",
    symbol: "m_{p}",
    value: "1.672 621 898(21)\\times 10^{-27}",
    unit: "kg",
    unitString: "kg",
    unitsLatex: "g",
    unitsMathjs: "1 kg",
  },
  {
    quantity: "mass",
    quantityDescription: "neutron mass",
    symbol: "m_{n}",
    value: "1.6726231\\times 10^{-27}",
    unit: "kg",
    unitString: "kg",
    unitsLatex: "g",
    unitsMathjs: "1 kg",
  },
  {
    quantity: "mass",
    quantityDescription: "Atomic mass unit",
    symbol: "u",
    value: "1.6605402\\times 10^{-27}",
    unit: "kg",
    unitString: "kg",
    unitsLatex: "g",
    unitsMathjs: "1 kg",
  },
  {
    quantity: "Stefan-Boltzmann constant",
    quantityDescription: "Stefan-Boltzmann constant",
    symbol: "\\sigma",
    value: "5.67051\\times 10^{-8}",
    unit: "\\frac{W}{m^{2}}\\cdot K^{4}",
    unitString: "W/(m^2)*K^4",
    unitsLatex: "WK^{4}m^{-2}",
    unitsMathjs: "1 W K^4 / m^2",
  },
  {
    quantity: "Rydberg constant",
    quantityDescription: "Rydberg constant",
    symbol: "R_{\\infty}",
    value: "10973731.534",
    unit: "m^{-1}",
    unitString: "1/m",
    unitsLatex: "m^{-1}",
    unitsMathjs: "1 / m",
  },
  {
    quantity: "Bohr magneton",
    quantityDescription: "Bohr magneton",
    symbol: "\\mu_{B}",
    value: "9.2740154\\times 10^{-24}",
    unit: "\\frac{J}{T}",
    unitString: "J/T",
    unitsLatex: "JT^{-1}",
    unitsMathjs: "1 J / T",
  },
  {
    quantity: "magnetic flux",
    quantityDescription: "magnetic flux quantum h/2e",
    symbol: "\\Phi_{0}",
    value: "2.067 833 831(13)\\times 10^{-15}",
    unit: "Wb",
    unitString: "Wb",
    unitsLatex: "w",
    unitsMathjs: "1 Wb",
  },
  {
    quantity: "Wien displacement constant",
    quantityDescription: "Wien displacement constant",
    symbol: "b",
    value: "2.897756\\times 10^{-3}",
    unit: "m\\cdot K",
    unitString: "m*K",
    unitsLatex: "mK",
    unitsMathjs: "1 m K",
  },
];



let ImportVariableDefinitions = {
  //the key is the variable, unit is the latex string the describes the units for that variable, and key is the quantity name and key for ListOfSIUnits for the specific variable
  mechanics: {
    "t": {unit: "s", quantity: "time", key: "time", vector: false,},
    "T": {unit: "s", quantity: "period", key: "time", vector: false,},
    "f": {unit: "Hz", quantity: "frequency", key: "frequency", vector: false,},
    "m": {unit: "kg", quantity: "mass", key: "mass", vector: false,},
    "l": {unit: "m", quantity: "length", key: "length", vector: false,},
    "\\vec{x}": {unit: "m", quantity: "length", key: "length", vector: true,},
    "\\vec{y}": {unit: "m", quantity: "length", key: "length", vector: true,},
    "\\vec{z}": {unit: "m", quantity: "length", key: "length", vector: true,},
    "\\vec{r}": {unit: "m", quantity: "radius", key: "length", vector: true,},
    "h": {unit: "m", quantity: "height", key: "length", vector: false,},
    "A": {unit: "m^2", quantity: "area", key: "area", vector: false,},
    "V": {unit: "m^3", quantity: "volume", key: "volume", vector: false,},
    "\\vec{v}": {unit: "\\frac{m}{s}", quantity: "velocity", key: "velocity", vector: true,},
    "\\vec{a}": {unit: "\\frac{m}{s^2}", quantity: "velocity", key: "acceleration", vector: true,},
    "\\vec{F}": {unit: "N", quantity: "force", key: "force", vector: true,},
    "\\vec{N}": {unit: "N", quantity: "normal force", key: "force", vector: true,},
    "\\mu": {unit: "unitless", quantity: "coefficient of friction", key: "coefficient of friction", vector: false,},
    "\\vec{\\theta}": {unit: "rad", quantity: "plane angle", key: "plane angle", vector: true,},
    "\\vec{\\omega}": {unit: "\\frac{rad}{s}", quantity: "angular velocity", key: "angular velocity", vector: true,},
    "\\vec{\\alpha}": {unit: "\\frac{rad}{s^2}", quantity: "angular acceleration", key: "angular acceleration", vector: true,},
    "\\vec{p}": {unit: "\\frac{kg\\cdot m}{s}", quantity: "momentum", key: "momentum", vector: true,},
    "\\vec{J}": {unit: "\\frac{kg\\cdot m}{s}", quantity: "impulse", key: "impulse", vector: true,},
    "W": {unit: "J", quantity: "work", key: "energy/work", vector: false,},
    "E": {unit: "J", quantity: "energy", key: "energy/work", vector: false,},
    "K": {unit: "J", quantity: "kinetic energy", key: "energy/work", vector: false,},
    "U": {unit: "J", quantity: "potential energy", key: "energy/work", vector: false,},
    "P": {unit: "W", quantity: "power", key: "power", vector: false,},
    "\\eta": {unit: "unitless", quantity: "energy efficiency", key: "energy efficiency", vector: false,},
    "\\vec{\\tau}": {unit: "N\\cdot m", quantity: "torque", key: "torque/moment of force", vector: true,},
    "I": {unit: "kg \\cdot m^2", quantity: "moment of inertia", key: "moment of inertia", vector: false,},
    "\\vec{L}": {unit: "\\frac{kg\\cdot m^2}{s}", quantity: "angular momentum", key: "angular momentum", vector: true,},
    "\\vec{H}": {unit: "\\frac{kg\\cdot m^2}{s}", quantity: "angular impulse", key: "angular impulse", vector: true,},
    "k": {unit: "\\frac{N}{m}", quantity: "spring constant", key: "spring constant", vector: false,},
    "\\rho": {unit: "\\frac{kg}{m^3}", quantity: "mass density", key: "mass density", vector: false,},
  },
  thermal: {},
  waveOptics: {},
  em: {},
  modern: {},

};
