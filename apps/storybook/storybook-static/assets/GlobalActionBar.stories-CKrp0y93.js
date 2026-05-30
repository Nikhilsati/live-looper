import{j as t}from"./jsx-runtime-u17CrQMm.js";import{r as a}from"./iframe-Bz5zlmtB.js";import{G as r}from"./TrackControls-6rc5kCT_.js";import{u as n,F as l,a as s}from"./useLooperStore-tB-Eqf-j.js";import"./preload-helper-PPVm8Dsz.js";import"./PowerIcon-MhrZRzOh.js";import"./index-gqHS7t1m.js";import"./TrackFX-DWhP02q8.js";import"./index-BXqYSj3i.js";import"./index-BkB19OZz.js";import"./UploadSimple.es-QT3uJlvy.js";import"./IconBase.es-BaY8-AWE.js";import"./FloppyDisk.es-CIWUAUiu.js";import"./Sliders.es-BfvF4Fu1.js";import"./Trash.es-GkaNqD0k.js";import"./X.es-DMEZIJzP.js";import"./LatencyMonitor-DzOqAXWL.js";import"./ArrowsClockwise.es-C_n7ETa_.js";import"./Lightning.es-B1hOFdRv.js";import"./InputChannelSelector-bIWJ7e8G.js";import"./SettingsPopover-DPYdkQx4.js";import"./useDialogStore-DfmhEa3P.js";const E={title:"Web/GlobalActionBar",component:r,tags:["ai-generated"]},o={render:()=>(a.useEffect(()=>{n.setState({isPlaying:!1,mode:"planning",bpm:120,currentSectionIndex:0,queuedSectionIndex:null,sections:[{id:"s1",name:"Main Chorus",lengthInBars:4,order:0,trackStates:[]}],showLayers:!1,showDevInspector:!1,setShowLayers:e=>n.setState({showLayers:e}),setShowDevInspector:e=>n.setState({showDevInspector:e}),setBpm:e=>n.setState({bpm:e}),availableInputs:[],availableOutputs:[],inputDeviceId:null,outputDeviceId:null,refreshDevices:async()=>{},smartSnapEnabled:!0,dualOutputMode:!1,liveTrack:{isMuted:!1,fx:new l().build()}}),s.setState({isSessionArmed:!1,isSessionRecording:!1,recordingDuration:0,togglePlayback:async()=>{const e=n.getState().isPlaying;n.setState({isPlaying:!e})},setIsSessionArmed:e=>s.setState({isSessionArmed:e}),toggleRecording:async()=>{const e=s.getState().isSessionRecording;s.setState({isSessionRecording:!e})}})},[]),t.jsx("div",{style:{background:"#0a0a0f",minHeight:"200px",padding:"20px"},children:t.jsx("div",{style:{position:"relative",width:"100%",height:"100px"},children:t.jsx(r,{})})}))},i={render:()=>(a.useEffect(()=>{n.setState({isPlaying:!0,mode:"practice",bpm:100,currentSectionIndex:0,queuedSectionIndex:null,sections:[{id:"s1",name:"Chorus Peak",lengthInBars:8,order:0,trackStates:[]}],showLayers:!1,showDevInspector:!1,setShowLayers:e=>n.setState({showLayers:e}),setShowDevInspector:e=>n.setState({showDevInspector:e}),setBpm:e=>n.setState({bpm:e}),availableInputs:[],availableOutputs:[],inputDeviceId:null,outputDeviceId:null,refreshDevices:async()=>{},smartSnapEnabled:!0,dualOutputMode:!1,liveTrack:{isMuted:!1,fx:new l().build()}}),s.setState({isSessionArmed:!1,isSessionRecording:!0,recordingDuration:24500,togglePlayback:async()=>{const e=n.getState().isPlaying;n.setState({isPlaying:!e})},setIsSessionArmed:e=>s.setState({isSessionArmed:e}),toggleRecording:async()=>{const e=s.getState().isSessionRecording;s.setState({isSessionRecording:!e})}})},[]),t.jsx("div",{style:{background:"#0a0a0f",minHeight:"200px",padding:"20px"},children:t.jsx("div",{style:{position:"relative",width:"100%",height:"100px"},children:t.jsx(r,{})})}))};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
