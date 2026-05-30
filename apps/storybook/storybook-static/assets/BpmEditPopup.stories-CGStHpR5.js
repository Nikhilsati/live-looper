import{j as o}from"./jsx-runtime-u17CrQMm.js";import{r as s}from"./iframe-BXJpxzHH.js";import{B as r}from"./TrackControls-DpoNw5L1.js";import{u as e}from"./useLooperStore-BfSgrONV.js";import"./preload-helper-PPVm8Dsz.js";import"./PowerIcon-MhrZRzOh.js";import"./useSessionStore-DGrFwR9j.js";import"./index-BhM3fhe2.js";import"./useDialogStore-7q7Veijn.js";import"./index-D3pbEsCm.js";import"./TrackFX-D44tMDTn.js";import"./index-BlgGgipN.js";import"./index-CRrYHsHn.js";import"./UploadSimple.es-BcU1hz6L.js";import"./IconBase.es-c7dv95h9.js";import"./FloppyDisk.es-DfosdXF7.js";import"./Sliders.es-DEHWsp6N.js";import"./Trash.es-BgCRKvX9.js";import"./X.es-OFt9uGlE.js";import"./LatencyMonitor-BjHyaxLm.js";import"./ArrowsClockwise.es-CYsyLPi2.js";import"./Lightning.es-DvM1n1hL.js";import"./InputChannelSelector-CLxjJIGQ.js";import"./SettingsPopover-CkLm44tE.js";const H={title:"Web/BpmEditPopup",component:r,tags:["ai-generated"],argTypes:{onClose:{action:"onClose clicked"}}},t={args:{onClose:()=>console.log("onClose clicked")},render:i=>(s.useEffect(()=>{e.setState({bpm:120,isPlaying:!1,setBpm:p=>{e.setState({bpm:p})}})},[]),o.jsx("div",{style:{position:"relative",minHeight:"350px",width:"100%"},children:o.jsx(r,{...i})}))};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
}`,...t.parameters?.docs?.source}}};const _=["Default"];export{t as Default,_ as __namedExportsOrder,H as default};
