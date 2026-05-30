import{j as s}from"./jsx-runtime-u17CrQMm.js";import{r as o}from"./iframe-3i2WR5Xa.js";import{P as n}from"./TrackControls-CHLowz8S.js";import{u as a}from"./useLooperStore-D8NVNae3.js";import"./preload-helper-PPVm8Dsz.js";import"./PowerIcon-MhrZRzOh.js";import"./index-CAi--mKy.js";import"./TrackFX-xYd0F-eP.js";import"./index-B5R4sxe6.js";import"./index-BOgzelvg.js";import"./UploadSimple.es-BVBZzRYz.js";import"./IconBase.es-BPfYamxb.js";import"./FloppyDisk.es-C-BEqMvD.js";import"./Sliders.es-DiNjM7eB.js";import"./Trash.es-NkZ_2-SY.js";import"./X.es-DKF1rw0x.js";import"./LatencyMonitor-jcsEBinV.js";import"./ArrowsClockwise.es-DBPdaSFq.js";import"./Lightning.es-DU56mEC3.js";import"./InputChannelSelector-CPB52Oky.js";import"./SettingsPopover-B4dohh2J.js";import"./useDialogStore-ChE-5abl.js";const y={title:"Web/ProgressRing",component:n,tags:["ai-generated"]},r={args:{progress:.25,bar:2,beat:1},render:t=>(o.useEffect(()=>{a.setState({currentSectionIndex:0,sections:[{id:"s1",name:"Intro",lengthInBars:4,order:0,trackStates:[]}]})},[]),s.jsx(n,{...t}))},e={args:{progress:.5,bar:3,beat:1},render:t=>(o.useEffect(()=>{a.setState({currentSectionIndex:0,sections:[{id:"s1",name:"Verse",lengthInBars:4,order:0,trackStates:[]}]})},[]),s.jsx(n,{...t}))};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
