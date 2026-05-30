import{j as a,C as q,B as f}from"./index-sm5rAtOb.js";import{r as u}from"./iframe-BQs9XC90.js";import"./preload-helper-PPVm8Dsz.js";const H=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];function T(e){const n=12*(Math.log(e/440)/Math.log(2));return Math.round(n)+69}function w(e){return 440*Math.pow(2,(e-69)/12)}function B(e,n){let s=0;for(let t=0;t<e.length;t++){const d=e[t];s+=d*d}if(s=Math.sqrt(s/e.length),s<.01)return-1;let o=0,h=e.length-1,l=.2;for(let t=0;t<e.length/2;t++)if(Math.abs(e[t])<l){o=t;break}for(let t=1;t<e.length/2;t++)if(Math.abs(e[e.length-t])<l){h=e.length-t;break}let m=e.slice(o,h),c=m.length,r=new Array(c).fill(0);for(let t=0;t<c;t++)for(let d=0;d<c-t;d++)r[t]=r[t]+m[d]*m[d+t];let p=0;for(;r[p]>r[p+1];)p++;let y=-1,x=-1;for(let t=p;t<c;t++)r[t]>y&&(y=r[t],x=t);let i=x,g=r[i-1],F=r[i],v=r[i+1],A=(g+v-2*F)/2,M=(v-g)/2;return A&&(i=i-M/(2*A)),n/i}const k=({analyser:e})=>{const[n,s]=u.useState(-1),[o,h]=u.useState("-"),[l,m]=u.useState(0),c=u.useRef(0);u.useEffect(()=>{if(!e){s(-1),h("-"),m(0);return}const p=new Float32Array(2048),y=e.context.sampleRate,x=()=>{e.getFloatTimeDomainData(p);const i=B(p,y);if(i>-1){const g=T(i),F=w(g),v=Math.floor(1200*Math.log(i/F)/Math.log(2));s(i),h(H[g%12]),m(v)}else s(-1);c.current=requestAnimationFrame(x)};return c.current=requestAnimationFrame(x),()=>cancelAnimationFrame(c.current)},[e]);const r=Math.abs(l)<=10&&n!==-1;return a.jsxs(q,{className:"tuner-panel",style:{width:"100%",padding:"16px 24px",display:"flex",flexDirection:"column",alignItems:"center",gap:12,background:r?"rgba(16, 185, 129, 0.05)":"var(--background)",border:r?"1px solid rgba(16, 185, 129, 0.2)":"1px solid var(--border)",transition:"all 0.2s ease",flexShrink:0,marginBottom:16},children:[a.jsxs("div",{style:{display:"flex",justifyContent:"space-between",width:"100%",alignItems:"center"},children:[a.jsx("span",{style:{fontSize:11,fontWeight:700,letterSpacing:"0.15em",color:"rgba(255,255,255,0.4)",textTransform:"uppercase"},children:"Chromatic Tuner"}),a.jsx("span",{style:{fontSize:11,fontFamily:"monospace",color:n>-1?"rgba(255,255,255,0.7)":"rgba(255,255,255,0.2)"},children:n>-1?`${n.toFixed(1)} Hz`:"--- Hz"})]}),a.jsxs("div",{style:{display:"flex",alignItems:"center",gap:20},children:[a.jsx("div",{style:{fontSize:14,fontWeight:700,color:l<-10&&n!==-1?"#facc15":"rgba(255,255,255,0.2)"},children:"♭"}),a.jsxs("div",{style:{width:240,height:6,background:"rgba(255,255,255,0.05)",borderRadius:3,position:"relative"},children:[a.jsx("div",{style:{position:"absolute",left:"50%",top:-4,bottom:-4,width:2,background:"rgba(255,255,255,0.2)"}}),n!==-1&&a.jsx("div",{style:{position:"absolute",left:`calc(50% + ${Math.max(-50,Math.min(50,l))/50*50}%)`,top:-4,bottom:-4,width:4,marginLeft:-2,background:r?"#10b981":l<0?"#facc15":"#ef4444",borderRadius:2,boxShadow:`0 0 10px ${r?"#10b981":l<0?"#facc15":"#ef4444"}`,transition:"left 0.1s ease-out"}})]}),a.jsx("div",{style:{fontSize:14,fontWeight:700,color:l>10&&n!==-1?"#ef4444":"rgba(255,255,255,0.2)"},children:"♯"})]}),a.jsx("div",{style:{fontSize:42,fontWeight:800,lineHeight:1,color:n===-1?"rgba(255,255,255,0.1)":r?"#10b981":"white"},children:n===-1?"-":o})]})};k.__docgenInfo={description:"",methods:[],displayName:"Tuner",props:{analyser:{required:!0,tsType:{name:"union",raw:"AnalyserNode | null",elements:[{name:"AnalyserNode"},{name:"null"}]},description:""}}};const R={title:"Web/Tuner",component:k},S=e=>({context:{sampleRate:44100},getFloatTimeDomainData:n=>{for(let o=0;o<n.length;o++)n[o]=.8*Math.sin(2*Math.PI*e*(o/44100))+.05*(Math.random()-.5)}}),z={args:{analyser:S(440)}},b={args:{analyser:S(327)}},j={args:{analyser:S(264)}},C={render:()=>{const[e,n]=u.useState(440),s=S(e);return a.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px",maxWidth:"400px"},children:[a.jsx(k,{analyser:s}),a.jsxs("div",{style:{display:"flex",gap:"8px",flexWrap:"wrap"},children:[a.jsx(f,{variant:"outline",size:"sm",onClick:()=>n(261.6),children:"C4 (261.6Hz)"}),a.jsx(f,{variant:"outline",size:"sm",onClick:()=>n(258),children:"Flat C4 (258Hz)"}),a.jsx(f,{variant:"outline",size:"sm",onClick:()=>n(265),children:"Sharp C4 (265Hz)"}),a.jsx(f,{variant:"outline",size:"sm",onClick:()=>n(440),children:"A4 (440Hz)"}),a.jsx(f,{variant:"outline",size:"sm",onClick:()=>n(329.6),children:"E4 (329.6Hz)"})]}),a.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[a.jsx("span",{style:{fontSize:"12px",color:"rgba(255,255,255,0.6)"},children:"Adjust Pitch:"}),a.jsx("input",{type:"range",min:"200",max:"600",step:"1",value:e,onChange:o=>n(Number(o.target.value)),style:{flex:1}}),a.jsxs("span",{style:{fontFamily:"monospace",fontSize:"13px"},children:[e," Hz"]})]})]})}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    analyser: createMockAnalyser(440) // Perfect A4 (440 Hz)
  }
}`,...z.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    analyser: createMockAnalyser(327) // Flat E (Ideal is 329.6 Hz)
  }
}`,...b.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    analyser: createMockAnalyser(264) // Sharp C (Ideal is 261.6 Hz)
  }
}`,...j.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
}`,...C.parameters?.docs?.source}}};const D=["InTuneA440","FlatE327","SharpC264","InteractiveTuner"];export{b as FlatE327,z as InTuneA440,C as InteractiveTuner,j as SharpC264,D as __namedExportsOrder,R as default};
