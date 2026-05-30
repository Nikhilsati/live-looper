import{j as r}from"./jsx-runtime-u17CrQMm.js";import{r as o}from"./iframe-3i2WR5Xa.js";import{a as t}from"./TrackControls-CHLowz8S.js";import{u as s,F as e}from"./useLooperStore-D8NVNae3.js";import"./preload-helper-PPVm8Dsz.js";import"./PowerIcon-MhrZRzOh.js";import"./index-CAi--mKy.js";import"./TrackFX-xYd0F-eP.js";import"./index-B5R4sxe6.js";import"./index-BOgzelvg.js";import"./UploadSimple.es-BVBZzRYz.js";import"./IconBase.es-BPfYamxb.js";import"./FloppyDisk.es-C-BEqMvD.js";import"./Sliders.es-DiNjM7eB.js";import"./Trash.es-NkZ_2-SY.js";import"./X.es-DKF1rw0x.js";import"./LatencyMonitor-jcsEBinV.js";import"./ArrowsClockwise.es-DBPdaSFq.js";import"./Lightning.es-DU56mEC3.js";import"./InputChannelSelector-CPB52Oky.js";import"./SettingsPopover-B4dohh2J.js";import"./useDialogStore-ChE-5abl.js";const I={title:"Web/TrackControls",component:t,tags:["ai-generated"]},a=[{isMuted:!1,isSoloed:!1,isRecording:!0,isArmed:!1,hasAudio:!1,layerCount:0,waveformData:[],fx:new e().build()},{isMuted:!1,isSoloed:!1,isRecording:!1,isArmed:!0,hasAudio:!1,layerCount:0,waveformData:[],fx:new e().build()},{isMuted:!1,isSoloed:!1,isRecording:!1,isArmed:!1,hasAudio:!0,layerCount:3,waveformData:[.1,.3,.6,.9,.7,.4,.5,.8,.3,.2,.4,.7],fx:new e().build()},{isMuted:!0,isSoloed:!1,isRecording:!1,isArmed:!1,hasAudio:!0,layerCount:1,waveformData:[.2,.4,.3,.2,.4,.5,.3],fx:new e().build()}],n={render:()=>(o.useEffect(()=>{s.setState({mode:"planning",isPlaying:!0,bpm:120,currentBar:2,currentBeat:3,sectionProgress:.45,currentSectionIndex:0,queuedSectionIndex:null,sections:[{id:"s1",name:"Main Chorus",lengthInBars:4,order:0,trackStates:[]}],tracks:a,liveTrack:{isMuted:!1,fx:new e().build()},inputLevels:[.1,.05,.8,0],channelMapping:[null,null,null,null],trackChannelConfig:{0:{mode:"stereo"},1:{mode:"stereo"},2:{mode:"stereo"},3:{mode:"stereo"}}})},[]),r.jsx("div",{style:{width:"100%",maxWidth:"1200px",padding:"12px"},children:r.jsx(t,{})}))};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
