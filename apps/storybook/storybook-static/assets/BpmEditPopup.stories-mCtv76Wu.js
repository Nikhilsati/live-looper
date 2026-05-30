import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as p}from"./iframe-3i2WR5Xa.js";import{B as r}from"./TrackControls-CHLowz8S.js";import{u as o}from"./useLooperStore-D8NVNae3.js";import"./preload-helper-PPVm8Dsz.js";import"./PowerIcon-MhrZRzOh.js";import"./index-CAi--mKy.js";import"./TrackFX-xYd0F-eP.js";import"./index-B5R4sxe6.js";import"./index-BOgzelvg.js";import"./UploadSimple.es-BVBZzRYz.js";import"./IconBase.es-BPfYamxb.js";import"./FloppyDisk.es-C-BEqMvD.js";import"./Sliders.es-DiNjM7eB.js";import"./Trash.es-NkZ_2-SY.js";import"./X.es-DKF1rw0x.js";import"./LatencyMonitor-jcsEBinV.js";import"./ArrowsClockwise.es-DBPdaSFq.js";import"./Lightning.es-DU56mEC3.js";import"./InputChannelSelector-CPB52Oky.js";import"./SettingsPopover-B4dohh2J.js";import"./useDialogStore-ChE-5abl.js";const w={title:"Web/BpmEditPopup",component:r,tags:["ai-generated"],argTypes:{onClose:{action:"onClose clicked"}}},t={args:{onClose:()=>console.log("onClose clicked")},render:s=>(p.useEffect(()=>{o.setState({bpm:120,isPlaying:!1,setBpm:i=>{o.setState({bpm:i})}})},[]),e.jsx("div",{style:{position:"relative",minHeight:"350px",width:"100%"},children:e.jsx(r,{...s})}))};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    onClose: () => console.log("onClose clicked")
  },
  render: args => {
    useEffect(() => {
      useLooperStore.setState({
        bpm: 120,
        isPlaying: false,
        setBpm: b => {
          useLooperStore.setState({
            bpm: b
          });
        }
      });
    }, []);
    return <div style={{
      position: "relative",
      minHeight: "350px",
      width: "100%"
    }}>
        <BpmEditPopup {...args} />
      </div>;
  }
}`,...t.parameters?.docs?.source}}};const D=["Default"];export{t as Default,D as __namedExportsOrder,w as default};
