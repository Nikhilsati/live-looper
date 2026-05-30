import{j as a}from"./jsx-runtime-u17CrQMm.js";import{r as S}from"./iframe-3i2WR5Xa.js";import{S as c}from"./SongPlanner-DuOJWChQ.js";import{u as e}from"./useLooperStore-D8NVNae3.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CAi--mKy.js";import"./PowerIcon-MhrZRzOh.js";import"./TrackControls-CHLowz8S.js";import"./TrackFX-xYd0F-eP.js";import"./index-B5R4sxe6.js";import"./index-BOgzelvg.js";import"./UploadSimple.es-BVBZzRYz.js";import"./IconBase.es-BPfYamxb.js";import"./FloppyDisk.es-C-BEqMvD.js";import"./Sliders.es-DiNjM7eB.js";import"./Trash.es-NkZ_2-SY.js";import"./X.es-DKF1rw0x.js";import"./LatencyMonitor-jcsEBinV.js";import"./ArrowsClockwise.es-DBPdaSFq.js";import"./Lightning.es-DU56mEC3.js";import"./InputChannelSelector-CPB52Oky.js";import"./SettingsPopover-B4dohh2J.js";import"./useDialogStore-ChE-5abl.js";const R={title:"Web/SongPlanner",component:c,tags:["ai-generated"]},p=[{id:"s1",name:"Intro",lengthInBars:4,order:0,trackStates:[]},{id:"s2",name:"Verse 1",lengthInBars:8,order:1,trackStates:[]},{id:"s3",name:"Chorus",lengthInBars:8,order:2,trackStates:[]},{id:"s4",name:"Outro",lengthInBars:4,order:3,trackStates:[]}],s={render:()=>(S.useEffect(()=>{e.setState({mode:"planning",isPlaying:!1,sections:p,currentSectionIndex:1,queuedSectionIndex:null,addSection:n=>{const t=e.getState().sections,r=[...t,{id:Math.random().toString(),name:n,lengthInBars:4,order:t.length,trackStates:[]}];return e.setState({sections:r}),Promise.resolve()},deleteSection:n=>{const t=e.getState().sections.filter(r=>r.id!==n);return e.setState({sections:t}),Promise.resolve()},renameSection:(n,t)=>{const r=e.getState().sections.map(o=>o.id===n?{...o,name:t}:o);return e.setState({sections:r}),Promise.resolve()},reorderSections:n=>{const t=e.getState().sections,r=n.map((o,d)=>{const i=t.find(m=>m.id===o);return i?{...i,order:d}:null}).filter(o=>o!==null);return e.setState({sections:r}),Promise.resolve()}})},[]),a.jsx("div",{style:{maxWidth:"800px",padding:"16px"},children:a.jsx(c,{})}))};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        mode: "planning",
        isPlaying: false,
        sections: mockSections,
        currentSectionIndex: 1,
        queuedSectionIndex: null,
        addSection: name => {
          const current = useLooperStore.getState().sections;
          const next = [...current, {
            id: Math.random().toString(),
            name,
            lengthInBars: 4,
            order: current.length,
            trackStates: []
          }];
          useLooperStore.setState({
            sections: next
          });
          return Promise.resolve();
        },
        deleteSection: id => {
          const next = useLooperStore.getState().sections.filter(s => s.id !== id);
          useLooperStore.setState({
            sections: next
          });
          return Promise.resolve();
        },
        renameSection: (id, name) => {
          const next = useLooperStore.getState().sections.map(s => s.id === id ? {
            ...s,
            name
          } : s);
          useLooperStore.setState({
            sections: next
          });
          return Promise.resolve();
        },
        reorderSections: ids => {
          const current = useLooperStore.getState().sections;
          const next = ids.map((id, index) => {
            const sec = current.find(s => s.id === id);
            return sec ? {
              ...sec,
              order: index
            } : null;
          }).filter(s => s !== null);
          useLooperStore.setState({
            sections: next as any
          });
          return Promise.resolve();
        }
      });
    }, []);
    return <div style={{
      maxWidth: "800px",
      padding: "16px"
    }}>
        <SongPlanner />
      </div>;
  }
}`,...s.parameters?.docs?.source}}};const V=["Default"];export{s as Default,V as __namedExportsOrder,R as default};
