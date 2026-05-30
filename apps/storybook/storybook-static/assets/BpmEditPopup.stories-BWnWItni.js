import{j as o}from"./jsx-runtime-u17CrQMm.js";import{r as s}from"./iframe-DjrwvunH.js";import{B as r}from"./TrackControls-uyDKqTqQ.js";import{u as e}from"./useLooperStore-BigNJQ2X.js";import"./preload-helper-PPVm8Dsz.js";import"./PowerIcon-MhrZRzOh.js";import"./useSessionStore-BzABupKw.js";import"./index-pn5caO_2.js";import"./useDialogStore-ptSJ_x83.js";import"./index-P_MXkEvz.js";import"./TrackFX-CytoTSNG.js";import"./index-ChFqJpox.js";import"./index-Bh3qYX8j.js";import"./UploadSimple.es-CzdkQJ_Q.js";import"./IconBase.es-BO8lnNST.js";import"./FloppyDisk.es-Cl30bR8a.js";import"./Sliders.es-BPJtRemJ.js";import"./Trash.es-DvLdeK75.js";import"./X.es-DlqrGIDH.js";import"./LatencyMonitor-CHlLvez4.js";import"./ArrowsClockwise.es-qeqxWUYq.js";import"./Lightning.es-BXOs-Z-Y.js";import"./InputChannelSelector-Bu5iDPx1.js";import"./SettingsPopover-Ucp6_5SY.js";const H={title:"Web/BpmEditPopup",component:r,tags:["ai-generated"],argTypes:{onClose:{action:"onClose clicked"}}},t={args:{onClose:()=>console.log("onClose clicked")},render:i=>(s.useEffect(()=>{e.setState({bpm:120,isPlaying:!1,setBpm:p=>{e.setState({bpm:p})}})},[]),o.jsx("div",{style:{position:"relative",minHeight:"350px",width:"100%"},children:o.jsx(r,{...i})}))};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
