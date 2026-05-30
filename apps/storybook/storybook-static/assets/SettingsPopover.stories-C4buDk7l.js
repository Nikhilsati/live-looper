import{j as a}from"./jsx-runtime-u17CrQMm.js";import{r}from"./iframe-CV-5FfhP.js";import{S as i}from"./SettingsPopover-B4CW-DR2.js";import{u as t}from"./useLooperStore-Dw-zsQq8.js";import"./preload-helper-PPVm8Dsz.js";import"./ArrowsClockwise.es-vnVStLo6.js";import"./IconBase.es-DSmtO-o_.js";import"./Sliders.es-pqjgSKC9.js";import"./index-B8eWrQ5m.js";import"./useDialogStore-ddHqeGHH.js";const O={title:"Web/SettingsPopover",component:i,tags:["ai-generated"]},s=[{deviceId:"default",label:"System Default Device",kind:"audioinput"},{deviceId:"mic-1",label:"Built-in Microphone",kind:"audioinput"},{deviceId:"audio-interface-in",label:"Focusrite Scarlett Solo (Input)",kind:"audioinput"},{deviceId:"out-1",label:"Built-in Speakers",kind:"audiooutput"},{deviceId:"audio-interface-out",label:"Focusrite Scarlett Solo (Output)",kind:"audiooutput"}],o={args:{onClose:()=>console.log("Close settings popover"),showDemoOption:!0,showSmartSnap:!0},render:u=>(r.useEffect(()=>{t.setState({availableInputs:s.filter(e=>e.kind==="audioinput"),availableOutputs:s.filter(e=>e.kind==="audiooutput"),inputDeviceId:"mic-1",outputDeviceId:"out-1",performerOutputDeviceId:"out-1",smartSnapEnabled:!0,dualOutputMode:!1,refreshDevices:async()=>console.log("Refreshing devices..."),setInputDevice:async e=>{console.log("Set input device",e),t.setState({inputDeviceId:e})},setOutputDevice:async e=>{console.log("Set output device",e),t.setState({outputDeviceId:e})},setPerformerOutputDevice:async e=>{console.log("Set cue/performer output device",e),t.setState({performerOutputDeviceId:e})},setSmartSnapEnabled:e=>{console.log("Set smart snap",e),t.setState({smartSnapEnabled:e})},setDualOutputMode:e=>{console.log("Set dual output mode",e),t.setState({dualOutputMode:e})},loadDemoData:()=>console.log("Loading demo data...")})},[]),a.jsx("div",{style:{position:"relative",height:"350px",width:"260px",background:"#0a0a0f",padding:"10px"},children:a.jsx(i,{...u,style:{position:"static",bottom:"auto",right:"auto"}})}))},n={args:{onClose:()=>console.log("Close settings popover"),showDemoOption:!0,showSmartSnap:!0},render:u=>(r.useEffect(()=>{t.setState({availableInputs:s.filter(e=>e.kind==="audioinput"),availableOutputs:s.filter(e=>e.kind==="audiooutput"),inputDeviceId:"audio-interface-in",outputDeviceId:"out-1",performerOutputDeviceId:"audio-interface-out",smartSnapEnabled:!1,dualOutputMode:!0,refreshDevices:async()=>console.log("Refreshing devices..."),setInputDevice:async e=>t.setState({inputDeviceId:e}),setOutputDevice:async e=>t.setState({outputDeviceId:e}),setPerformerOutputDevice:async e=>t.setState({performerOutputDeviceId:e}),setSmartSnapEnabled:e=>t.setState({smartSnapEnabled:e}),setDualOutputMode:e=>t.setState({dualOutputMode:e}),loadDemoData:()=>console.log("Loading demo data...")})},[]),a.jsx("div",{style:{position:"relative",height:"420px",width:"260px",background:"#0a0a0f",padding:"10px"},children:a.jsx(i,{...u,style:{position:"static",bottom:"auto",right:"auto"}})}))};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    onClose: () => console.log("Close settings popover"),
    showDemoOption: true,
    showSmartSnap: true
  },
  render: args => {
    useEffect(() => {
      useLooperStore.setState({
        availableInputs: mockDevices.filter(d => d.kind === "audioinput") as any,
        availableOutputs: mockDevices.filter(d => d.kind === "audiooutput") as any,
        inputDeviceId: "mic-1",
        outputDeviceId: "out-1",
        performerOutputDeviceId: "out-1",
        smartSnapEnabled: true,
        dualOutputMode: false,
        refreshDevices: async () => console.log("Refreshing devices..."),
        setInputDevice: async id => {
          console.log("Set input device", id);
          useLooperStore.setState({
            inputDeviceId: id
          });
        },
        setOutputDevice: async id => {
          console.log("Set output device", id);
          useLooperStore.setState({
            outputDeviceId: id
          });
        },
        setPerformerOutputDevice: async id => {
          console.log("Set cue/performer output device", id);
          useLooperStore.setState({
            performerOutputDeviceId: id
          });
        },
        setSmartSnapEnabled: v => {
          console.log("Set smart snap", v);
          useLooperStore.setState({
            smartSnapEnabled: v
          });
        },
        setDualOutputMode: v => {
          console.log("Set dual output mode", v);
          useLooperStore.setState({
            dualOutputMode: v
          });
        },
        loadDemoData: () => console.log("Loading demo data...")
      });
    }, []);
    return <div style={{
      position: "relative",
      height: "350px",
      width: "260px",
      background: "#0a0a0f",
      padding: "10px"
    }}>
        <SettingsPopover {...args} style={{
        position: "static",
        bottom: "auto",
        right: "auto"
      }} />
      </div>;
  }
}`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    onClose: () => console.log("Close settings popover"),
    showDemoOption: true,
    showSmartSnap: true
  },
  render: args => {
    useEffect(() => {
      useLooperStore.setState({
        availableInputs: mockDevices.filter(d => d.kind === "audioinput") as any,
        availableOutputs: mockDevices.filter(d => d.kind === "audiooutput") as any,
        inputDeviceId: "audio-interface-in",
        outputDeviceId: "out-1",
        performerOutputDeviceId: "audio-interface-out",
        smartSnapEnabled: false,
        dualOutputMode: true,
        refreshDevices: async () => console.log("Refreshing devices..."),
        setInputDevice: async id => useLooperStore.setState({
          inputDeviceId: id
        }),
        setOutputDevice: async id => useLooperStore.setState({
          outputDeviceId: id
        }),
        setPerformerOutputDevice: async id => useLooperStore.setState({
          performerOutputDeviceId: id
        }),
        setSmartSnapEnabled: v => useLooperStore.setState({
          smartSnapEnabled: v
        }),
        setDualOutputMode: v => useLooperStore.setState({
          dualOutputMode: v
        }),
        loadDemoData: () => console.log("Loading demo data...")
      });
    }, []);
    return <div style={{
      position: "relative",
      height: "420px",
      width: "260px",
      background: "#0a0a0f",
      padding: "10px"
    }}>
        <SettingsPopover {...args} style={{
        position: "static",
        bottom: "auto",
        right: "auto"
      }} />
      </div>;
  }
}`,...n.parameters?.docs?.source}}};const I=["Default","DualOutputActive"];export{o as Default,n as DualOutputActive,I as __namedExportsOrder,O as default};
