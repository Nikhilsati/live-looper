import{j as o}from"./jsx-runtime-u17CrQMm.js";import{r as s}from"./iframe-DKAZBu9M.js";import{B as r}from"./TrackControls-BcNB4LaY.js";import{u as e}from"./useLooperStore-Dvf83KgO.js";import"./preload-helper-PPVm8Dsz.js";import"./PowerIcon-CYQyr_4Q.js";import"./useDialogStore-B5Zmn5Ro.js";import"./index-i1lnfb4e.js";import"./TrackFX-CmMJpG6m.js";import"./index-DQ3nCJ_J.js";import"./index-Cy9nehyp.js";import"./UploadSimple.es-Da3YaHm1.js";import"./IconBase.es-D5nQXiR-.js";import"./FloppyDisk.es-BbvJ0HUu.js";import"./Sliders.es-DW-XCzPB.js";import"./Trash.es-Ci1ayznQ.js";import"./X.es-Cy8g2o_c.js";import"./LatencyMonitor-C8lkw3Y4.js";import"./ArrowsClockwise.es-B6pRRL7X.js";import"./ChannelLevels-DDK9l_vr.js";import"./trackColors-bnaEkYfa.js";import"./LiveTrackPad-XborbJm_.js";import"./LayersDrawer-B5RQVkkY.js";import"./InputChannelSelector-D95SL9eA.js";import"./ProgressRing--0IlTq6Y.js";import"./SettingsPopover-CebdGFoA.js";const O={title:"Web/BpmEditPopup",component:r,tags:["ai-generated"],argTypes:{onClose:{action:"onClose clicked"}}},t={args:{onClose:()=>console.log("onClose clicked")},render:i=>(s.useEffect(()=>{e.setState({bpm:120,isPlaying:!1,setBpm:p=>{e.setState({bpm:p})}})},[]),o.jsx("div",{style:{position:"relative",minHeight:"350px",width:"100%"},children:o.jsx(r,{...i})}))};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
}`,...t.parameters?.docs?.source}}};const R=["Default"];export{t as Default,R as __namedExportsOrder,O as default};
