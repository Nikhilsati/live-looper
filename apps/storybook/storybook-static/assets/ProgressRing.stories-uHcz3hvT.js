import{j as s}from"./jsx-runtime-u17CrQMm.js";import{r as o}from"./iframe-BXJpxzHH.js";import{P as n}from"./TrackControls-DpoNw5L1.js";import{u as a}from"./useLooperStore-BfSgrONV.js";import"./preload-helper-PPVm8Dsz.js";import"./PowerIcon-MhrZRzOh.js";import"./useSessionStore-DGrFwR9j.js";import"./index-BhM3fhe2.js";import"./useDialogStore-7q7Veijn.js";import"./index-D3pbEsCm.js";import"./TrackFX-D44tMDTn.js";import"./index-BlgGgipN.js";import"./index-CRrYHsHn.js";import"./UploadSimple.es-BcU1hz6L.js";import"./IconBase.es-c7dv95h9.js";import"./FloppyDisk.es-DfosdXF7.js";import"./Sliders.es-DEHWsp6N.js";import"./Trash.es-BgCRKvX9.js";import"./X.es-OFt9uGlE.js";import"./LatencyMonitor-BjHyaxLm.js";import"./ArrowsClockwise.es-CYsyLPi2.js";import"./Lightning.es-DvM1n1hL.js";import"./InputChannelSelector-CLxjJIGQ.js";import"./SettingsPopover-CkLm44tE.js";const H={title:"Web/ProgressRing",component:n,tags:["ai-generated"]},r={args:{progress:.25,bar:2,beat:1},render:t=>(o.useEffect(()=>{a.setState({currentSectionIndex:0,sections:[{id:"s1",name:"Intro",lengthInBars:4,order:0,trackStates:[]}]})},[]),s.jsx(n,{...t}))},e={args:{progress:.5,bar:3,beat:1},render:t=>(o.useEffect(()=>{a.setState({currentSectionIndex:0,sections:[{id:"s1",name:"Verse",lengthInBars:4,order:0,trackStates:[]}]})},[]),s.jsx(n,{...t}))};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    progress: 0.25,
    bar: 2,
    beat: 1
  },
  render: args => {
    useEffect(() => {
      useLooperStore.setState({
        currentSectionIndex: 0,
        sections: [{
          id: "s1",
          name: "Intro",
          lengthInBars: 4,
          order: 0,
          trackStates: []
        }]
      });
    }, []);
    return <ProgressRing {...args} />;
  }
}`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    progress: 0.5,
    bar: 3,
    beat: 1
  },
  render: args => {
    useEffect(() => {
      useLooperStore.setState({
        currentSectionIndex: 0,
        sections: [{
          id: "s1",
          name: "Verse",
          lengthInBars: 4,
          order: 0,
          trackStates: []
        }]
      });
    }, []);
    return <ProgressRing {...args} />;
  }
}`,...e.parameters?.docs?.source}}};const T=["Default","HalfwayThrough"];export{r as Default,e as HalfwayThrough,T as __namedExportsOrder,H as default};
