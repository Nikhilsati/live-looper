import{j as s}from"./jsx-runtime-u17CrQMm.js";import{r as o}from"./iframe-Bz5zlmtB.js";import{P as n}from"./TrackControls-6rc5kCT_.js";import{u as a}from"./useLooperStore-tB-Eqf-j.js";import"./preload-helper-PPVm8Dsz.js";import"./PowerIcon-MhrZRzOh.js";import"./index-gqHS7t1m.js";import"./TrackFX-DWhP02q8.js";import"./index-BXqYSj3i.js";import"./index-BkB19OZz.js";import"./UploadSimple.es-QT3uJlvy.js";import"./IconBase.es-BaY8-AWE.js";import"./FloppyDisk.es-CIWUAUiu.js";import"./Sliders.es-BfvF4Fu1.js";import"./Trash.es-GkaNqD0k.js";import"./X.es-DMEZIJzP.js";import"./LatencyMonitor-DzOqAXWL.js";import"./ArrowsClockwise.es-C_n7ETa_.js";import"./Lightning.es-B1hOFdRv.js";import"./InputChannelSelector-bIWJ7e8G.js";import"./SettingsPopover-DPYdkQx4.js";import"./useDialogStore-DfmhEa3P.js";const y={title:"Web/ProgressRing",component:n,tags:["ai-generated"]},r={args:{progress:.25,bar:2,beat:1},render:t=>(o.useEffect(()=>{a.setState({currentSectionIndex:0,sections:[{id:"s1",name:"Intro",lengthInBars:4,order:0,trackStates:[]}]})},[]),s.jsx(n,{...t}))},e={args:{progress:.5,bar:3,beat:1},render:t=>(o.useEffect(()=>{a.setState({currentSectionIndex:0,sections:[{id:"s1",name:"Verse",lengthInBars:4,order:0,trackStates:[]}]})},[]),s.jsx(n,{...t}))};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
}`,...e.parameters?.docs?.source}}};const D=["Default","HalfwayThrough"];export{r as Default,e as HalfwayThrough,D as __namedExportsOrder,y as default};
