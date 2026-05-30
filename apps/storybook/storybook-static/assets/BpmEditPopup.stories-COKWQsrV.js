import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as p}from"./iframe-Bz5zlmtB.js";import{B as r}from"./TrackControls-6rc5kCT_.js";import{u as o}from"./useLooperStore-tB-Eqf-j.js";import"./preload-helper-PPVm8Dsz.js";import"./PowerIcon-MhrZRzOh.js";import"./index-gqHS7t1m.js";import"./TrackFX-DWhP02q8.js";import"./index-BXqYSj3i.js";import"./index-BkB19OZz.js";import"./UploadSimple.es-QT3uJlvy.js";import"./IconBase.es-BaY8-AWE.js";import"./FloppyDisk.es-CIWUAUiu.js";import"./Sliders.es-BfvF4Fu1.js";import"./Trash.es-GkaNqD0k.js";import"./X.es-DMEZIJzP.js";import"./LatencyMonitor-DzOqAXWL.js";import"./ArrowsClockwise.es-C_n7ETa_.js";import"./Lightning.es-B1hOFdRv.js";import"./InputChannelSelector-bIWJ7e8G.js";import"./SettingsPopover-DPYdkQx4.js";import"./useDialogStore-DfmhEa3P.js";const w={title:"Web/BpmEditPopup",component:r,tags:["ai-generated"],argTypes:{onClose:{action:"onClose clicked"}}},t={args:{onClose:()=>console.log("onClose clicked")},render:s=>(p.useEffect(()=>{o.setState({bpm:120,isPlaying:!1,setBpm:i=>{o.setState({bpm:i})}})},[]),e.jsx("div",{style:{position:"relative",minHeight:"350px",width:"100%"},children:e.jsx(r,{...s})}))};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
