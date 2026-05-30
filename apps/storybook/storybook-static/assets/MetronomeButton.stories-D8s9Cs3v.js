import{j as m}from"./jsx-runtime-u17CrQMm.js";import{r as s}from"./iframe-CuidZOye.js";import{M as n}from"./TrackControls-DC1R9a87.js";import{u as o}from"./useLooperStore-Dc0igdZd.js";import"./preload-helper-PPVm8Dsz.js";import"./PowerIcon-CYQyr_4Q.js";import"./useDialogStore-BNH4vANE.js";import"./index-CzRv-HbD.js";import"./TrackFX-CQ1xHeN_.js";import"./index-DzZSXzUf.js";import"./index-DWDgtYsA.js";import"./UploadSimple.es-Cg0UNue0.js";import"./IconBase.es-CuMwx6Nm.js";import"./FloppyDisk.es-CZW2tNN9.js";import"./Sliders.es-CgspF6qQ.js";import"./Trash.es-DJ39ZCtF.js";import"./X.es-DbGaH5J7.js";import"./LatencyMonitor-ClHM5nP6.js";import"./ArrowsClockwise.es-naLBFEc2.js";import"./Lightning.es-FXVKR3hU.js";import"./ChannelLevels-B63WAP8R.js";import"./trackColors-bnaEkYfa.js";import"./LiveTrackPad-CbLFbTOf.js";import"./LayersDrawer-CauBJv8Z.js";import"./InputChannelSelector-BKTt-kq8.js";import"./ProgressRing-CRNbpCni.js";import"./SettingsPopover-BVwU5iE6.js";const z={title:"Web/MetronomeButton",component:n,tags:["ai-generated"]},e={render:()=>(s.useEffect(()=>{o.setState({metronomeOn:!1,setMetronomeOn:r=>{o.setState({metronomeOn:r})}})},[]),m.jsx(n,{}))},t={render:()=>(s.useEffect(()=>{o.setState({metronomeOn:!0,setMetronomeOn:r=>{o.setState({metronomeOn:r})}})},[]),m.jsx(n,{}))};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...t.parameters?.docs?.source}}};const A=["MetronomeOff","MetronomeOn"];export{e as MetronomeOff,t as MetronomeOn,A as __namedExportsOrder,z as default};
