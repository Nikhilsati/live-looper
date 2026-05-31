import{j as r}from"./jsx-runtime-u17CrQMm.js";import{r as s}from"./iframe-DKAZBu9M.js";import{L as c}from"./LayersDrawer-B5RQVkkY.js";import{d as a,u}from"./useLooperStore-Dvf83KgO.js";import"./preload-helper-PPVm8Dsz.js";import"./PowerIcon-CYQyr_4Q.js";import"./useDialogStore-B5Zmn5Ro.js";const k={title:"Web/LayersDrawer",component:c,tags:["ai-generated"]},n={args:{trackId:0,accent:"#a78bfa",onClose:()=>console.log("Close layers drawer")},render:i=>{const[l,t]=s.useState(!1);return s.useEffect(()=>{(async()=>{try{await a.projects.clear(),await a.tracks.clear(),await a.sections.clear(),await a.layers.clear(),await a.audioBlobs.clear(),await a.projects.add({id:"p1",name:"Demo Project",settings:{}});const e=await a.tracks.add({id:"t1",projectId:"p1",order:0}),o=await a.sections.add({id:"s1",projectId:"p1",order:0,name:"Main Groove"}),d=new Blob([new Float32Array(100).buffer],{type:"audio/wav"}),b=await a.audioBlobs.add({id:"b1",blob:d}),p=await a.audioBlobs.add({id:"b2",blob:d});await a.layers.add({id:"l1",projectId:"p1",trackId:e,sectionId:o,audioBlobId:b,order:0,name:"Base Beat"}),await a.layers.add({id:"l2",projectId:"p1",trackId:e,sectionId:o,audioBlobId:p,order:1,name:"Percussion Overdub"}),u.setState({currentProject:{id:"p1",name:"Demo Project"},currentSectionIndex:0,sections:[{id:"s1",name:"Main Groove",lengthInBars:4,order:0,trackStates:[]}]}),t(!0)}catch(e){console.error("Failed to seed storybook DB",e),t(!0)}})()},[]),l?r.jsx("div",{style:{maxWidth:"400px",padding:"12px",background:"#0a0a0f"},children:r.jsx(c,{...i})}):r.jsx("div",{children:"Loading story database..."})}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    trackId: 0,
    accent: "#a78bfa",
    onClose: () => console.log("Close layers drawer")
  },
  render: args => {
    const [ready, setReady] = useState(false);
    useEffect(() => {
      const seedDB = async () => {
        try {
          await db.projects.clear();
          await db.tracks.clear();
          await db.sections.clear();
          await db.layers.clear();
          await db.audioBlobs.clear();
          await db.projects.add({
            id: "p1",
            name: "Demo Project",
            settings: {}
          } as any);
          const trackDbId = await db.tracks.add({
            id: "t1",
            projectId: "p1",
            order: 0
          } as any);
          const sectionDbId = await db.sections.add({
            id: "s1",
            projectId: "p1",
            order: 0,
            name: "Main Groove"
          } as any);
          const dummyBlob = new Blob([new Float32Array(100).buffer], {
            type: "audio/wav"
          });
          const blobId1 = await db.audioBlobs.add({
            id: "b1",
            blob: dummyBlob
          } as any);
          const blobId2 = await db.audioBlobs.add({
            id: "b2",
            blob: dummyBlob
          } as any);
          await db.layers.add({
            id: "l1",
            projectId: "p1",
            trackId: trackDbId,
            sectionId: sectionDbId,
            audioBlobId: blobId1,
            order: 0,
            name: "Base Beat"
          } as any);
          await db.layers.add({
            id: "l2",
            projectId: "p1",
            trackId: trackDbId,
            sectionId: sectionDbId,
            audioBlobId: blobId2,
            order: 1,
            name: "Percussion Overdub"
          } as any);
          useLooperStore.setState({
            currentProject: {
              id: "p1",
              name: "Demo Project"
            } as any,
            currentSectionIndex: 0,
            sections: [{
              id: "s1",
              name: "Main Groove",
              lengthInBars: 4,
              order: 0,
              trackStates: []
            }]
          });
          setReady(true);
        } catch (e) {
          console.error("Failed to seed storybook DB", e);
          setReady(true);
        }
      };
      seedDB();
    }, []);
    if (!ready) return <div>Loading story database...</div>;
    return <div style={{
      maxWidth: "400px",
      padding: "12px",
      background: "#0a0a0f"
    }}>
        <LayersDrawer {...args} />
      </div>;
  }
}`,...n.parameters?.docs?.source}}};const g=["Default"];export{n as Default,g as __namedExportsOrder,k as default};
