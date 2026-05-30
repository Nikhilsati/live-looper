import{j as m}from"./jsx-runtime-u17CrQMm.js";import{r as s}from"./iframe-DjrwvunH.js";import{M as n}from"./TrackControls-uyDKqTqQ.js";import{u as o}from"./useLooperStore-BigNJQ2X.js";import"./preload-helper-PPVm8Dsz.js";import"./PowerIcon-MhrZRzOh.js";import"./useSessionStore-BzABupKw.js";import"./index-pn5caO_2.js";import"./useDialogStore-ptSJ_x83.js";import"./index-P_MXkEvz.js";import"./TrackFX-CytoTSNG.js";import"./index-ChFqJpox.js";import"./index-Bh3qYX8j.js";import"./UploadSimple.es-CzdkQJ_Q.js";import"./IconBase.es-BO8lnNST.js";import"./FloppyDisk.es-Cl30bR8a.js";import"./Sliders.es-BPJtRemJ.js";import"./Trash.es-DvLdeK75.js";import"./X.es-DlqrGIDH.js";import"./LatencyMonitor-CHlLvez4.js";import"./ArrowsClockwise.es-qeqxWUYq.js";import"./Lightning.es-BXOs-Z-Y.js";import"./InputChannelSelector-Bu5iDPx1.js";import"./SettingsPopover-Ucp6_5SY.js";const q={title:"Web/MetronomeButton",component:n,tags:["ai-generated"]},e={render:()=>(s.useEffect(()=>{o.setState({metronomeOn:!1,setMetronomeOn:r=>{o.setState({metronomeOn:r})}})},[]),m.jsx(n,{}))},t={render:()=>(s.useEffect(()=>{o.setState({metronomeOn:!0,setMetronomeOn:r=>{o.setState({metronomeOn:r})}})},[]),m.jsx(n,{}))};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...t.parameters?.docs?.source}}};const w=["MetronomeOff","MetronomeOn"];export{e as MetronomeOff,t as MetronomeOn,w as __namedExportsOrder,q as default};
