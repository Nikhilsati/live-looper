import{j as a}from"./jsx-runtime-u17CrQMm.js";import{r as p}from"./iframe-BXJpxzHH.js";import{S as c}from"./SongPlanner-C7iYJxht.js";import{u as e}from"./useLooperStore-BfSgrONV.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D3pbEsCm.js";import"./PowerIcon-MhrZRzOh.js";import"./TrackControls-DpoNw5L1.js";import"./useSessionStore-DGrFwR9j.js";import"./index-BhM3fhe2.js";import"./useDialogStore-7q7Veijn.js";import"./TrackFX-D44tMDTn.js";import"./index-BlgGgipN.js";import"./index-CRrYHsHn.js";import"./UploadSimple.es-BcU1hz6L.js";import"./IconBase.es-c7dv95h9.js";import"./FloppyDisk.es-DfosdXF7.js";import"./Sliders.es-DEHWsp6N.js";import"./Trash.es-BgCRKvX9.js";import"./X.es-OFt9uGlE.js";import"./LatencyMonitor-BjHyaxLm.js";import"./ArrowsClockwise.es-CYsyLPi2.js";import"./Lightning.es-DvM1n1hL.js";import"./InputChannelSelector-CLxjJIGQ.js";import"./SettingsPopover-CkLm44tE.js";const w={title:"Web/SongPlanner",component:c,tags:["ai-generated"]},S=[{id:"s1",name:"Intro",lengthInBars:4,order:0,trackStates:[]},{id:"s2",name:"Verse 1",lengthInBars:8,order:1,trackStates:[]},{id:"s3",name:"Chorus",lengthInBars:8,order:2,trackStates:[]},{id:"s4",name:"Outro",lengthInBars:4,order:3,trackStates:[]}],s={render:()=>(p.useEffect(()=>{e.setState({mode:"planning",isPlaying:!1,sections:S,currentSectionIndex:1,queuedSectionIndex:null,addSection:n=>{const t=e.getState().sections,r=[...t,{id:Math.random().toString(),name:n,lengthInBars:4,order:t.length,trackStates:[]}];return e.setState({sections:r}),Promise.resolve()},deleteSection:n=>{const t=e.getState().sections.filter(r=>r.id!==n);return e.setState({sections:t}),Promise.resolve()},renameSection:(n,t)=>{const r=e.getState().sections.map(o=>o.id===n?{...o,name:t}:o);return e.setState({sections:r}),Promise.resolve()},reorderSections:n=>{const t=e.getState().sections,r=n.map((o,d)=>{const i=t.find(m=>m.id===o);return i?{...i,order:d}:null}).filter(o=>o!==null);return e.setState({sections:r}),Promise.resolve()}})},[]),a.jsx("div",{style:{maxWidth:"800px",padding:"16px"},children:a.jsx(c,{})}))};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const z=["Default"];export{s as Default,z as __namedExportsOrder,w as default};
