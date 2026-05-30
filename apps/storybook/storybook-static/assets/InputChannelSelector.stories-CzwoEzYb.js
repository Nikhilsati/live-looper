import{j as a}from"./jsx-runtime-u17CrQMm.js";import{r as l}from"./iframe-3i2WR5Xa.js";import{I as i}from"./InputChannelSelector-CPB52Oky.js";import{u as n}from"./useLooperStore-D8NVNae3.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B5R4sxe6.js";import"./index-BOgzelvg.js";import"./IconBase.es-BPfYamxb.js";import"./PowerIcon-MhrZRzOh.js";import"./useDialogStore-ChE-5abl.js";const k={title:"Web/InputChannelSelector",component:i,tags:["ai-generated"]},t={args:{trackId:0},render:s=>(l.useEffect(()=>{n.setState({availableInputs:[{deviceId:"built-in",label:"Built-in Microphone (MacBook)",kind:"audioinput",groupId:"default"},{deviceId:"scarlett-2i2",label:"Focusrite Scarlett 2i2 USB Interface",kind:"audioinput",groupId:"scarlett"}],channelMapping:["built-in",null,null,null],trackChannelConfig:{0:{mode:"stereo"},1:{mode:"mono"},2:{mode:"stereo"},3:{mode:"stereo"}},setChannelMapping:(o,r)=>{const e=[...n.getState().channelMapping];return e[o]=r,n.setState({channelMapping:e}),Promise.resolve()},setTrackChannelMode:(o,r)=>{const e={...n.getState().trackChannelConfig};return e[o]={mode:r},n.setState({trackChannelConfig:e}),Promise.resolve()}})},[]),a.jsx("div",{style:{padding:"40px",minHeight:"200px"},children:a.jsx(i,{...s})}))};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    trackId: 0
  },
  render: args => {
    useEffect(() => {
      useLooperStore.setState({
        availableInputs: [{
          deviceId: "built-in",
          label: "Built-in Microphone (MacBook)",
          kind: "audioinput",
          groupId: "default"
        } as MediaDeviceInfo, {
          deviceId: "scarlett-2i2",
          label: "Focusrite Scarlett 2i2 USB Interface",
          kind: "audioinput",
          groupId: "scarlett"
        } as MediaDeviceInfo],
        channelMapping: ["built-in", null, null, null],
        trackChannelConfig: {
          0: {
            mode: "stereo"
          },
          1: {
            mode: "mono"
          },
          2: {
            mode: "stereo"
          },
          3: {
            mode: "stereo"
          }
        },
        setChannelMapping: (trackId, deviceId) => {
          const mapping = [...useLooperStore.getState().channelMapping];
          mapping[trackId] = deviceId;
          useLooperStore.setState({
            channelMapping: mapping
          });
          return Promise.resolve();
        },
        setTrackChannelMode: (trackId, mode) => {
          const configs = {
            ...useLooperStore.getState().trackChannelConfig
          };
          configs[trackId] = {
            mode
          };
          useLooperStore.setState({
            trackChannelConfig: configs
          });
          return Promise.resolve();
        }
      });
    }, []);
    return <div style={{
      padding: "40px",
      minHeight: "200px"
    }}>
        <InputChannelSelector {...args} />
      </div>;
  }
}`,...t.parameters?.docs?.source}}};const C=["Default"];export{t as Default,C as __namedExportsOrder,k as default};
