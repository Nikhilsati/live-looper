import{j as r}from"./jsx-runtime-u17CrQMm.js";import{r as o}from"./iframe-BXJpxzHH.js";import{a as t}from"./TrackControls-DpoNw5L1.js";import{u as s,F as e}from"./useLooperStore-BfSgrONV.js";import"./preload-helper-PPVm8Dsz.js";import"./PowerIcon-MhrZRzOh.js";import"./useSessionStore-DGrFwR9j.js";import"./index-BhM3fhe2.js";import"./useDialogStore-7q7Veijn.js";import"./index-D3pbEsCm.js";import"./TrackFX-D44tMDTn.js";import"./index-BlgGgipN.js";import"./index-CRrYHsHn.js";import"./UploadSimple.es-BcU1hz6L.js";import"./IconBase.es-c7dv95h9.js";import"./FloppyDisk.es-DfosdXF7.js";import"./Sliders.es-DEHWsp6N.js";import"./Trash.es-BgCRKvX9.js";import"./X.es-OFt9uGlE.js";import"./LatencyMonitor-BjHyaxLm.js";import"./ArrowsClockwise.es-CYsyLPi2.js";import"./Lightning.es-DvM1n1hL.js";import"./InputChannelSelector-CLxjJIGQ.js";import"./SettingsPopover-CkLm44tE.js";const E={title:"Web/TrackControls",component:t,tags:["ai-generated"]},a=[{isMuted:!1,isSoloed:!1,isRecording:!0,isArmed:!1,hasAudio:!1,layerCount:0,waveformData:[],fx:new e().build()},{isMuted:!1,isSoloed:!1,isRecording:!1,isArmed:!0,hasAudio:!1,layerCount:0,waveformData:[],fx:new e().build()},{isMuted:!1,isSoloed:!1,isRecording:!1,isArmed:!1,hasAudio:!0,layerCount:3,waveformData:[.1,.3,.6,.9,.7,.4,.5,.8,.3,.2,.4,.7],fx:new e().build()},{isMuted:!0,isSoloed:!1,isRecording:!1,isArmed:!1,hasAudio:!0,layerCount:1,waveformData:[.2,.4,.3,.2,.4,.5,.3],fx:new e().build()}],n={render:()=>(o.useEffect(()=>{s.setState({mode:"planning",isPlaying:!0,bpm:120,currentBar:2,currentBeat:3,sectionProgress:.45,currentSectionIndex:0,queuedSectionIndex:null,sections:[{id:"s1",name:"Main Chorus",lengthInBars:4,order:0,trackStates:[]}],tracks:a,liveTrack:{isMuted:!1,fx:new e().build()},inputLevels:[.1,.05,.8,0],channelMapping:[null,null,null,null],trackChannelConfig:{0:{mode:"stereo"},1:{mode:"stereo"},2:{mode:"stereo"},3:{mode:"stereo"}}})},[]),r.jsx("div",{style:{width:"100%",maxWidth:"1200px",padding:"12px"},children:r.jsx(t,{})}))};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        mode: "planning",
        isPlaying: true,
        bpm: 120,
        currentBar: 2,
        currentBeat: 3,
        sectionProgress: 0.45,
        currentSectionIndex: 0,
        queuedSectionIndex: null,
        sections: [{
          id: "s1",
          name: "Main Chorus",
          lengthInBars: 4,
          order: 0,
          trackStates: []
        }],
        tracks: mockTracks as any,
        liveTrack: {
          isMuted: false,
          fx: new FXBuilder().build()
        },
        inputLevels: [0.1, 0.05, 0.8, 0],
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
        }
      });
    }, []);
    return <div style={{
      width: "100%",
      maxWidth: "1200px",
      padding: "12px"
    }}>
        <TrackControls />
      </div>;
  }
}`,...n.parameters?.docs?.source}}};const F=["FullPanelShowcase"];export{n as FullPanelShowcase,F as __namedExportsOrder,E as default};
