import{j as s}from"./jsx-runtime-u17CrQMm.js";import{r as o}from"./iframe-CoXEDRzF.js";import{P as n}from"./TrackControls-D82avz0U.js";import{u as a}from"./useLooperStore-Bybne01-.js";import"./preload-helper-PPVm8Dsz.js";import"./PowerIcon-MhrZRzOh.js";import"./index-7QDTVwY0.js";import"./TrackFX-e6p_QtSa.js";import"./index-CgSukmKq.js";import"./index-CyrqA3Ya.js";import"./UploadSimple.es-y1Pk1ARz.js";import"./IconBase.es-DSIt0WZZ.js";import"./FloppyDisk.es-DXhyPX4k.js";import"./Sliders.es-xBAbiGhp.js";import"./Trash.es-C-uUh0KV.js";import"./X.es-7u80lDDN.js";import"./LatencyMonitor-Kt043hsF.js";import"./ArrowsClockwise.es-BmMsv_xV.js";import"./Lightning.es-Dx41jP9m.js";import"./InputChannelSelector-CLkRBLhl.js";import"./SettingsPopover-B53-rj5t.js";import"./useDialogStore-ElppLasU.js";const y={title:"Web/ProgressRing",component:n,tags:["ai-generated"]},r={args:{progress:.25,bar:2,beat:1},render:t=>(o.useEffect(()=>{a.setState({currentSectionIndex:0,sections:[{id:"s1",name:"Intro",lengthInBars:4,order:0,trackStates:[]}]})},[]),s.jsx(n,{...t}))},e={args:{progress:.5,bar:3,beat:1},render:t=>(o.useEffect(()=>{a.setState({currentSectionIndex:0,sections:[{id:"s1",name:"Verse",lengthInBars:4,order:0,trackStates:[]}]})},[]),s.jsx(n,{...t}))};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
