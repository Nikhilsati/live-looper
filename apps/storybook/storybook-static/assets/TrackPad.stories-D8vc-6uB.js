import{j as n}from"./jsx-runtime-u17CrQMm.js";import{r as o}from"./iframe-DKAZBu9M.js";import{T as i,L as c}from"./LiveTrackPad-XborbJm_.js";import{u as d,F as l}from"./useLooperStore-Dvf83KgO.js";import"./preload-helper-PPVm8Dsz.js";import"./PowerIcon-CYQyr_4Q.js";import"./useDialogStore-B5Zmn5Ro.js";import"./index-i1lnfb4e.js";import"./trackColors-bnaEkYfa.js";import"./LayersDrawer-B5RQVkkY.js";import"./InputChannelSelector-D95SL9eA.js";import"./index-DQ3nCJ_J.js";import"./index-Cy9nehyp.js";import"./IconBase.es-D5nQXiR-.js";const O={title:"Web/TrackPad",component:i,tags:["ai-generated"]},r={args:{trackId:0,onOpenFX:e=>console.log("Open FX for track",e)},render:e=>(o.useEffect(()=>{d.setState({mode:"planning",isPlaying:!0,tracks:[{isMuted:!1,isSoloed:!1,isRecording:!1,isArmed:!1,hasAudio:!0,layerCount:2,waveformData:[.1,.4,.8,.5,.3,.6,.7],fx:new l().build()}]})},[]),n.jsx("div",{style:{maxWidth:"280px"},children:n.jsx(i,{...e})}))},a={args:{trackId:0,onOpenFX:e=>console.log("Open FX for track",e)},render:e=>(o.useEffect(()=>{d.setState({mode:"planning",isPlaying:!0,tracks:[{isMuted:!1,isSoloed:!1,isRecording:!1,isArmed:!0,hasAudio:!1,layerCount:0,waveformData:[],fx:new l().build()}]})},[]),n.jsx("div",{style:{maxWidth:"280px"},children:n.jsx(i,{...e})}))},s={args:{trackId:0,onOpenFX:e=>console.log("Open FX for track",e)},render:e=>(o.useEffect(()=>{d.setState({mode:"planning",isPlaying:!0,tracks:[{isMuted:!1,isSoloed:!1,isRecording:!0,isArmed:!1,hasAudio:!1,layerCount:0,waveformData:[],fx:new l().build()}]})},[]),n.jsx("div",{style:{maxWidth:"280px"},children:n.jsx(i,{...e})}))},t={render:()=>(o.useEffect(()=>{d.setState({mode:"live",isPlaying:!0,liveTrack:{isMuted:!1,fx:new l().build()}})},[]),n.jsx("div",{style:{maxWidth:"280px"},children:n.jsx(c,{onOpenFX:e=>console.log("Open Live FX",e)})}))};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
}`,...r.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
}`,...t.parameters?.docs?.source}}};const P=["PlayingTrack","ArmedTrack","RecordingTrack","LiveTrack"];export{a as ArmedTrack,t as LiveTrack,r as PlayingTrack,s as RecordingTrack,P as __namedExportsOrder,O as default};
