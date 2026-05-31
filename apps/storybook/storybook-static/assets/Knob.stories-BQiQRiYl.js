import{j as l}from"./jsx-runtime-u17CrQMm.js";import{r as c}from"./iframe-DKAZBu9M.js";import{K as o}from"./index-i1lnfb4e.js";import"./preload-helper-PPVm8Dsz.js";const g={title:"UI/Knob",component:o,tags:["ai-generated"],argTypes:{color:{control:"color"},size:{control:{type:"range",min:30,max:120,step:5}},min:{control:"number"},max:{control:"number"},step:{control:"number"},unit:{control:"text"},label:{control:"text"}}},r={args:{min:0,max:100,label:"Volume",color:"#f97316",size:60,step:1,unit:"%"},render:e=>{const[n,a]=c.useState(50);return l.jsx(o,{...e,value:n,onChange:a})}},t={args:{min:-50,max:50,label:"Pan",color:"#10b981",size:50,step:1,unit:""},render:e=>{const[n,a]=c.useState(0);return l.jsx(o,{...e,value:n,onChange:a})}},s={args:{min:0,max:1,label:"Feedback",color:"#a78bfa",size:70,step:.01,unit:""},render:e=>{const[n,a]=c.useState(.5);return l.jsx(o,{...e,value:n,onChange:a})}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    min: 0,
    max: 100,
    label: "Volume",
    color: "#f97316",
    size: 60,
    step: 1,
    unit: "%"
  },
  render: args => {
    const [val, setVal] = useState(50);
    return <Knob {...args} value={val} onChange={setVal} />;
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    min: -50,
    max: 50,
    label: "Pan",
    color: "#10b981",
    size: 50,
    step: 1,
    unit: ""
  },
  render: args => {
    const [val, setVal] = useState(0);
    return <Knob {...args} value={val} onChange={setVal} />;
  }
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    min: 0,
    max: 1,
    label: "Feedback",
    color: "#a78bfa",
    size: 70,
    step: 0.01,
    unit: ""
  },
  render: args => {
    const [val, setVal] = useState(0.5);
    return <Knob {...args} value={val} onChange={setVal} />;
  }
}`,...s.parameters?.docs?.source}}};const b=["Default","PanKnob","HighResolution"];export{r as Default,s as HighResolution,t as PanKnob,b as __namedExportsOrder,g as default};
