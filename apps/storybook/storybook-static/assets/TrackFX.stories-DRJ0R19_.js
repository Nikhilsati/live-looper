import{j as s}from"./jsx-runtime-u17CrQMm.js";import{r as i}from"./iframe-CuidZOye.js";import{T as d}from"./TrackFX-CQ1xHeN_.js";import{u as e}from"./useLooperStore-Dc0igdZd.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DzZSXzUf.js";import"./index-DWDgtYsA.js";import"./index-CzRv-HbD.js";import"./UploadSimple.es-Cg0UNue0.js";import"./IconBase.es-CuMwx6Nm.js";import"./FloppyDisk.es-CZW2tNN9.js";import"./Sliders.es-CgspF6qQ.js";import"./Trash.es-DJ39ZCtF.js";import"./X.es-DbGaH5J7.js";import"./PowerIcon-CYQyr_4Q.js";import"./useDialogStore-BNH4vANE.js";const E={title:"Web/TrackFX",component:d,tags:["ai-generated"]},l={noiseGate:{enabled:!1,threshold:-45,attack:.01,release:.1},eq:{low:1.5,mid:-2,high:3.5},compressor:{threshold:-18,ratio:3.5,gain:3},drive:{enabled:!0,amount:.4,tone:.6},chorus:{enabled:!0,rate:1.2,depth:.5,mix:.4,voices:2},phaser:{enabled:!1,rate:.5,depth:.5,stages:4},tremolo:{enabled:!1,rate:5,depth:.7},delay:{enabled:!0,time:.35,feedback:.3,mix:.25,mode:"pingpong",filter:.8},reverb:{enabled:!0,mix:.3,size:2.5,predelay:15,damping:.5},pan:15},t={args:{trackId:0,onClose:()=>console.log("Close pedalboard")},render:o=>(i.useEffect(()=>{e.setState({tracks:[{fx:l,isMuted:!1,isSoloed:!1,isRecording:!1,isArmed:!1,hasAudio:!0,layerCount:1,waveformData:[]}],setTrackFX:(r,c)=>{const a=[...e.getState().tracks];a[r]={...a[r],fx:{...a[r].fx,...c}},e.setState({tracks:a})}})},[]),s.jsx("div",{style:{padding:"16px",background:"#0a0a0f"},children:s.jsx(d,{...o})}))},n={args:{trackId:"live",onClose:()=>console.log("Close live pedalboard")},render:o=>(i.useEffect(()=>{e.setState({liveTrack:{fx:l,isMuted:!1},setLiveTrackState:r=>{const c=e.getState().liveTrack;e.setState({liveTrack:{...c,...r}})}})},[]),s.jsx("div",{style:{padding:"16px",background:"#0a0a0f"},children:s.jsx(d,{...o})}))};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    trackId: 0,
    onClose: () => console.log("Close pedalboard")
  },
  render: args => {
    useEffect(() => {
      useLooperStore.setState({
        tracks: [{
          fx: mockFx as any,
          isMuted: false,
          isSoloed: false,
          isRecording: false,
          isArmed: false,
          hasAudio: true,
          layerCount: 1,
          waveformData: []
        }],
        setTrackFX: (trackId, fxState) => {
          const currentTracks = [...useLooperStore.getState().tracks];
          currentTracks[trackId] = {
            ...currentTracks[trackId],
            fx: {
              ...currentTracks[trackId].fx,
              ...fxState
            }
          };
          useLooperStore.setState({
            tracks: currentTracks
          });
        }
      });
    }, []);
    return <div style={{
      padding: "16px",
      background: "#0a0a0f"
    }}>
        <TrackFX {...args} />
      </div>;
  }
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    trackId: "live",
    onClose: () => console.log("Close live pedalboard")
  },
  render: args => {
    useEffect(() => {
      useLooperStore.setState({
        liveTrack: {
          fx: mockFx as any,
          isMuted: false
        },
        setLiveTrackState: state => {
          const currentLiveTrack = useLooperStore.getState().liveTrack;
          useLooperStore.setState({
            liveTrack: {
              ...currentLiveTrack,
              ...state
            }
          });
        }
      });
    }, []);
    return <div style={{
      padding: "16px",
      background: "#0a0a0f"
    }}>
        <TrackFX {...args} />
      </div>;
  }
}`,...n.parameters?.docs?.source}}};const j=["TrackPedalboard","LiveTrackPedalboard"];export{n as LiveTrackPedalboard,t as TrackPedalboard,j as __namedExportsOrder,E as default};
