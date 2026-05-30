import{j as p}from"./jsx-runtime-u17CrQMm.js";import{r as c}from"./iframe-CoXEDRzF.js";import{W as m}from"./index-7QDTVwY0.js";import"./preload-helper-PPVm8Dsz.js";const f={title:"UI/Waveform",component:m,tags:["ai-generated"],argTypes:{height:{control:"number"},bars:{control:"number"},beatsPerBar:{control:"number"},variant:{control:"select",options:["default","minimal"]}}},l=a=>{const e=[];for(let r=0;r<a;r++){const o=.1+.5*Math.sin(r/a*Math.PI*4)*Math.sin(r/a*Math.PI*8)+.4*Math.random();e.push(Math.max(.05,o))}return e},g=l(40),t={args:{data:g,progress:.35,height:60,bars:4,beatsPerBar:4,variant:"default"}},s={args:{data:g,progress:.6,height:30,bars:0,variant:"minimal"}},n={args:{data:l(60),height:80,bars:8,beatsPerBar:4,variant:"default"},render:a=>{const[e,r]=c.useState(0);return c.useEffect(()=>{const o=setInterval(()=>{r(i=>i>=1?0:i+.005)},50);return()=>clearInterval(o)},[]),p.jsx(m,{...a,progress:e})}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
}`,...n.parameters?.docs?.source}}};const b=["Default","Minimal","PlaybackSimulation"];export{t as Default,s as Minimal,n as PlaybackSimulation,b as __namedExportsOrder,f as default};
