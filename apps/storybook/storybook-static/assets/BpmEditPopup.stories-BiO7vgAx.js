import{j as o}from"./jsx-runtime-u17CrQMm.js";import{r as s}from"./iframe-CuidZOye.js";import{B as r}from"./TrackControls-DC1R9a87.js";import{u as e}from"./useLooperStore-Dc0igdZd.js";import"./preload-helper-PPVm8Dsz.js";import"./PowerIcon-CYQyr_4Q.js";import"./useDialogStore-BNH4vANE.js";import"./index-CzRv-HbD.js";import"./TrackFX-CQ1xHeN_.js";import"./index-DzZSXzUf.js";import"./index-DWDgtYsA.js";import"./UploadSimple.es-Cg0UNue0.js";import"./IconBase.es-CuMwx6Nm.js";import"./FloppyDisk.es-CZW2tNN9.js";import"./Sliders.es-CgspF6qQ.js";import"./Trash.es-DJ39ZCtF.js";import"./X.es-DbGaH5J7.js";import"./LatencyMonitor-ClHM5nP6.js";import"./ArrowsClockwise.es-naLBFEc2.js";import"./Lightning.es-FXVKR3hU.js";import"./ChannelLevels-B63WAP8R.js";import"./trackColors-bnaEkYfa.js";import"./LiveTrackPad-CbLFbTOf.js";import"./LayersDrawer-CauBJv8Z.js";import"./InputChannelSelector-BKTt-kq8.js";import"./ProgressRing-CRNbpCni.js";import"./SettingsPopover-BVwU5iE6.js";const R={title:"Web/BpmEditPopup",component:r,tags:["ai-generated"],argTypes:{onClose:{action:"onClose clicked"}}},t={args:{onClose:()=>console.log("onClose clicked")},render:i=>(s.useEffect(()=>{e.setState({bpm:120,isPlaying:!1,setBpm:p=>{e.setState({bpm:p})}})},[]),o.jsx("div",{style:{position:"relative",minHeight:"350px",width:"100%"},children:o.jsx(r,{...i})}))};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
}`,...t.parameters?.docs?.source}}};const T=["Default"];export{t as Default,T as __namedExportsOrder,R as default};
