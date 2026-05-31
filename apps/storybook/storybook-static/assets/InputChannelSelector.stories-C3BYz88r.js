import{j as a}from"./jsx-runtime-u17CrQMm.js";import{r as l}from"./iframe-DKAZBu9M.js";import{I as i}from"./InputChannelSelector-D95SL9eA.js";import{u as n}from"./useLooperStore-Dvf83KgO.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DQ3nCJ_J.js";import"./index-Cy9nehyp.js";import"./IconBase.es-D5nQXiR-.js";import"./PowerIcon-CYQyr_4Q.js";import"./useDialogStore-B5Zmn5Ro.js";const k={title:"Web/InputChannelSelector",component:i,tags:["ai-generated"]},t={args:{trackId:0},render:s=>(l.useEffect(()=>{n.setState({availableInputs:[{deviceId:"built-in",label:"Built-in Microphone (MacBook)",kind:"audioinput",groupId:"default"},{deviceId:"scarlett-2i2",label:"Focusrite Scarlett 2i2 USB Interface",kind:"audioinput",groupId:"scarlett"}],channelMapping:["built-in",null,null,null],trackChannelConfig:{0:{mode:"stereo"},1:{mode:"mono"},2:{mode:"stereo"},3:{mode:"stereo"}},setChannelMapping:(o,r)=>{const e=[...n.getState().channelMapping];return e[o]=r,n.setState({channelMapping:e}),Promise.resolve()},setTrackChannelMode:(o,r)=>{const e={...n.getState().trackChannelConfig};return e[o]={mode:r},n.setState({trackChannelConfig:e}),Promise.resolve()}})},[]),a.jsx("div",{style:{padding:"40px",minHeight:"200px"},children:a.jsx(i,{...s})}))};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
