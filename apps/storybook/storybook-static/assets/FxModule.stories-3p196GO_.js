import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as n}from"./iframe-CoXEDRzF.js";import{F as u}from"./TrackFX-e6p_QtSa.js";import{K as i}from"./index-7QDTVwY0.js";import{D as g,a as f,R as p}from"./PowerIcon-MhrZRzOh.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CgSukmKq.js";import"./index-CyrqA3Ya.js";import"./useLooperStore-Bybne01-.js";import"./useDialogStore-ElppLasU.js";import"./UploadSimple.es-y1Pk1ARz.js";import"./IconBase.es-DSIt0WZZ.js";import"./FloppyDisk.es-DXhyPX4k.js";import"./Sliders.es-xBAbiGhp.js";import"./Trash.es-C-uUh0KV.js";import"./X.es-7u80lDDN.js";const I={title:"Web/FxModule",component:u,tags:["ai-generated"]},m={args:{name:"Delay",color:"#38bdf8",icon:e.jsx(g,{size:12}),cols:"1fr",moduleWidth:96},render:o=>{const[a,t]=n.useState(!0),[s,r]=n.useState(.5),[l,b]=n.useState(.4);return e.jsxs(u,{...o,enabled:a,onToggle:t,children:[e.jsx(i,{color:"#38bdf8",size:52,label:"Time",unit:"s",value:s,min:.01,max:2,onChange:r}),e.jsx(i,{color:"#38bdf8",size:52,label:"Fdbk",unit:"%",value:l*100,min:0,max:100,onChange:x=>b(x/100)})]})}},c={args:{name:"Reverb",color:"#f472b6",icon:e.jsx(p,{size:12}),cols:"1fr",moduleWidth:96},render:o=>{const[a,t]=n.useState(!1),[s,r]=n.useState(.3);return e.jsx(u,{...o,enabled:a,onToggle:t,children:e.jsx(i,{color:"#f472b6",size:52,label:"Mix",unit:"%",value:s*100,min:0,max:100,onChange:l=>r(l/100)})})}},d={args:{name:"Drive",color:"#f97316",icon:e.jsx(f,{size:12}),cols:"1fr",moduleWidth:96},render:o=>{const[a,t]=n.useState(!0),[s,r]=n.useState(.5),[l,b]=n.useState(.6);return e.jsxs(u,{...o,enabled:a,onToggle:t,children:[e.jsx(i,{color:"#f97316",size:52,label:"Amt",value:s,min:0,max:1,onChange:r}),e.jsx(i,{color:"#f97316",size:52,label:"Tone",value:l,min:0,max:1,onChange:b})]})}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    name: "Delay",
    color: "#38bdf8",
    icon: <DelayIcon size={12} />,
    cols: "1fr",
    moduleWidth: 96
  },
  render: args => {
    const [enabled, setEnabled] = useState(true);
    const [time, setTime] = useState(0.5);
    const [feedback, setFeedback] = useState(0.4);
    return <FxModule {...args} enabled={enabled} onToggle={setEnabled}>
        <Knob color="#38bdf8" size={52} label="Time" unit="s" value={time} min={0.01} max={2} onChange={setTime} />
        <Knob color="#38bdf8" size={52} label="Fdbk" unit="%" value={feedback * 100} min={0} max={100} onChange={v => setFeedback(v / 100)} />
      </FxModule>;
  }
}`,...m.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    name: "Reverb",
    color: "#f472b6",
    icon: <ReverbIcon size={12} />,
    cols: "1fr",
    moduleWidth: 96
  },
  render: args => {
    const [enabled, setEnabled] = useState(false);
    const [mix, setMix] = useState(0.3);
    return <FxModule {...args} enabled={enabled} onToggle={setEnabled}>
        <Knob color="#f472b6" size={52} label="Mix" unit="%" value={mix * 100} min={0} max={100} onChange={v => setMix(v / 100)} />
      </FxModule>;
  }
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    name: "Drive",
    color: "#f97316",
    icon: <DriveIcon size={12} />,
    cols: "1fr",
    moduleWidth: 96
  },
  render: args => {
    const [enabled, setEnabled] = useState(true);
    const [amt, setAmt] = useState(0.5);
    const [tone, setTone] = useState(0.6);
    return <FxModule {...args} enabled={enabled} onToggle={setEnabled}>
        <Knob color="#f97316" size={52} label="Amt" value={amt} min={0} max={1} onChange={setAmt} />
        <Knob color="#f97316" size={52} label="Tone" value={tone} min={0} max={1} onChange={setTone} />
      </FxModule>;
  }
}`,...d.parameters?.docs?.source}}};const A=["Delay","Reverb","Overdrive"];export{m as Delay,d as Overdrive,c as Reverb,A as __namedExportsOrder,I as default};
