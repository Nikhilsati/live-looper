import{j as n}from"./jsx-runtime-u17CrQMm.js";import{r as o}from"./iframe-DjrwvunH.js";import{C as a}from"./TrackControls-uyDKqTqQ.js";import{u as r}from"./useLooperStore-BigNJQ2X.js";import"./preload-helper-PPVm8Dsz.js";import"./PowerIcon-MhrZRzOh.js";import"./useSessionStore-BzABupKw.js";import"./index-pn5caO_2.js";import"./useDialogStore-ptSJ_x83.js";import"./index-P_MXkEvz.js";import"./TrackFX-CytoTSNG.js";import"./index-ChFqJpox.js";import"./index-Bh3qYX8j.js";import"./UploadSimple.es-CzdkQJ_Q.js";import"./IconBase.es-BO8lnNST.js";import"./FloppyDisk.es-Cl30bR8a.js";import"./Sliders.es-BPJtRemJ.js";import"./Trash.es-DvLdeK75.js";import"./X.es-DlqrGIDH.js";import"./LatencyMonitor-CHlLvez4.js";import"./ArrowsClockwise.es-qeqxWUYq.js";import"./Lightning.es-BXOs-Z-Y.js";import"./InputChannelSelector-Bu5iDPx1.js";import"./SettingsPopover-Ucp6_5SY.js";const R={title:"Web/ChannelLevels",component:a,tags:["ai-generated"]},e={render:()=>(o.useEffect(()=>{r.setState({inputLevels:[.15,.45,.05,.75]})},[]),n.jsx(a,{}))},t={render:()=>(o.useEffect(()=>{r.setState({inputLevels:[0,0,0,0]});const s=setInterval(()=>{r.setState({inputLevels:[Math.max(0,.1+.8*Math.random()),Math.max(0,.2+.7*Math.random()),Math.max(0,.05+.9*Math.random()),Math.max(0,.02+.3*Math.random())]})},80);return()=>clearInterval(s)},[]),n.jsx(a,{}))};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...t.parameters?.docs?.source}}};const W=["DefaultLevels","ActiveLevelsSimulation"];export{t as ActiveLevelsSimulation,e as DefaultLevels,W as __namedExportsOrder,R as default};
