import{j as s}from"./jsx-runtime-u17CrQMm.js";import{r as o}from"./iframe-DjrwvunH.js";import{P as n}from"./TrackControls-uyDKqTqQ.js";import{u as a}from"./useLooperStore-BigNJQ2X.js";import"./preload-helper-PPVm8Dsz.js";import"./PowerIcon-MhrZRzOh.js";import"./useSessionStore-BzABupKw.js";import"./index-pn5caO_2.js";import"./useDialogStore-ptSJ_x83.js";import"./index-P_MXkEvz.js";import"./TrackFX-CytoTSNG.js";import"./index-ChFqJpox.js";import"./index-Bh3qYX8j.js";import"./UploadSimple.es-CzdkQJ_Q.js";import"./IconBase.es-BO8lnNST.js";import"./FloppyDisk.es-Cl30bR8a.js";import"./Sliders.es-BPJtRemJ.js";import"./Trash.es-DvLdeK75.js";import"./X.es-DlqrGIDH.js";import"./LatencyMonitor-CHlLvez4.js";import"./ArrowsClockwise.es-qeqxWUYq.js";import"./Lightning.es-BXOs-Z-Y.js";import"./InputChannelSelector-Bu5iDPx1.js";import"./SettingsPopover-Ucp6_5SY.js";const H={title:"Web/ProgressRing",component:n,tags:["ai-generated"]},r={args:{progress:.25,bar:2,beat:1},render:t=>(o.useEffect(()=>{a.setState({currentSectionIndex:0,sections:[{id:"s1",name:"Intro",lengthInBars:4,order:0,trackStates:[]}]})},[]),s.jsx(n,{...t}))},e={args:{progress:.5,bar:3,beat:1},render:t=>(o.useEffect(()=>{a.setState({currentSectionIndex:0,sections:[{id:"s1",name:"Verse",lengthInBars:4,order:0,trackStates:[]}]})},[]),s.jsx(n,{...t}))};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
