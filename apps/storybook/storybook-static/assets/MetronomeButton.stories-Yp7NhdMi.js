import{j as m}from"./jsx-runtime-u17CrQMm.js";import{r as s}from"./iframe-CoXEDRzF.js";import{M as n}from"./TrackControls-D82avz0U.js";import{u as o}from"./useLooperStore-Bybne01-.js";import"./preload-helper-PPVm8Dsz.js";import"./PowerIcon-MhrZRzOh.js";import"./index-7QDTVwY0.js";import"./TrackFX-e6p_QtSa.js";import"./index-CgSukmKq.js";import"./index-CyrqA3Ya.js";import"./UploadSimple.es-y1Pk1ARz.js";import"./IconBase.es-DSIt0WZZ.js";import"./FloppyDisk.es-DXhyPX4k.js";import"./Sliders.es-xBAbiGhp.js";import"./Trash.es-C-uUh0KV.js";import"./X.es-7u80lDDN.js";import"./LatencyMonitor-Kt043hsF.js";import"./ArrowsClockwise.es-BmMsv_xV.js";import"./Lightning.es-Dx41jP9m.js";import"./InputChannelSelector-CLkRBLhl.js";import"./SettingsPopover-B53-rj5t.js";import"./useDialogStore-ElppLasU.js";const h={title:"Web/MetronomeButton",component:n,tags:["ai-generated"]},e={render:()=>(s.useEffect(()=>{o.setState({metronomeOn:!1,setMetronomeOn:r=>{o.setState({metronomeOn:r})}})},[]),m.jsx(n,{}))},t={render:()=>(s.useEffect(()=>{o.setState({metronomeOn:!0,setMetronomeOn:r=>{o.setState({metronomeOn:r})}})},[]),m.jsx(n,{}))};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...t.parameters?.docs?.source}}};const k=["MetronomeOff","MetronomeOn"];export{e as MetronomeOff,t as MetronomeOn,k as __namedExportsOrder,h as default};
