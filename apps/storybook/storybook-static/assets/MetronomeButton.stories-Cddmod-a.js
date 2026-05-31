import{j as m}from"./jsx-runtime-u17CrQMm.js";import{r as s}from"./iframe-DKAZBu9M.js";import{M as n}from"./TrackControls-BcNB4LaY.js";import{u as o}from"./useLooperStore-Dvf83KgO.js";import"./preload-helper-PPVm8Dsz.js";import"./PowerIcon-CYQyr_4Q.js";import"./useDialogStore-B5Zmn5Ro.js";import"./index-i1lnfb4e.js";import"./TrackFX-CmMJpG6m.js";import"./index-DQ3nCJ_J.js";import"./index-Cy9nehyp.js";import"./UploadSimple.es-Da3YaHm1.js";import"./IconBase.es-D5nQXiR-.js";import"./FloppyDisk.es-BbvJ0HUu.js";import"./Sliders.es-DW-XCzPB.js";import"./Trash.es-Ci1ayznQ.js";import"./X.es-Cy8g2o_c.js";import"./LatencyMonitor-C8lkw3Y4.js";import"./ArrowsClockwise.es-B6pRRL7X.js";import"./ChannelLevels-DDK9l_vr.js";import"./trackColors-bnaEkYfa.js";import"./LiveTrackPad-XborbJm_.js";import"./LayersDrawer-B5RQVkkY.js";import"./InputChannelSelector-D95SL9eA.js";import"./ProgressRing--0IlTq6Y.js";import"./SettingsPopover-CebdGFoA.js";const y={title:"Web/MetronomeButton",component:n,tags:["ai-generated"]},e={render:()=>(s.useEffect(()=>{o.setState({metronomeOn:!1,setMetronomeOn:r=>{o.setState({metronomeOn:r})}})},[]),m.jsx(n,{}))},t={render:()=>(s.useEffect(()=>{o.setState({metronomeOn:!0,setMetronomeOn:r=>{o.setState({metronomeOn:r})}})},[]),m.jsx(n,{}))};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        metronomeOn: false,
        setMetronomeOn: v => {
          useLooperStore.setState({
            metronomeOn: v
          });
        }
      });
    }, []);
    return <MetronomeButton />;
  }
}`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        metronomeOn: true,
        setMetronomeOn: v => {
          useLooperStore.setState({
            metronomeOn: v
          });
        }
      });
    }, []);
    return <MetronomeButton />;
  }
}`,...t.parameters?.docs?.source}}};const z=["MetronomeOff","MetronomeOn"];export{e as MetronomeOff,t as MetronomeOn,z as __namedExportsOrder,y as default};
