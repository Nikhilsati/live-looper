import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as u}from"./iframe-DKAZBu9M.js";import{T as m}from"./Tuner-IY2PF-a3.js";import{B as r}from"./index-i1lnfb4e.js";import"./preload-helper-PPVm8Dsz.js";const z={title:"Web/Tuner",component:m,tags:["ai-generated"]},c=t=>({context:{sampleRate:44100},getFloatTimeDomainData:n=>{for(let a=0;a<n.length;a++)n[a]=.8*Math.sin(2*Math.PI*t*(a/44100))+.05*(Math.random()-.5)}}),s={args:{analyser:c(440)}},o={args:{analyser:c(327)}},i={args:{analyser:c(264)}},l={render:()=>{const[t,n]=u.useState(440),p=c(t);return e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px",maxWidth:"400px"},children:[e.jsx(m,{analyser:p}),e.jsxs("div",{style:{display:"flex",gap:"8px",flexWrap:"wrap"},children:[e.jsx(r,{variant:"outline",size:"sm",onClick:()=>n(261.6),children:"C4 (261.6Hz)"}),e.jsx(r,{variant:"outline",size:"sm",onClick:()=>n(258),children:"Flat C4 (258Hz)"}),e.jsx(r,{variant:"outline",size:"sm",onClick:()=>n(265),children:"Sharp C4 (265Hz)"}),e.jsx(r,{variant:"outline",size:"sm",onClick:()=>n(440),children:"A4 (440Hz)"}),e.jsx(r,{variant:"outline",size:"sm",onClick:()=>n(329.6),children:"E4 (329.6Hz)"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[e.jsx("span",{style:{fontSize:"12px",color:"rgba(255,255,255,0.6)"},children:"Adjust Pitch:"}),e.jsx("input",{type:"range",min:"200",max:"600",step:"1",value:t,onChange:a=>n(Number(a.target.value)),style:{flex:1}}),e.jsxs("span",{style:{fontFamily:"monospace",fontSize:"13px"},children:[t," Hz"]})]})]})}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    analyser: createMockAnalyser(440) // Perfect A4 (440 Hz)
  }
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    analyser: createMockAnalyser(327) // Flat E (Ideal is 329.6 Hz)
  }
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    analyser: createMockAnalyser(264) // Sharp C (Ideal is 261.6 Hz)
  }
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [freq, setFreq] = useState<number>(440);
    const mockAnalyser = createMockAnalyser(freq);
    return <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      maxWidth: "400px"
    }}>
        <Tuner analyser={mockAnalyser} />
        
        <div style={{
        display: "flex",
        gap: "8px",
        flexWrap: "wrap"
      }}>
          <Button variant="outline" size="sm" onClick={() => setFreq(261.6)}>
            C4 (261.6Hz)
          </Button>
          <Button variant="outline" size="sm" onClick={() => setFreq(258.0)}>
            Flat C4 (258Hz)
          </Button>
          <Button variant="outline" size="sm" onClick={() => setFreq(265.0)}>
            Sharp C4 (265Hz)
          </Button>
          <Button variant="outline" size="sm" onClick={() => setFreq(440.0)}>
            A4 (440Hz)
          </Button>
          <Button variant="outline" size="sm" onClick={() => setFreq(329.6)}>
            E4 (329.6Hz)
          </Button>
        </div>
        
        <div style={{
        display: "flex",
        alignItems: "center",
        gap: "12px"
      }}>
          <span style={{
          fontSize: "12px",
          color: "rgba(255,255,255,0.6)"
        }}>Adjust Pitch:</span>
          <input type="range" min="200" max="600" step="1" value={freq} onChange={e => setFreq(Number(e.target.value))} style={{
          flex: 1
        }} />
          <span style={{
          fontFamily: "monospace",
          fontSize: "13px"
        }}>{freq} Hz</span>
        </div>
      </div>;
  }
}`,...l.parameters?.docs?.source}}};const h=["InTuneA440","FlatE327","SharpC264","InteractiveTuner"];export{o as FlatE327,s as InTuneA440,l as InteractiveTuner,i as SharpC264,h as __namedExportsOrder,z as default};
