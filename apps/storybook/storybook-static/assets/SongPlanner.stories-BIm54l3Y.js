import{j as a}from"./jsx-runtime-u17CrQMm.js";import{r as u}from"./iframe-DKAZBu9M.js";import{S as c}from"./SongPlanner-rBcr-W-1.js";import{u as e}from"./useLooperStore-Dvf83KgO.js";import"./preload-helper-PPVm8Dsz.js";import"./index-i1lnfb4e.js";import"./PowerIcon-CYQyr_4Q.js";import"./trackColors-bnaEkYfa.js";import"./useDialogStore-B5Zmn5Ro.js";const L={title:"Web/SongPlanner",component:c,tags:["ai-generated"]},l=[{id:"s1",name:"Intro",lengthInBars:4,order:0,trackStates:[]},{id:"s2",name:"Verse 1",lengthInBars:8,order:1,trackStates:[]},{id:"s3",name:"Chorus",lengthInBars:8,order:2,trackStates:[]},{id:"s4",name:"Outro",lengthInBars:4,order:3,trackStates:[]}],o={render:()=>(u.useEffect(()=>{e.setState({mode:"planning",isPlaying:!1,sections:l,currentSectionIndex:1,queuedSectionIndex:null,addSection:n=>{const t=e.getState().sections,r=[...t,{id:Math.random().toString(),name:n,lengthInBars:4,order:t.length,trackStates:[]}];return e.setState({sections:r}),Promise.resolve()},deleteSection:n=>{const t=e.getState().sections.filter(r=>r.id!==n);return e.setState({sections:t}),Promise.resolve()},renameSection:(n,t)=>{const r=e.getState().sections.map(s=>s.id===n?{...s,name:t}:s);return e.setState({sections:r}),Promise.resolve()},reorderSections:n=>{const t=e.getState().sections,r=n.map((s,d)=>{const i=t.find(S=>S.id===s);return i?{...i,order:d}:null}).filter(s=>s!==null);return e.setState({sections:r}),Promise.resolve()}})},[]),a.jsx("div",{style:{maxWidth:"800px",padding:"16px"},children:a.jsx(c,{})}))};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
}`,...o.parameters?.docs?.source}}};const k=["Default"];export{o as Default,k as __namedExportsOrder,L as default};
