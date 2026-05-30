import{j as n}from"./jsx-runtime-u17CrQMm.js";import{r as o}from"./iframe-Bz5zlmtB.js";import{C as a}from"./TrackControls-6rc5kCT_.js";import{u as r}from"./useLooperStore-tB-Eqf-j.js";import"./preload-helper-PPVm8Dsz.js";import"./PowerIcon-MhrZRzOh.js";import"./index-gqHS7t1m.js";import"./TrackFX-DWhP02q8.js";import"./index-BXqYSj3i.js";import"./index-BkB19OZz.js";import"./UploadSimple.es-QT3uJlvy.js";import"./IconBase.es-BaY8-AWE.js";import"./FloppyDisk.es-CIWUAUiu.js";import"./Sliders.es-BfvF4Fu1.js";import"./Trash.es-GkaNqD0k.js";import"./X.es-DMEZIJzP.js";import"./LatencyMonitor-DzOqAXWL.js";import"./ArrowsClockwise.es-C_n7ETa_.js";import"./Lightning.es-B1hOFdRv.js";import"./InputChannelSelector-bIWJ7e8G.js";import"./SettingsPopover-DPYdkQx4.js";import"./useDialogStore-DfmhEa3P.js";const b={title:"Web/ChannelLevels",component:a,tags:["ai-generated"]},e={render:()=>(o.useEffect(()=>{r.setState({inputLevels:[.15,.45,.05,.75]})},[]),n.jsx(a,{}))},t={render:()=>(o.useEffect(()=>{r.setState({inputLevels:[0,0,0,0]});const s=setInterval(()=>{r.setState({inputLevels:[Math.max(0,.1+.8*Math.random()),Math.max(0,.2+.7*Math.random()),Math.max(0,.05+.9*Math.random()),Math.max(0,.02+.3*Math.random())]})},80);return()=>clearInterval(s)},[]),n.jsx(a,{}))};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
