import{j as r}from"./jsx-runtime-u17CrQMm.js";import{r as o}from"./iframe-Bz5zlmtB.js";import{b as i,c}from"./TrackControls-6rc5kCT_.js";import{u as d,F as l}from"./useLooperStore-tB-Eqf-j.js";import"./preload-helper-PPVm8Dsz.js";import"./PowerIcon-MhrZRzOh.js";import"./index-gqHS7t1m.js";import"./TrackFX-DWhP02q8.js";import"./index-BXqYSj3i.js";import"./index-BkB19OZz.js";import"./UploadSimple.es-QT3uJlvy.js";import"./IconBase.es-BaY8-AWE.js";import"./FloppyDisk.es-CIWUAUiu.js";import"./Sliders.es-BfvF4Fu1.js";import"./Trash.es-GkaNqD0k.js";import"./X.es-DMEZIJzP.js";import"./LatencyMonitor-DzOqAXWL.js";import"./ArrowsClockwise.es-C_n7ETa_.js";import"./Lightning.es-B1hOFdRv.js";import"./InputChannelSelector-bIWJ7e8G.js";import"./SettingsPopover-DPYdkQx4.js";import"./useDialogStore-DfmhEa3P.js";const R={title:"Web/TrackPad",component:i,tags:["ai-generated"]},n={args:{trackId:0,onOpenFX:e=>console.log("Open FX for track",e)},render:e=>(o.useEffect(()=>{d.setState({mode:"planning",isPlaying:!0,tracks:[{isMuted:!1,isSoloed:!1,isRecording:!1,isArmed:!1,hasAudio:!0,layerCount:2,waveformData:[.1,.4,.8,.5,.3,.6,.7],fx:new l().build()}]})},[]),r.jsx("div",{style:{maxWidth:"280px"},children:r.jsx(i,{...e})}))},a={args:{trackId:0,onOpenFX:e=>console.log("Open FX for track",e)},render:e=>(o.useEffect(()=>{d.setState({mode:"planning",isPlaying:!0,tracks:[{isMuted:!1,isSoloed:!1,isRecording:!1,isArmed:!0,hasAudio:!1,layerCount:0,waveformData:[],fx:new l().build()}]})},[]),r.jsx("div",{style:{maxWidth:"280px"},children:r.jsx(i,{...e})}))},s={args:{trackId:0,onOpenFX:e=>console.log("Open FX for track",e)},render:e=>(o.useEffect(()=>{d.setState({mode:"planning",isPlaying:!0,tracks:[{isMuted:!1,isSoloed:!1,isRecording:!0,isArmed:!1,hasAudio:!1,layerCount:0,waveformData:[],fx:new l().build()}]})},[]),r.jsx("div",{style:{maxWidth:"280px"},children:r.jsx(i,{...e})}))},t={render:()=>(o.useEffect(()=>{d.setState({mode:"live",isPlaying:!0,liveTrack:{isMuted:!1,fx:new l().build()}})},[]),r.jsx("div",{style:{maxWidth:"280px"},children:r.jsx(c,{onOpenFX:e=>console.log("Open Live FX",e)})}))};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
          isRecording: true,
          isArmed: false,
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
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
}`,...t.parameters?.docs?.source}}};const W=["PlayingTrack","ArmedTrack","RecordingTrack","LiveTrack"];export{a as ArmedTrack,t as LiveTrack,n as PlayingTrack,s as RecordingTrack,W as __namedExportsOrder,R as default};
