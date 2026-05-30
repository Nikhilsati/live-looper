import{j as d}from"./jsx-runtime-u17CrQMm.js";import{r as n}from"./iframe-CoXEDRzF.js";import{D as i}from"./DevInspector-CBE4Wqhg.js";import{d as e,u as p}from"./useLooperStore-Bybne01-.js";import"./preload-helper-PPVm8Dsz.js";import"./useDialogStore-ElppLasU.js";const D={title:"Web/DevInspector",component:i,tags:["ai-generated"]},r={render:()=>{const[c,s]=n.useState(!1);return n.useEffect(()=>{const l=AudioContext.prototype.decodeAudioData;return AudioContext.prototype.decodeAudioData=async function(){const o=new Float32Array(88200);for(let t=0;t<88200;t++)o[t]=Math.sin(t*.005)*.6*(1-t/88200);return{length:88200,duration:2,sampleRate:44100,numberOfChannels:1,getChannelData:()=>o}},(async()=>{try{await e.projects.clear(),await e.tracks.clear(),await e.sections.clear(),await e.layers.clear(),await e.audioBlobs.clear();const a="p-dev";await e.projects.add({id:a,name:"Inspection Jam",settings:{}});const o=await e.tracks.add({id:"track-1",projectId:a,order:0}),t=await e.sections.add({id:"sec-1",projectId:a,order:0,name:"Verse 1"}),u=new Blob([new Uint8Array(1e3)],{type:"audio/wav"});await e.audioBlobs.add({id:"blob-1",projectId:a,blob:u,lengthSamples:88200,sampleRate:44100}),await e.layers.add({id:"layer-1",projectId:a,trackId:o,sectionId:t,audioBlobId:"blob-1",name:"Rhythm Guitar",order:0,createdAt:Date.now()-6e4}),p.setState({currentProject:{id:a,name:"Inspection Jam"},mode:"planning",showDevInspector:!0,bpm:120,tracks:[{isMuted:!1,isSoloed:!1,isRecording:!1,isArmed:!1,hasAudio:!0,layerCount:1,waveformData:[.1,.3,.6,.4,.2],fx:{}}],sections:[{id:"sec-1",name:"Verse 1",lengthInBars:4,order:0,trackStates:[]}]}),s(!0)}catch(a){console.error("Failed to seed inspector DB",a),s(!0)}})(),()=>{AudioContext.prototype.decodeAudioData=l}},[]),c?d.jsx("div",{style:{background:"#0a0a0f",minHeight:"400px",padding:"16px"},children:d.jsx(i,{})}):d.jsx("div",{children:"Initializing mock IndexedDB and Audio Mocks..."})}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [ready, setReady] = useState(false);
    useEffect(() => {
      // Mock AudioContext's decodeAudioData to return a beautiful sine wave for storybook rendering
      const originalDecode = AudioContext.prototype.decodeAudioData;
      AudioContext.prototype.decodeAudioData = async function () {
        const length = 44100 * 2; // 2 seconds
        const data = new Float32Array(length);
        for (let i = 0; i < length; i++) {
          data[i] = Math.sin(i * 0.005) * 0.6 * (1 - i / length); // decaying sine wave
        }
        return {
          length,
          duration: 2.0,
          sampleRate: 44100,
          numberOfChannels: 1,
          getChannelData: () => data
        } as any;
      };
      const seedDB = async () => {
        try {
          await db.projects.clear();
          await db.tracks.clear();
          await db.sections.clear();
          await db.layers.clear();
          await db.audioBlobs.clear();
          const projectId = "p-dev";
          await db.projects.add({
            id: projectId,
            name: "Inspection Jam",
            settings: {}
          } as any);
          const t1 = await db.tracks.add({
            id: "track-1",
            projectId,
            order: 0
          } as any);
          const s1 = await db.sections.add({
            id: "sec-1",
            projectId,
            order: 0,
            name: "Verse 1"
          } as any);

          // Seed a fake audio blob (WAV type container)
          const dummyBlob = new Blob([new Uint8Array(1000)], {
            type: "audio/wav"
          });
          await db.audioBlobs.add({
            id: "blob-1",
            projectId,
            blob: dummyBlob,
            lengthSamples: 88200,
            sampleRate: 44100
          } as any);
          await db.layers.add({
            id: "layer-1",
            projectId,
            trackId: t1,
            sectionId: s1,
            audioBlobId: "blob-1",
            name: "Rhythm Guitar",
            order: 0,
            createdAt: Date.now() - 60000
          } as any);
          useLooperStore.setState({
            currentProject: {
              id: projectId,
              name: "Inspection Jam"
            } as any,
            mode: "planning",
            showDevInspector: true,
            bpm: 120,
            tracks: [{
              isMuted: false,
              isSoloed: false,
              isRecording: false,
              isArmed: false,
              hasAudio: true,
              layerCount: 1,
              waveformData: [0.1, 0.3, 0.6, 0.4, 0.2],
              fx: {} as any
            }] as any,
            sections: [{
              id: "sec-1",
              name: "Verse 1",
              lengthInBars: 4,
              order: 0,
              trackStates: []
            }]
          });
          setReady(true);
        } catch (e) {
          console.error("Failed to seed inspector DB", e);
          setReady(true);
        }
      };
      seedDB();
      return () => {
        AudioContext.prototype.decodeAudioData = originalDecode;
      };
    }, []);
    if (!ready) return <div>Initializing mock IndexedDB and Audio Mocks...</div>;
    return <div style={{
      background: "#0a0a0f",
      minHeight: "400px",
      padding: "16px"
    }}>
        <DevInspector />
      </div>;
  }
}`,...r.parameters?.docs?.source}}};const I=["DefaultInspector"];export{r as DefaultInspector,I as __namedExportsOrder,D as default};
