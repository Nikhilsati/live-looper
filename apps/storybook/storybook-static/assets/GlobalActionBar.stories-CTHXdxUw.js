import{j as t}from"./jsx-runtime-u17CrQMm.js";import{r as a}from"./iframe-DKAZBu9M.js";import{G as r}from"./TrackControls-BcNB4LaY.js";import{u as n,F as l,a as s}from"./useLooperStore-Dvf83KgO.js";import"./preload-helper-PPVm8Dsz.js";import"./PowerIcon-CYQyr_4Q.js";import"./useDialogStore-B5Zmn5Ro.js";import"./index-i1lnfb4e.js";import"./TrackFX-CmMJpG6m.js";import"./index-DQ3nCJ_J.js";import"./index-Cy9nehyp.js";import"./UploadSimple.es-Da3YaHm1.js";import"./IconBase.es-D5nQXiR-.js";import"./FloppyDisk.es-BbvJ0HUu.js";import"./Sliders.es-DW-XCzPB.js";import"./Trash.es-Ci1ayznQ.js";import"./X.es-Cy8g2o_c.js";import"./LatencyMonitor-C8lkw3Y4.js";import"./ArrowsClockwise.es-B6pRRL7X.js";import"./ChannelLevels-DDK9l_vr.js";import"./trackColors-bnaEkYfa.js";import"./LiveTrackPad-XborbJm_.js";import"./LayersDrawer-B5RQVkkY.js";import"./InputChannelSelector-D95SL9eA.js";import"./ProgressRing--0IlTq6Y.js";import"./SettingsPopover-CebdGFoA.js";const G={title:"Web/GlobalActionBar",component:r,tags:["ai-generated"]},o={render:()=>(a.useEffect(()=>{n.setState({isPlaying:!1,mode:"planning",bpm:120,currentSectionIndex:0,queuedSectionIndex:null,sections:[{id:"s1",name:"Main Chorus",lengthInBars:4,order:0,trackStates:[]}],showLayers:!1,showDevInspector:!1,setShowLayers:e=>n.setState({showLayers:e}),setShowDevInspector:e=>n.setState({showDevInspector:e}),setBpm:e=>n.setState({bpm:e}),availableInputs:[],availableOutputs:[],inputDeviceId:null,outputDeviceId:null,refreshDevices:async()=>{},smartSnapEnabled:!0,dualOutputMode:!1,liveTrack:{isMuted:!1,fx:new l().build()}}),s.setState({isSessionArmed:!1,isSessionRecording:!1,recordingDuration:0,togglePlayback:async()=>{const e=n.getState().isPlaying;n.setState({isPlaying:!e})},setIsSessionArmed:e=>s.setState({isSessionArmed:e}),toggleRecording:async()=>{const e=s.getState().isSessionRecording;s.setState({isSessionRecording:!e})}})},[]),t.jsx("div",{style:{background:"#0a0a0f",minHeight:"200px",padding:"20px"},children:t.jsx("div",{style:{position:"relative",width:"100%",height:"100px"},children:t.jsx(r,{})})}))},i={render:()=>(a.useEffect(()=>{n.setState({isPlaying:!0,mode:"practice",bpm:100,currentSectionIndex:0,queuedSectionIndex:null,sections:[{id:"s1",name:"Chorus Peak",lengthInBars:8,order:0,trackStates:[]}],showLayers:!1,showDevInspector:!1,setShowLayers:e=>n.setState({showLayers:e}),setShowDevInspector:e=>n.setState({showDevInspector:e}),setBpm:e=>n.setState({bpm:e}),availableInputs:[],availableOutputs:[],inputDeviceId:null,outputDeviceId:null,refreshDevices:async()=>{},smartSnapEnabled:!0,dualOutputMode:!1,liveTrack:{isMuted:!1,fx:new l().build()}}),s.setState({isSessionArmed:!1,isSessionRecording:!0,recordingDuration:24500,togglePlayback:async()=>{const e=n.getState().isPlaying;n.setState({isPlaying:!e})},setIsSessionArmed:e=>s.setState({isSessionArmed:e}),toggleRecording:async()=>{const e=s.getState().isSessionRecording;s.setState({isSessionRecording:!e})}})},[]),t.jsx("div",{style:{background:"#0a0a0f",minHeight:"200px",padding:"20px"},children:t.jsx("div",{style:{position:"relative",width:"100%",height:"100px"},children:t.jsx(r,{})})}))};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const q=["PlanningSession","RecordingSession"];export{o as PlanningSession,i as RecordingSession,q as __namedExportsOrder,G as default};
