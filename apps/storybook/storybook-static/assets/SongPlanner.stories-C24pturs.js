import{j as a}from"./jsx-runtime-u17CrQMm.js";import{r as S}from"./iframe-CoXEDRzF.js";import{S as c}from"./SongPlanner-DDPkJbDd.js";import{u as e}from"./useLooperStore-Bybne01-.js";import"./preload-helper-PPVm8Dsz.js";import"./index-7QDTVwY0.js";import"./PowerIcon-MhrZRzOh.js";import"./TrackControls-D82avz0U.js";import"./TrackFX-e6p_QtSa.js";import"./index-CgSukmKq.js";import"./index-CyrqA3Ya.js";import"./UploadSimple.es-y1Pk1ARz.js";import"./IconBase.es-DSIt0WZZ.js";import"./FloppyDisk.es-DXhyPX4k.js";import"./Sliders.es-xBAbiGhp.js";import"./Trash.es-C-uUh0KV.js";import"./X.es-7u80lDDN.js";import"./LatencyMonitor-Kt043hsF.js";import"./ArrowsClockwise.es-BmMsv_xV.js";import"./Lightning.es-Dx41jP9m.js";import"./InputChannelSelector-CLkRBLhl.js";import"./SettingsPopover-B53-rj5t.js";import"./useDialogStore-ElppLasU.js";const R={title:"Web/SongPlanner",component:c,tags:["ai-generated"]},p=[{id:"s1",name:"Intro",lengthInBars:4,order:0,trackStates:[]},{id:"s2",name:"Verse 1",lengthInBars:8,order:1,trackStates:[]},{id:"s3",name:"Chorus",lengthInBars:8,order:2,trackStates:[]},{id:"s4",name:"Outro",lengthInBars:4,order:3,trackStates:[]}],s={render:()=>(S.useEffect(()=>{e.setState({mode:"planning",isPlaying:!1,sections:p,currentSectionIndex:1,queuedSectionIndex:null,addSection:n=>{const t=e.getState().sections,r=[...t,{id:Math.random().toString(),name:n,lengthInBars:4,order:t.length,trackStates:[]}];return e.setState({sections:r}),Promise.resolve()},deleteSection:n=>{const t=e.getState().sections.filter(r=>r.id!==n);return e.setState({sections:t}),Promise.resolve()},renameSection:(n,t)=>{const r=e.getState().sections.map(o=>o.id===n?{...o,name:t}:o);return e.setState({sections:r}),Promise.resolve()},reorderSections:n=>{const t=e.getState().sections,r=n.map((o,d)=>{const i=t.find(m=>m.id===o);return i?{...i,order:d}:null}).filter(o=>o!==null);return e.setState({sections:r}),Promise.resolve()}})},[]),a.jsx("div",{style:{maxWidth:"800px",padding:"16px"},children:a.jsx(c,{})}))};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
