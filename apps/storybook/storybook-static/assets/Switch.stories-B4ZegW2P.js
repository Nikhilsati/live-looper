import{S as n,j as o}from"./index-D0kj-WeA.js";import{r as d}from"./iframe-2M05zz56.js";import"./preload-helper-PPVm8Dsz.js";const g={title:"UI/Switch",component:n,tags:["ai-generated"]},s={args:{label:"Enable Metronome"},render:e=>{const[r,t]=d.useState(!1);return o.jsx(n,{...e,checked:r,onChange:t})}},a={args:{label:"Auto-Quantize Loops"},render:e=>{const[r,t]=d.useState(!0);return o.jsx(n,{...e,checked:r,onChange:t})}},c={args:{},render:e=>{const[r,t]=d.useState(!1);return o.jsx(n,{...e,checked:r,onChange:t})}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Enable Metronome"
  },
  render: args => {
    const [checked, setChecked] = useState(false);
    return <Switch {...args} checked={checked} onChange={setChecked} />;
  }
}`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Auto-Quantize Loops"
  },
  render: args => {
    const [checked, setChecked] = useState(true);
    return <Switch {...args} checked={checked} onChange={setChecked} />;
  }
}`,...a.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {},
  render: args => {
    const [checked, setChecked] = useState(false);
    return <Switch {...args} checked={checked} onChange={setChecked} />;
  }
}`,...c.parameters?.docs?.source}}};const k=["Default","CheckedByDefault","WithoutLabel"];export{a as CheckedByDefault,s as Default,c as WithoutLabel,k as __namedExportsOrder,g as default};
