import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as u}from"./iframe-3i2WR5Xa.js";import{L as r}from"./index-CAi--mKy.js";import"./preload-helper-PPVm8Dsz.js";const S={title:"UI/LevelMeter",component:r,tags:["ai-generated"],argTypes:{value:{control:{type:"range",min:0,max:1,step:.01}},vertical:{control:"boolean"},bars:{control:{type:"number",min:5,max:40}},variant:{control:"select",options:["segmented","continuous"]},color:{control:"color"}}},t={args:{value:.5,vertical:!1,bars:16,variant:"segmented"}},a={args:{value:.75,vertical:!0,bars:28,variant:"segmented"},render:n=>e.jsx("div",{style:{height:240,width:24},children:e.jsx(r,{...n})})},s={args:{value:.65,vertical:!1,variant:"continuous"}},i={args:{value:.88,vertical:!0,variant:"continuous"},render:n=>e.jsx("div",{style:{height:200,width:16},children:e.jsx(r,{...n})})},o={args:{values:[.6,.45],vertical:!0,bars:20,variant:"segmented"},render:n=>e.jsx("div",{style:{height:200,width:48},children:e.jsx(r,{...n})})},l={args:{values:[.2,.7,.98,.4],vertical:!0,variant:"continuous"},render:n=>e.jsx("div",{style:{height:160,width:80},children:e.jsx(r,{...n})})},c={args:{vertical:!0,bars:24,variant:"segmented"},render:n=>{const[d,v]=u.useState([.1,.2]);return u.useEffect(()=>{const m=setInterval(()=>{v([Math.max(0,.2+.7*Math.sin(Date.now()/300)+.1*Math.random()),Math.max(0,.15+.6*Math.cos(Date.now()/250)+.15*Math.random())])},50);return()=>clearInterval(m)},[]),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:20,width:300},children:[e.jsxs("div",{children:[e.jsx("h3",{children:"Segmented Stereo Simulation"}),e.jsx("div",{style:{height:200,width:50},children:e.jsx(r,{...n,values:d})})]}),e.jsxs("div",{children:[e.jsx("h3",{children:"Continuous Stereo Simulation"}),e.jsx("div",{style:{height:200,width:50},children:e.jsx(r,{...n,values:d,variant:"continuous"})})]})]})}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    value: 0.5,
    vertical: false,
    bars: 16,
    variant: "segmented"
  }
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    value: 0.75,
    vertical: true,
    bars: 28,
    variant: "segmented"
  },
  render: args => <div style={{
    height: 240,
    width: 24
  }}>
      <LevelMeter {...args} />
    </div>
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    value: 0.65,
    vertical: false,
    variant: "continuous"
  }
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    value: 0.88,
    vertical: true,
    variant: "continuous"
  },
  render: args => <div style={{
    height: 200,
    width: 16
  }}>
      <LevelMeter {...args} />
    </div>
}`,...i.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    values: [0.6, 0.45],
    vertical: true,
    bars: 20,
    variant: "segmented"
  },
  render: args => <div style={{
    height: 200,
    width: 48
  }}>
      <LevelMeter {...args} />
    </div>
}`,...o.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    values: [0.2, 0.7, 0.98, 0.4],
    vertical: true,
    variant: "continuous"
  },
  render: args => <div style={{
    height: 160,
    width: 80
  }}>
      <LevelMeter {...args} />
    </div>
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    vertical: true,
    bars: 24,
    variant: "segmented"
  },
  render: args => {
    const [levels, setLevels] = useState<number[]>([0.1, 0.2]);
    useEffect(() => {
      const interval = setInterval(() => {
        setLevels([Math.max(0, 0.2 + 0.7 * Math.sin(Date.now() / 300) + 0.1 * Math.random()), Math.max(0, 0.15 + 0.6 * Math.cos(Date.now() / 250) + 0.15 * Math.random())]);
      }, 50);
      return () => clearInterval(interval);
    }, []);
    return <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 20,
      width: 300
    }}>
        <div>
          <h3>Segmented Stereo Simulation</h3>
          <div style={{
          height: 200,
          width: 50
        }}>
            <LevelMeter {...args} values={levels} />
          </div>
        </div>
        <div>
          <h3>Continuous Stereo Simulation</h3>
          <div style={{
          height: 200,
          width: 50
        }}>
            <LevelMeter {...args} values={levels} variant="continuous" />
          </div>
        </div>
      </div>;
  }
}`,...c.parameters?.docs?.source}}};const M=["Default","SegmentedVertical","ContinuousHorizontal","ContinuousVertical","StereoSegmented","MultiChannelContinuous","ActiveSimulation"];export{c as ActiveSimulation,s as ContinuousHorizontal,i as ContinuousVertical,t as Default,l as MultiChannelContinuous,a as SegmentedVertical,o as StereoSegmented,M as __namedExportsOrder,S as default};
