import{j as n}from"./jsx-runtime-u17CrQMm.js";import{r as o}from"./iframe-CoXEDRzF.js";import{C as a}from"./TrackControls-D82avz0U.js";import{u as r}from"./useLooperStore-Bybne01-.js";import"./preload-helper-PPVm8Dsz.js";import"./PowerIcon-MhrZRzOh.js";import"./index-7QDTVwY0.js";import"./TrackFX-e6p_QtSa.js";import"./index-CgSukmKq.js";import"./index-CyrqA3Ya.js";import"./UploadSimple.es-y1Pk1ARz.js";import"./IconBase.es-DSIt0WZZ.js";import"./FloppyDisk.es-DXhyPX4k.js";import"./Sliders.es-xBAbiGhp.js";import"./Trash.es-C-uUh0KV.js";import"./X.es-7u80lDDN.js";import"./LatencyMonitor-Kt043hsF.js";import"./ArrowsClockwise.es-BmMsv_xV.js";import"./Lightning.es-Dx41jP9m.js";import"./InputChannelSelector-CLkRBLhl.js";import"./SettingsPopover-B53-rj5t.js";import"./useDialogStore-ElppLasU.js";const b={title:"Web/ChannelLevels",component:a,tags:["ai-generated"]},e={render:()=>(o.useEffect(()=>{r.setState({inputLevels:[.15,.45,.05,.75]})},[]),n.jsx(a,{}))},t={render:()=>(o.useEffect(()=>{r.setState({inputLevels:[0,0,0,0]});const s=setInterval(()=>{r.setState({inputLevels:[Math.max(0,.1+.8*Math.random()),Math.max(0,.2+.7*Math.random()),Math.max(0,.05+.9*Math.random()),Math.max(0,.02+.3*Math.random())]})},80);return()=>clearInterval(s)},[]),n.jsx(a,{}))};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
