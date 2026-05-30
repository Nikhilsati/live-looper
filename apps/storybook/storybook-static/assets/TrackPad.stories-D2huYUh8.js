import{j as r}from"./jsx-runtime-u17CrQMm.js";import{r as t}from"./iframe-BXJpxzHH.js";import{b as o,c as l}from"./TrackControls-DpoNw5L1.js";import{u as i,F as d}from"./useLooperStore-BfSgrONV.js";import"./preload-helper-PPVm8Dsz.js";import"./PowerIcon-MhrZRzOh.js";import"./useSessionStore-DGrFwR9j.js";import"./index-BhM3fhe2.js";import"./useDialogStore-7q7Veijn.js";import"./index-D3pbEsCm.js";import"./TrackFX-D44tMDTn.js";import"./index-BlgGgipN.js";import"./index-CRrYHsHn.js";import"./UploadSimple.es-BcU1hz6L.js";import"./IconBase.es-c7dv95h9.js";import"./FloppyDisk.es-DfosdXF7.js";import"./Sliders.es-DEHWsp6N.js";import"./Trash.es-BgCRKvX9.js";import"./X.es-OFt9uGlE.js";import"./LatencyMonitor-BjHyaxLm.js";import"./ArrowsClockwise.es-CYsyLPi2.js";import"./Lightning.es-DvM1n1hL.js";import"./InputChannelSelector-CLxjJIGQ.js";import"./SettingsPopover-CkLm44tE.js";const M={title:"Web/TrackPad",component:o,tags:["ai-generated"]},n={args:{trackId:0,onOpenFX:e=>console.log("Open FX for track",e)},render:e=>(t.useEffect(()=>{i.setState({mode:"planning",isPlaying:!0,tracks:[{isMuted:!1,isSoloed:!1,isRecording:!1,isArmed:!1,hasAudio:!0,layerCount:2,waveformData:[.1,.4,.8,.5,.3,.6,.7],fx:new d().build()}]})},[]),r.jsx("div",{style:{maxWidth:"280px"},children:r.jsx(o,{...e})}))},a={args:{trackId:0,onOpenFX:e=>console.log("Open FX for track",e)},render:e=>(t.useEffect(()=>{i.setState({mode:"planning",isPlaying:!0,tracks:[{isMuted:!1,isSoloed:!1,isRecording:!1,isArmed:!0,hasAudio:!1,layerCount:0,waveformData:[],fx:new d().build()}]})},[]),r.jsx("div",{style:{maxWidth:"280px"},children:r.jsx(o,{...e})}))},s={render:()=>(t.useEffect(()=>{i.setState({mode:"live",isPlaying:!0,liveTrack:{isMuted:!1,fx:new d().build()}})},[]),r.jsx("div",{style:{maxWidth:"280px"},children:r.jsx(l,{onOpenFX:e=>console.log("Open Live FX",e)})}))};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    trackId: 0,
    onOpenFX: id => console.log("Open FX for track", id)
  },
  render: args => {
    useEffect(() => {
      useLooperStore.setState({
        mode: "planning",
        isPlaying: true,
        tracks: [{
          isMuted: false,
          isSoloed: false,
          isRecording: false,
          isArmed: false,
          hasAudio: true,
          layerCount: 2,
          waveformData: [0.1, 0.4, 0.8, 0.5, 0.3, 0.6, 0.7],
          fx: new FXBuilder().build()
        }] as any
      });
    }, []);
    return <div style={{
      maxWidth: "280px"
    }}>
        <TrackPad {...args} />
      </div>;
  }
}`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    trackId: 0,
    onOpenFX: id => console.log("Open FX for track", id)
  },
  render: args => {
    useEffect(() => {
      useLooperStore.setState({
        mode: "planning",
        isPlaying: true,
        tracks: [{
          isMuted: false,
          isSoloed: false,
          isRecording: false,
          isArmed: true,
          hasAudio: false,
          layerCount: 0,
          waveformData: [],
          fx: new FXBuilder().build()
        }] as any
      });
    }, []);
    return <div style={{
      maxWidth: "280px"
    }}>
        <TrackPad {...args} />
      </div>;
  }
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        mode: "live",
        isPlaying: true,
        liveTrack: {
          isMuted: false,
          fx: new FXBuilder().build()
        }
      });
    }, []);
    return <div style={{
      maxWidth: "280px"
    }}>
        <LiveTrackPad onOpenFX={id => console.log("Open Live FX", id)} />
      </div>;
  }
}`,...s.parameters?.docs?.source}}};const R=["PlayingTrack","ArmedTrack","LiveTrack"];export{a as ArmedTrack,s as LiveTrack,n as PlayingTrack,R as __namedExportsOrder,M as default};
