import{j as r}from"./jsx-runtime-u17CrQMm.js";import{r as o}from"./iframe-CuidZOye.js";import{T as t}from"./TrackControls-DC1R9a87.js";import{u as s,F as e}from"./useLooperStore-Dc0igdZd.js";import"./preload-helper-PPVm8Dsz.js";import"./PowerIcon-CYQyr_4Q.js";import"./useDialogStore-BNH4vANE.js";import"./index-CzRv-HbD.js";import"./TrackFX-CQ1xHeN_.js";import"./index-DzZSXzUf.js";import"./index-DWDgtYsA.js";import"./UploadSimple.es-Cg0UNue0.js";import"./IconBase.es-CuMwx6Nm.js";import"./FloppyDisk.es-CZW2tNN9.js";import"./Sliders.es-CgspF6qQ.js";import"./Trash.es-DJ39ZCtF.js";import"./X.es-DbGaH5J7.js";import"./LatencyMonitor-ClHM5nP6.js";import"./ArrowsClockwise.es-naLBFEc2.js";import"./Lightning.es-FXVKR3hU.js";import"./ChannelLevels-B63WAP8R.js";import"./trackColors-bnaEkYfa.js";import"./LiveTrackPad-CbLFbTOf.js";import"./LayersDrawer-CauBJv8Z.js";import"./InputChannelSelector-BKTt-kq8.js";import"./ProgressRing-CRNbpCni.js";import"./SettingsPopover-BVwU5iE6.js";const j={title:"Web/TrackControls",component:t,tags:["ai-generated"]},a=[{isMuted:!1,isSoloed:!1,isRecording:!0,isArmed:!1,hasAudio:!1,layerCount:0,waveformData:[],fx:new e().build()},{isMuted:!1,isSoloed:!1,isRecording:!1,isArmed:!0,hasAudio:!1,layerCount:0,waveformData:[],fx:new e().build()},{isMuted:!1,isSoloed:!1,isRecording:!1,isArmed:!1,hasAudio:!0,layerCount:3,waveformData:[.1,.3,.6,.9,.7,.4,.5,.8,.3,.2,.4,.7],fx:new e().build()},{isMuted:!0,isSoloed:!1,isRecording:!1,isArmed:!1,hasAudio:!0,layerCount:1,waveformData:[.2,.4,.3,.2,.4,.5,.3],fx:new e().build()}],n={render:()=>(o.useEffect(()=>{s.setState({mode:"planning",isPlaying:!0,bpm:120,currentBar:2,currentBeat:3,sectionProgress:.45,currentSectionIndex:0,queuedSectionIndex:null,sections:[{id:"s1",name:"Main Chorus",lengthInBars:4,order:0,trackStates:[]}],tracks:a,liveTrack:{isMuted:!1,fx:new e().build()},inputLevels:[.1,.05,.8,0],channelMapping:[null,null,null,null],trackChannelConfig:{0:{mode:"stereo"},1:{mode:"stereo"},2:{mode:"stereo"},3:{mode:"stereo"}}})},[]),r.jsx("div",{style:{width:"100%",maxWidth:"1200px",padding:"12px"},children:r.jsx(t,{})}))};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...n.parameters?.docs?.source}}};const D=["FullPanelShowcase"];export{n as FullPanelShowcase,D as __namedExportsOrder,j as default};
