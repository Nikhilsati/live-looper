import{j as n}from"./jsx-runtime-u17CrQMm.js";import{r as o}from"./iframe-CV-5FfhP.js";import{C as a}from"./TrackControls-BA4tbgkZ.js";import{u as r}from"./useLooperStore-Dw-zsQq8.js";import"./preload-helper-PPVm8Dsz.js";import"./PowerIcon-MhrZRzOh.js";import"./index-B8eWrQ5m.js";import"./TrackFX-BFa6CjWL.js";import"./index-D6ld3hFY.js";import"./index-BNvylKEa.js";import"./UploadSimple.es-BJz-JGZG.js";import"./IconBase.es-DSmtO-o_.js";import"./FloppyDisk.es-CKSQN_Gm.js";import"./Sliders.es-pqjgSKC9.js";import"./Trash.es-C-7gRwRW.js";import"./X.es-BM8FFSxz.js";import"./LatencyMonitor-CuLSs1u-.js";import"./ArrowsClockwise.es-vnVStLo6.js";import"./Lightning.es-BzvzFfQf.js";import"./InputChannelSelector-DR92D-f6.js";import"./SettingsPopover-B4CW-DR2.js";import"./useDialogStore-ddHqeGHH.js";const b={title:"Web/ChannelLevels",component:a,tags:["ai-generated"]},e={render:()=>(o.useEffect(()=>{r.setState({inputLevels:[.15,.45,.05,.75]})},[]),n.jsx(a,{}))},t={render:()=>(o.useEffect(()=>{r.setState({inputLevels:[0,0,0,0]});const s=setInterval(()=>{r.setState({inputLevels:[Math.max(0,.1+.8*Math.random()),Math.max(0,.2+.7*Math.random()),Math.max(0,.05+.9*Math.random()),Math.max(0,.02+.3*Math.random())]})},80);return()=>clearInterval(s)},[]),n.jsx(a,{}))};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...t.parameters?.docs?.source}}};const O=["DefaultLevels","ActiveLevelsSimulation"];export{t as ActiveLevelsSimulation,e as DefaultLevels,O as __namedExportsOrder,b as default};
