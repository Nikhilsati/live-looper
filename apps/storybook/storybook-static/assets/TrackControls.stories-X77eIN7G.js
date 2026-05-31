import{j as r}from"./jsx-runtime-u17CrQMm.js";import{r as o}from"./iframe-DKAZBu9M.js";import{T as t}from"./TrackControls-BcNB4LaY.js";import{u as s,F as e}from"./useLooperStore-Dvf83KgO.js";import"./preload-helper-PPVm8Dsz.js";import"./PowerIcon-CYQyr_4Q.js";import"./useDialogStore-B5Zmn5Ro.js";import"./index-i1lnfb4e.js";import"./TrackFX-CmMJpG6m.js";import"./index-DQ3nCJ_J.js";import"./index-Cy9nehyp.js";import"./UploadSimple.es-Da3YaHm1.js";import"./IconBase.es-D5nQXiR-.js";import"./FloppyDisk.es-BbvJ0HUu.js";import"./Sliders.es-DW-XCzPB.js";import"./Trash.es-Ci1ayznQ.js";import"./X.es-Cy8g2o_c.js";import"./LatencyMonitor-C8lkw3Y4.js";import"./ArrowsClockwise.es-B6pRRL7X.js";import"./ChannelLevels-DDK9l_vr.js";import"./trackColors-bnaEkYfa.js";import"./LiveTrackPad-XborbJm_.js";import"./LayersDrawer-B5RQVkkY.js";import"./InputChannelSelector-D95SL9eA.js";import"./ProgressRing--0IlTq6Y.js";import"./SettingsPopover-CebdGFoA.js";const R={title:"Web/TrackControls",component:t,tags:["ai-generated"]},a=[{isMuted:!1,isSoloed:!1,isRecording:!0,isArmed:!1,hasAudio:!1,layerCount:0,waveformData:[],fx:new e().build()},{isMuted:!1,isSoloed:!1,isRecording:!1,isArmed:!0,hasAudio:!1,layerCount:0,waveformData:[],fx:new e().build()},{isMuted:!1,isSoloed:!1,isRecording:!1,isArmed:!1,hasAudio:!0,layerCount:3,waveformData:[.1,.3,.6,.9,.7,.4,.5,.8,.3,.2,.4,.7],fx:new e().build()},{isMuted:!0,isSoloed:!1,isRecording:!1,isArmed:!1,hasAudio:!0,layerCount:1,waveformData:[.2,.4,.3,.2,.4,.5,.3],fx:new e().build()}],n={render:()=>(o.useEffect(()=>{s.setState({mode:"planning",isPlaying:!0,bpm:120,currentBar:2,currentBeat:3,sectionProgress:.45,currentSectionIndex:0,queuedSectionIndex:null,sections:[{id:"s1",name:"Main Chorus",lengthInBars:4,order:0,trackStates:[]}],tracks:a,liveTrack:{isMuted:!1,fx:new e().build()},inputLevels:[.1,.05,.8,0],channelMapping:[null,null,null,null],trackChannelConfig:{0:{mode:"stereo"},1:{mode:"stereo"},2:{mode:"stereo"},3:{mode:"stereo"}}})},[]),r.jsx("div",{style:{width:"100%",maxWidth:"1200px",padding:"12px"},children:r.jsx(t,{})}))};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...n.parameters?.docs?.source}}};const j=["FullPanelShowcase"];export{n as FullPanelShowcase,j as __namedExportsOrder,R as default};
