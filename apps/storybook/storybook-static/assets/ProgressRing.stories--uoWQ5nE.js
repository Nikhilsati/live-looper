import{j as t}from"./jsx-runtime-u17CrQMm.js";import{r as a}from"./iframe-CuidZOye.js";import{P as s}from"./ProgressRing-CRNbpCni.js";import{u as o}from"./useLooperStore-Dc0igdZd.js";import"./preload-helper-PPVm8Dsz.js";import"./useDialogStore-BNH4vANE.js";const p={title:"Web/ProgressRing",component:s,tags:["ai-generated"]},r={args:{progress:.25,bar:2,beat:1},render:n=>(a.useEffect(()=>{o.setState({currentSectionIndex:0,sections:[{id:"s1",name:"Intro",lengthInBars:4,order:0,trackStates:[]}]})},[]),t.jsx(s,{...n}))},e={args:{progress:.5,bar:3,beat:1},render:n=>(a.useEffect(()=>{o.setState({currentSectionIndex:0,sections:[{id:"s1",name:"Verse",lengthInBars:4,order:0,trackStates:[]}]})},[]),t.jsx(s,{...n}))};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
}`,...e.parameters?.docs?.source}}};const f=["Default","HalfwayThrough"];export{r as Default,e as HalfwayThrough,f as __namedExportsOrder,p as default};
