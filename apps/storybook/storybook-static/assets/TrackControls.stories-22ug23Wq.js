import{j as r}from"./jsx-runtime-u17CrQMm.js";import{r as o}from"./iframe-CoXEDRzF.js";import{a as t}from"./TrackControls-D82avz0U.js";import{u as s,F as e}from"./useLooperStore-Bybne01-.js";import"./preload-helper-PPVm8Dsz.js";import"./PowerIcon-MhrZRzOh.js";import"./index-7QDTVwY0.js";import"./TrackFX-e6p_QtSa.js";import"./index-CgSukmKq.js";import"./index-CyrqA3Ya.js";import"./UploadSimple.es-y1Pk1ARz.js";import"./IconBase.es-DSIt0WZZ.js";import"./FloppyDisk.es-DXhyPX4k.js";import"./Sliders.es-xBAbiGhp.js";import"./Trash.es-C-uUh0KV.js";import"./X.es-7u80lDDN.js";import"./LatencyMonitor-Kt043hsF.js";import"./ArrowsClockwise.es-BmMsv_xV.js";import"./Lightning.es-Dx41jP9m.js";import"./InputChannelSelector-CLkRBLhl.js";import"./SettingsPopover-B53-rj5t.js";import"./useDialogStore-ElppLasU.js";const I={title:"Web/TrackControls",component:t,tags:["ai-generated"]},a=[{isMuted:!1,isSoloed:!1,isRecording:!0,isArmed:!1,hasAudio:!1,layerCount:0,waveformData:[],fx:new e().build()},{isMuted:!1,isSoloed:!1,isRecording:!1,isArmed:!0,hasAudio:!1,layerCount:0,waveformData:[],fx:new e().build()},{isMuted:!1,isSoloed:!1,isRecording:!1,isArmed:!1,hasAudio:!0,layerCount:3,waveformData:[.1,.3,.6,.9,.7,.4,.5,.8,.3,.2,.4,.7],fx:new e().build()},{isMuted:!0,isSoloed:!1,isRecording:!1,isArmed:!1,hasAudio:!0,layerCount:1,waveformData:[.2,.4,.3,.2,.4,.5,.3],fx:new e().build()}],n={render:()=>(o.useEffect(()=>{s.setState({mode:"planning",isPlaying:!0,bpm:120,currentBar:2,currentBeat:3,sectionProgress:.45,currentSectionIndex:0,queuedSectionIndex:null,sections:[{id:"s1",name:"Main Chorus",lengthInBars:4,order:0,trackStates:[]}],tracks:a,liveTrack:{isMuted:!1,fx:new e().build()},inputLevels:[.1,.05,.8,0],channelMapping:[null,null,null,null],trackChannelConfig:{0:{mode:"stereo"},1:{mode:"stereo"},2:{mode:"stereo"},3:{mode:"stereo"}}})},[]),r.jsx("div",{style:{width:"100%",maxWidth:"1200px",padding:"12px"},children:r.jsx(t,{})}))};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...n.parameters?.docs?.source}}};const P=["FullPanelShowcase"];export{n as FullPanelShowcase,P as __namedExportsOrder,I as default};
