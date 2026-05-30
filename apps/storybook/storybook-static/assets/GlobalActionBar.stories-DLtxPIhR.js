import{j as t}from"./jsx-runtime-u17CrQMm.js";import{r as a}from"./iframe-CV-5FfhP.js";import{G as r}from"./TrackControls-BA4tbgkZ.js";import{u as n,F as l,a as s}from"./useLooperStore-Dw-zsQq8.js";import"./preload-helper-PPVm8Dsz.js";import"./PowerIcon-MhrZRzOh.js";import"./index-B8eWrQ5m.js";import"./TrackFX-BFa6CjWL.js";import"./index-D6ld3hFY.js";import"./index-BNvylKEa.js";import"./UploadSimple.es-BJz-JGZG.js";import"./IconBase.es-DSmtO-o_.js";import"./FloppyDisk.es-CKSQN_Gm.js";import"./Sliders.es-pqjgSKC9.js";import"./Trash.es-C-7gRwRW.js";import"./X.es-BM8FFSxz.js";import"./LatencyMonitor-CuLSs1u-.js";import"./ArrowsClockwise.es-vnVStLo6.js";import"./Lightning.es-BzvzFfQf.js";import"./InputChannelSelector-DR92D-f6.js";import"./SettingsPopover-B4CW-DR2.js";import"./useDialogStore-ddHqeGHH.js";const E={title:"Web/GlobalActionBar",component:r,tags:["ai-generated"]},o={render:()=>(a.useEffect(()=>{n.setState({isPlaying:!1,mode:"planning",bpm:120,currentSectionIndex:0,queuedSectionIndex:null,sections:[{id:"s1",name:"Main Chorus",lengthInBars:4,order:0,trackStates:[]}],showLayers:!1,showDevInspector:!1,setShowLayers:e=>n.setState({showLayers:e}),setShowDevInspector:e=>n.setState({showDevInspector:e}),setBpm:e=>n.setState({bpm:e}),availableInputs:[],availableOutputs:[],inputDeviceId:null,outputDeviceId:null,refreshDevices:async()=>{},smartSnapEnabled:!0,dualOutputMode:!1,liveTrack:{isMuted:!1,fx:new l().build()}}),s.setState({isSessionArmed:!1,isSessionRecording:!1,recordingDuration:0,togglePlayback:async()=>{const e=n.getState().isPlaying;n.setState({isPlaying:!e})},setIsSessionArmed:e=>s.setState({isSessionArmed:e}),toggleRecording:async()=>{const e=s.getState().isSessionRecording;s.setState({isSessionRecording:!e})}})},[]),t.jsx("div",{style:{background:"#0a0a0f",minHeight:"200px",padding:"20px"},children:t.jsx("div",{style:{position:"relative",width:"100%",height:"100px"},children:t.jsx(r,{})})}))},i={render:()=>(a.useEffect(()=>{n.setState({isPlaying:!0,mode:"practice",bpm:100,currentSectionIndex:0,queuedSectionIndex:null,sections:[{id:"s1",name:"Chorus Peak",lengthInBars:8,order:0,trackStates:[]}],showLayers:!1,showDevInspector:!1,setShowLayers:e=>n.setState({showLayers:e}),setShowDevInspector:e=>n.setState({showDevInspector:e}),setBpm:e=>n.setState({bpm:e}),availableInputs:[],availableOutputs:[],inputDeviceId:null,outputDeviceId:null,refreshDevices:async()=>{},smartSnapEnabled:!0,dualOutputMode:!1,liveTrack:{isMuted:!1,fx:new l().build()}}),s.setState({isSessionArmed:!1,isSessionRecording:!0,recordingDuration:24500,togglePlayback:async()=>{const e=n.getState().isPlaying;n.setState({isPlaying:!e})},setIsSessionArmed:e=>s.setState({isSessionArmed:e}),toggleRecording:async()=>{const e=s.getState().isSessionRecording;s.setState({isSessionRecording:!e})}})},[]),t.jsx("div",{style:{background:"#0a0a0f",minHeight:"200px",padding:"20px"},children:t.jsx("div",{style:{position:"relative",width:"100%",height:"100px"},children:t.jsx(r,{})})}))};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        isPlaying: false,
        mode: "planning",
        bpm: 120,
        currentSectionIndex: 0,
        queuedSectionIndex: null,
        sections: [{
          id: "s1",
          name: "Main Chorus",
          lengthInBars: 4,
          order: 0,
          trackStates: []
        }],
        showLayers: false,
        showDevInspector: false,
        setShowLayers: v => useLooperStore.setState({
          showLayers: v
        }),
        setShowDevInspector: v => useLooperStore.setState({
          showDevInspector: v
        }),
        setBpm: b => useLooperStore.setState({
          bpm: b
        }),
        availableInputs: [],
        availableOutputs: [],
        inputDeviceId: null,
        outputDeviceId: null,
        refreshDevices: async () => {},
        smartSnapEnabled: true,
        dualOutputMode: false,
        liveTrack: {
          isMuted: false,
          fx: new FXBuilder().build()
        }
      });
      useSessionStore.setState({
        isSessionArmed: false,
        isSessionRecording: false,
        recordingDuration: 0,
        togglePlayback: async () => {
          const playing = useLooperStore.getState().isPlaying;
          useLooperStore.setState({
            isPlaying: !playing
          });
        },
        setIsSessionArmed: v => useSessionStore.setState({
          isSessionArmed: v
        }),
        toggleRecording: async () => {
          const rec = useSessionStore.getState().isSessionRecording;
          useSessionStore.setState({
            isSessionRecording: !rec
          });
        }
      });
    }, []);
    return <div style={{
      background: "#0a0a0f",
      minHeight: "200px",
      padding: "20px"
    }}>
        {/* Relative layout wrapper for fixed positioning inside the storybook iframe */}
        <div style={{
        position: "relative",
        width: "100%",
        height: "100px"
      }}>
          <GlobalActionBar />
        </div>
      </div>;
  }
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        isPlaying: true,
        mode: "practice",
        bpm: 100,
        currentSectionIndex: 0,
        queuedSectionIndex: null,
        sections: [{
          id: "s1",
          name: "Chorus Peak",
          lengthInBars: 8,
          order: 0,
          trackStates: []
        }],
        showLayers: false,
        showDevInspector: false,
        setShowLayers: v => useLooperStore.setState({
          showLayers: v
        }),
        setShowDevInspector: v => useLooperStore.setState({
          showDevInspector: v
        }),
        setBpm: b => useLooperStore.setState({
          bpm: b
        }),
        availableInputs: [],
        availableOutputs: [],
        inputDeviceId: null,
        outputDeviceId: null,
        refreshDevices: async () => {},
        smartSnapEnabled: true,
        dualOutputMode: false,
        liveTrack: {
          isMuted: false,
          fx: new FXBuilder().build()
        }
      });
      useSessionStore.setState({
        isSessionArmed: false,
        isSessionRecording: true,
        recordingDuration: 24500,
        // 24.5 seconds
        togglePlayback: async () => {
          const playing = useLooperStore.getState().isPlaying;
          useLooperStore.setState({
            isPlaying: !playing
          });
        },
        setIsSessionArmed: v => useSessionStore.setState({
          isSessionArmed: v
        }),
        toggleRecording: async () => {
          const rec = useSessionStore.getState().isSessionRecording;
          useSessionStore.setState({
            isSessionRecording: !rec
          });
        }
      });
    }, []);
    return <div style={{
      background: "#0a0a0f",
      minHeight: "200px",
      padding: "20px"
    }}>
        <div style={{
        position: "relative",
        width: "100%",
        height: "100px"
      }}>
          <GlobalActionBar />
        </div>
      </div>;
  }
}`,...i.parameters?.docs?.source}}};const M=["PlanningSession","RecordingSession"];export{o as PlanningSession,i as RecordingSession,M as __namedExportsOrder,E as default};
