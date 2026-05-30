import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as f}from"./iframe-CV-5FfhP.js";import{a as u,u as i,F as a}from"./useLooperStore-Dw-zsQq8.js";import{a as m,R as l,B as x,H as y,T as S,d as j}from"./index-B8eWrQ5m.js";import{H as v,a as b,G as w}from"./TrackControls-BA4tbgkZ.js";import{S as I}from"./SongPlanner-CfZ14fez.js";import{D as P}from"./DevInspector-CjO_vTOM.js";import{M as R}from"./ModeSwitcher-Bqtl1Qyy.js";import{m as D}from"./PowerIcon-MhrZRzOh.js";import{u as T,a as A,M as B,R as L,b as M}from"./chunk-LFPYN7LY-B_dl7R49.js";import"./preload-helper-PPVm8Dsz.js";import"./useDialogStore-ddHqeGHH.js";import"./TrackFX-BFa6CjWL.js";import"./index-D6ld3hFY.js";import"./index-BNvylKEa.js";import"./UploadSimple.es-BJz-JGZG.js";import"./IconBase.es-DSmtO-o_.js";import"./FloppyDisk.es-CKSQN_Gm.js";import"./Sliders.es-pqjgSKC9.js";import"./Trash.es-C-7gRwRW.js";import"./X.es-BM8FFSxz.js";import"./LatencyMonitor-CuLSs1u-.js";import"./ArrowsClockwise.es-vnVStLo6.js";import"./Lightning.es-BzvzFfQf.js";import"./InputChannelSelector-DR92D-f6.js";import"./SettingsPopover-B4CW-DR2.js";import"./SessionManager-ChCm3zkP.js";const W=()=>{const s=u(o=>o.togglePlayback),c=i(o=>o.toggleTrackRecording);f.useEffect(()=>{const o=n=>{if(!(n.target instanceof HTMLInputElement||n.target instanceof HTMLTextAreaElement)){if(n.code==="Space"&&(n.preventDefault(),s()),["Digit1","Digit2","Digit3","Digit4"].includes(n.code)){const t=parseInt(n.code.replace("Digit",""),10)-1;c(t)}if(n.code==="KeyR"){n.preventDefault();const{isPlaying:t,mode:g}=i.getState();if(g==="planning")return;const{isSessionArmed:p,setIsSessionArmed:r,toggleRecording:h}=u.getState();t?h():r(!p)}}};return window.addEventListener("keydown",o),()=>window.removeEventListener("keydown",o)},[s,c])},k=()=>{const{id:s}=T(),c=A(),{currentProject:o,mode:n,closeProject:t,loadProject:g}=i();W(),f.useEffect(()=>{s&&o?.id!==s&&g(s),i.getState().refreshDevices()},[s]);const p=()=>{t(),c("/")},r=n==="live";return e.jsxs(m,{style:{width:"100%",maxWidth:1400,margin:"0 auto",padding:r?"16px":"24px",paddingBottom:120,transition:"padding 0.3s ease"},children:[e.jsxs(l,{style:{width:"100%",justifyContent:"space-between",alignItems:"center",marginBottom:r?20:32,transition:"margin 0.3s ease"},children:[e.jsxs(l,{style:{gap:20,alignItems:"center",flex:1},children:[!r&&e.jsx(x,{variant:"ghost",onClick:p,style:{padding:8},children:e.jsx(D,{size:24})}),e.jsxs(m,{style:{gap:4},children:[e.jsx(y,{style:{fontSize:r?22:28},children:o?.name||"Live Looper"}),e.jsxs(l,{style:{gap:8,alignItems:"center"},children:[e.jsxs("span",{style:{fontSize:10,fontWeight:900,letterSpacing:"0.08em",padding:"2px 8px",borderRadius:6,background:n==="planning"?"rgba(59,130,246,0.12)":n==="practice"?"rgba(234,179,8,0.12)":"rgba(220,38,38,0.12)",color:n==="planning"?"#93c5fd":n==="practice"?"#fcd34d":"#fca5a5",border:`1px solid ${n==="planning"?"rgba(59,130,246,0.25)":n==="practice"?"rgba(234,179,8,0.25)":"rgba(220,38,38,0.25)"}`,textTransform:"uppercase"},children:[n," mode"]}),!r&&e.jsx(S,{style:{opacity:.4,fontSize:11},children:"Session Active"})]})]}),e.jsx("div",{style:{width:1,height:32,background:"rgba(255,255,255,0.1)",margin:"0 8px"}}),e.jsx(v,{})]}),e.jsxs(l,{style:{gap:24,alignItems:"center"},children:[e.jsx(R,{}),e.jsx(j,{})]})]}),e.jsxs(m,{style:{gap:r?20:32,transition:"gap 0.3s ease"},children:[e.jsx(I,{}),e.jsx(b,{}),e.jsx(P,{})]}),e.jsx(w,{})]})};k.__docgenInfo={description:"",methods:[],displayName:"LooperWorkspace"};const le={title:"Web/LooperWorkspace",component:k,tags:["ai-generated"],decorators:[s=>e.jsx(B,{initialEntries:["/projects/p-workspace"],children:e.jsx(L,{children:e.jsx(M,{path:"/projects/:id",element:e.jsx(s,{})})})})]},C=[{isMuted:!1,isSoloed:!1,isRecording:!1,isArmed:!1,hasAudio:!0,layerCount:2,waveformData:[.1,.4,.6,.7,.5],fx:new a().build()},{isMuted:!1,isSoloed:!1,isRecording:!1,isArmed:!0,hasAudio:!1,layerCount:0,waveformData:[],fx:new a().build()},{isMuted:!1,isSoloed:!1,isRecording:!1,isArmed:!1,hasAudio:!1,layerCount:0,waveformData:[],fx:new a().build()},{isMuted:!1,isSoloed:!1,isRecording:!1,isArmed:!1,hasAudio:!1,layerCount:0,waveformData:[],fx:new a().build()}],d={render:()=>(f.useEffect(()=>{i.setState({currentProject:{id:"p-workspace",name:"Indie Groove Jam"},mode:"planning",isPlaying:!1,bpm:108,currentBar:1,currentBeat:1,sectionProgress:0,currentSectionIndex:0,queuedSectionIndex:null,sections:[{id:"s1",name:"Main Intro",lengthInBars:4,order:0,trackStates:[]},{id:"s2",name:"Chorus Peak",lengthInBars:8,order:1,trackStates:[]}],tracks:C,liveTrack:{isMuted:!1,fx:new a().build()},inputLevels:[.02,.01,0,0],channelMapping:[null,null,null,null],trackChannelConfig:{0:{mode:"stereo"},1:{mode:"stereo"},2:{mode:"stereo"},3:{mode:"stereo"}},showDevInspector:!1,loadProject:async s=>console.log("Workspace loading project:",s),refreshDevices:async()=>console.log("Workspace refresh devices"),closeProject:()=>console.log("Workspace close project"),toggleTrackRecording:s=>console.log("Toggle track record:",s)}),u.setState({isSessionArmed:!1,isSessionRecording:!1,isSessionReplaying:!1,togglePlayback:async()=>console.log("Toggle playback action")})},[]),e.jsx("div",{style:{background:"#0a0a0f",minHeight:"100vh"},children:e.jsx(k,{})}))};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        currentProject: {
          id: "p-workspace",
          name: "Indie Groove Jam"
        } as any,
        mode: "planning",
        isPlaying: false,
        bpm: 108,
        currentBar: 1,
        currentBeat: 1,
        sectionProgress: 0,
        currentSectionIndex: 0,
        queuedSectionIndex: null,
        sections: [{
          id: "s1",
          name: "Main Intro",
          lengthInBars: 4,
          order: 0,
          trackStates: []
        }, {
          id: "s2",
          name: "Chorus Peak",
          lengthInBars: 8,
          order: 1,
          trackStates: []
        }],
        tracks: mockTracks as any,
        liveTrack: {
          isMuted: false,
          fx: new FXBuilder().build()
        },
        inputLevels: [0.02, 0.01, 0, 0],
        channelMapping: [null, null, null, null],
        trackChannelConfig: {
          0: {
            mode: "stereo"
          },
          1: {
            mode: "stereo"
          },
          2: {
            mode: "stereo"
          },
          3: {
            mode: "stereo"
          }
        },
        showDevInspector: false,
        loadProject: async id => console.log("Workspace loading project:", id),
        refreshDevices: async () => console.log("Workspace refresh devices"),
        closeProject: () => console.log("Workspace close project"),
        toggleTrackRecording: id => console.log("Toggle track record:", id)
      });
      useSessionStore.setState({
        isSessionArmed: false,
        isSessionRecording: false,
        isSessionReplaying: false,
        togglePlayback: async () => console.log("Toggle playback action")
      });
    }, []);
    return <div style={{
      background: "#0a0a0f",
      minHeight: "100vh"
    }}>
        <LooperWorkspace />
      </div>;
  }
}`,...d.parameters?.docs?.source}}};const de=["PlanningWorkspace"];export{d as PlanningWorkspace,de as __namedExportsOrder,le as default};
