import{j as n}from"./jsx-runtime-u17CrQMm.js";import{r as s}from"./iframe-CuidZOye.js";import{C as a}from"./ChannelLevels-B63WAP8R.js";import{u as r}from"./useLooperStore-Dc0igdZd.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CzRv-HbD.js";import"./trackColors-bnaEkYfa.js";import"./useDialogStore-BNH4vANE.js";const h={title:"Web/ChannelLevels",component:a,tags:["ai-generated"]},e={render:()=>(s.useEffect(()=>{r.setState({inputLevels:[.15,.45,.05,.75]})},[]),n.jsx(a,{}))},t={render:()=>(s.useEffect(()=>{r.setState({inputLevels:[0,0,0,0]});const o=setInterval(()=>{r.setState({inputLevels:[Math.max(0,.1+.8*Math.random()),Math.max(0,.2+.7*Math.random()),Math.max(0,.05+.9*Math.random()),Math.max(0,.02+.3*Math.random())]})},80);return()=>clearInterval(o)},[]),n.jsx(a,{}))};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        inputLevels: [0.15, 0.45, 0.05, 0.75]
      });
    }, []);
    return <ChannelLevels />;
  }
}`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        inputLevels: [0, 0, 0, 0]
      });
      const interval = setInterval(() => {
        useLooperStore.setState({
          inputLevels: [Math.max(0, 0.1 + 0.8 * Math.random()), Math.max(0, 0.2 + 0.7 * Math.random()), Math.max(0, 0.05 + 0.9 * Math.random()), Math.max(0, 0.02 + 0.3 * Math.random())]
        });
      }, 80);
      return () => clearInterval(interval);
    }, []);
    return <ChannelLevels />;
  }
}`,...t.parameters?.docs?.source}}};const L=["DefaultLevels","ActiveLevelsSimulation"];export{t as ActiveLevelsSimulation,e as DefaultLevels,L as __namedExportsOrder,h as default};
