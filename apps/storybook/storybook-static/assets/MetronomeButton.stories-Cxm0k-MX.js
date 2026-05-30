import{j as m}from"./jsx-runtime-u17CrQMm.js";import{r as s}from"./iframe-Bz5zlmtB.js";import{M as n}from"./TrackControls-6rc5kCT_.js";import{u as o}from"./useLooperStore-tB-Eqf-j.js";import"./preload-helper-PPVm8Dsz.js";import"./PowerIcon-MhrZRzOh.js";import"./index-gqHS7t1m.js";import"./TrackFX-DWhP02q8.js";import"./index-BXqYSj3i.js";import"./index-BkB19OZz.js";import"./UploadSimple.es-QT3uJlvy.js";import"./IconBase.es-BaY8-AWE.js";import"./FloppyDisk.es-CIWUAUiu.js";import"./Sliders.es-BfvF4Fu1.js";import"./Trash.es-GkaNqD0k.js";import"./X.es-DMEZIJzP.js";import"./LatencyMonitor-DzOqAXWL.js";import"./ArrowsClockwise.es-C_n7ETa_.js";import"./Lightning.es-B1hOFdRv.js";import"./InputChannelSelector-bIWJ7e8G.js";import"./SettingsPopover-DPYdkQx4.js";import"./useDialogStore-DfmhEa3P.js";const h={title:"Web/MetronomeButton",component:n,tags:["ai-generated"]},e={render:()=>(s.useEffect(()=>{o.setState({metronomeOn:!1,setMetronomeOn:r=>{o.setState({metronomeOn:r})}})},[]),m.jsx(n,{}))},t={render:()=>(s.useEffect(()=>{o.setState({metronomeOn:!0,setMetronomeOn:r=>{o.setState({metronomeOn:r})}})},[]),m.jsx(n,{}))};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
