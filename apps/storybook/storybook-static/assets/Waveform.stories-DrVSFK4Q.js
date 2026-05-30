import{W as m,j as p}from"./index-D0kj-WeA.js";import{r as i}from"./iframe-2M05zz56.js";import"./preload-helper-PPVm8Dsz.js";const v={title:"UI/Waveform",component:m,tags:["ai-generated"],argTypes:{height:{control:"number"},bars:{control:"number"},beatsPerBar:{control:"number"},variant:{control:"select",options:["default","minimal"]}}},l=r=>{const e=[];for(let a=0;a<r;a++){const o=.1+.5*Math.sin(a/r*Math.PI*4)*Math.sin(a/r*Math.PI*8)+.4*Math.random();e.push(Math.max(.05,o))}return e},g=l(40),t={args:{data:g,progress:.35,height:60,bars:4,beatsPerBar:4,variant:"default"}},s={args:{data:g,progress:.6,height:30,bars:0,variant:"minimal"}},n={args:{data:l(60),height:80,bars:8,beatsPerBar:4,variant:"default"},render:r=>{const[e,a]=i.useState(0);return i.useEffect(()=>{const o=setInterval(()=>{a(c=>c>=1?0:c+.005)},50);return()=>clearInterval(o)},[]),p.jsx(m,{...r,progress:e})}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    data: mockData,
    progress: 0.35,
    height: 60,
    bars: 4,
    beatsPerBar: 4,
    variant: "default"
  }
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    data: mockData,
    progress: 0.6,
    height: 30,
    bars: 0,
    variant: "minimal"
  }
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    data: generateMockData(60),
    height: 80,
    bars: 8,
    beatsPerBar: 4,
    variant: "default"
  },
  render: args => {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
      const interval = setInterval(() => {
        setProgress(prev => prev >= 1 ? 0 : prev + 0.005);
      }, 50);
      return () => clearInterval(interval);
    }, []);
    return <Waveform {...args} progress={progress} />;
  }
}`,...n.parameters?.docs?.source}}};const f=["Default","Minimal","PlaybackSimulation"];export{t as Default,s as Minimal,n as PlaybackSimulation,f as __namedExportsOrder,v as default};
