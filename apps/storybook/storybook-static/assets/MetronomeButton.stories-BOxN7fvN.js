import{j as m}from"./jsx-runtime-u17CrQMm.js";import{r as s}from"./iframe-BXJpxzHH.js";import{M as n}from"./TrackControls-DpoNw5L1.js";import{u as o}from"./useLooperStore-BfSgrONV.js";import"./preload-helper-PPVm8Dsz.js";import"./PowerIcon-MhrZRzOh.js";import"./useSessionStore-DGrFwR9j.js";import"./index-BhM3fhe2.js";import"./useDialogStore-7q7Veijn.js";import"./index-D3pbEsCm.js";import"./TrackFX-D44tMDTn.js";import"./index-BlgGgipN.js";import"./index-CRrYHsHn.js";import"./UploadSimple.es-BcU1hz6L.js";import"./IconBase.es-c7dv95h9.js";import"./FloppyDisk.es-DfosdXF7.js";import"./Sliders.es-DEHWsp6N.js";import"./Trash.es-BgCRKvX9.js";import"./X.es-OFt9uGlE.js";import"./LatencyMonitor-BjHyaxLm.js";import"./ArrowsClockwise.es-CYsyLPi2.js";import"./Lightning.es-DvM1n1hL.js";import"./InputChannelSelector-CLxjJIGQ.js";import"./SettingsPopover-CkLm44tE.js";const q={title:"Web/MetronomeButton",component:n,tags:["ai-generated"]},e={render:()=>(s.useEffect(()=>{o.setState({metronomeOn:!1,setMetronomeOn:r=>{o.setState({metronomeOn:r})}})},[]),m.jsx(n,{}))},t={render:()=>(s.useEffect(()=>{o.setState({metronomeOn:!0,setMetronomeOn:r=>{o.setState({metronomeOn:r})}})},[]),m.jsx(n,{}))};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        metronomeOn: false,
        setMetronomeOn: v => {
          useLooperStore.setState({
            metronomeOn: v
          });
        }
      });
    }, []);
    return <MetronomeButton />;
  }
}`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        metronomeOn: true,
        setMetronomeOn: v => {
          useLooperStore.setState({
            metronomeOn: v
          });
        }
      });
    }, []);
    return <MetronomeButton />;
  }
}`,...t.parameters?.docs?.source}}};const w=["MetronomeOff","MetronomeOn"];export{e as MetronomeOff,t as MetronomeOn,w as __namedExportsOrder,q as default};
