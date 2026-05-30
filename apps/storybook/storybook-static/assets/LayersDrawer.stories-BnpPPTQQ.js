import{j as t}from"./jsx-runtime-u17CrQMm.js";import{r as s}from"./iframe-CV-5FfhP.js";import{L as i}from"./TrackControls-BA4tbgkZ.js";import{d as a,u as m}from"./useLooperStore-Dw-zsQq8.js";import"./preload-helper-PPVm8Dsz.js";import"./PowerIcon-MhrZRzOh.js";import"./index-B8eWrQ5m.js";import"./TrackFX-BFa6CjWL.js";import"./index-D6ld3hFY.js";import"./index-BNvylKEa.js";import"./UploadSimple.es-BJz-JGZG.js";import"./IconBase.es-DSmtO-o_.js";import"./FloppyDisk.es-CKSQN_Gm.js";import"./Sliders.es-pqjgSKC9.js";import"./Trash.es-C-7gRwRW.js";import"./X.es-BM8FFSxz.js";import"./LatencyMonitor-CuLSs1u-.js";import"./ArrowsClockwise.es-vnVStLo6.js";import"./Lightning.es-BzvzFfQf.js";import"./InputChannelSelector-DR92D-f6.js";import"./SettingsPopover-B4CW-DR2.js";import"./useDialogStore-ddHqeGHH.js";const W={title:"Web/LayersDrawer",component:i,tags:["ai-generated"]},r={args:{trackId:0,accent:"#a78bfa",onClose:()=>console.log("Close layers drawer")},render:c=>{const[l,n]=s.useState(!1);return s.useEffect(()=>{(async()=>{try{await a.projects.clear(),await a.tracks.clear(),await a.sections.clear(),await a.layers.clear(),await a.audioBlobs.clear(),await a.projects.add({id:"p1",name:"Demo Project",settings:{}});const e=await a.tracks.add({id:"t1",projectId:"p1",order:0}),o=await a.sections.add({id:"s1",projectId:"p1",order:0,name:"Main Groove"}),d=new Blob([new Float32Array(100).buffer],{type:"audio/wav"}),b=await a.audioBlobs.add({id:"b1",blob:d}),p=await a.audioBlobs.add({id:"b2",blob:d});await a.layers.add({id:"l1",projectId:"p1",trackId:e,sectionId:o,audioBlobId:b,order:0,name:"Base Beat"}),await a.layers.add({id:"l2",projectId:"p1",trackId:e,sectionId:o,audioBlobId:p,order:1,name:"Percussion Overdub"}),m.setState({currentProject:{id:"p1",name:"Demo Project"},currentSectionIndex:0,sections:[{id:"s1",name:"Main Groove",lengthInBars:4,order:0,trackStates:[]}]}),n(!0)}catch(e){console.error("Failed to seed storybook DB",e),n(!0)}})()},[]),l?t.jsx("div",{style:{maxWidth:"400px",padding:"12px",background:"#0a0a0f"},children:t.jsx(i,{...c})}):t.jsx("div",{children:"Loading story database..."})}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
}`,...r.parameters?.docs?.source}}};const A=["Default"];export{r as Default,A as __namedExportsOrder,W as default};
