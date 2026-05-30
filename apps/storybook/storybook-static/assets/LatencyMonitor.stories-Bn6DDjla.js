import{j as a}from"./jsx-runtime-u17CrQMm.js";import{r as i}from"./iframe-Bz5zlmtB.js";import{L as o}from"./LatencyMonitor-DzOqAXWL.js";import{u as e}from"./useLooperStore-tB-Eqf-j.js";import"./preload-helper-PPVm8Dsz.js";import"./index-gqHS7t1m.js";import"./ArrowsClockwise.es-C_n7ETa_.js";import"./IconBase.es-BaY8-AWE.js";import"./Lightning.es-B1hOFdRv.js";import"./useDialogStore-DfmhEa3P.js";const b={title:"Web/LatencyMonitor",component:o,tags:["ai-generated"],decorators:[t=>a.jsx("div",{style:{position:"relative",minHeight:"250px",width:"100%"},children:a.jsx(t,{})})]},n={render:()=>(i.useEffect(()=>{e.setState({latencyMeasuredSamples:0,latencyCompensationSamples:0,isCalibratingLatency:!1,jitter:0,calibrateLatency:()=>{e.setState({isCalibratingLatency:!0}),setTimeout(()=>{e.setState({isCalibratingLatency:!1,latencyMeasuredSamples:529,latencyCompensationSamples:529,jitter:4e-4})},2e3)}})},[]),a.jsx(o,{}))},r={render:()=>(i.useEffect(()=>{e.setState({latencyMeasuredSamples:441,latencyCompensationSamples:441,isCalibratingLatency:!1,jitter:6e-4});const t=setInterval(()=>{e.setState({jitter:5e-4+3e-4*Math.random()})},500);return()=>clearInterval(t)},[]),a.jsx(o,{}))},s={render:()=>(i.useEffect(()=>{e.setState({latencyMeasuredSamples:882,latencyCompensationSamples:882,isCalibratingLatency:!1,jitter:.0045});const t=setInterval(()=>{e.setState({jitter:.003+.003*Math.random()})},300);return()=>clearInterval(t)},[]),a.jsx(o,{}))};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        latencyMeasuredSamples: 0,
        latencyCompensationSamples: 0,
        isCalibratingLatency: false,
        jitter: 0,
        calibrateLatency: () => {
          useLooperStore.setState({
            isCalibratingLatency: true
          });
          setTimeout(() => {
            useLooperStore.setState({
              isCalibratingLatency: false,
              latencyMeasuredSamples: 529,
              // 12ms
              latencyCompensationSamples: 529,
              jitter: 0.0004
            });
          }, 2000);
        }
      });
    }, []);
    return <LatencyMonitor />;
  }
}`,...n.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        latencyMeasuredSamples: 441,
        // 10ms round-trip at 44.1kHz
        latencyCompensationSamples: 441,
        isCalibratingLatency: false,
        jitter: 0.0006 // 0.6ms jitter
      });

      // Simulate a small amount of jitter changing in real time for sparkline visual effect
      const interval = setInterval(() => {
        useLooperStore.setState({
          jitter: 0.0005 + 0.0003 * Math.random()
        });
      }, 500);
      return () => clearInterval(interval);
    }, []);
    return <LatencyMonitor />;
  }
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        latencyMeasuredSamples: 882,
        // 20ms RTL
        latencyCompensationSamples: 882,
        isCalibratingLatency: false,
        jitter: 0.0045 // 4.5ms jitter (unstable, > 2ms)
      });
      const interval = setInterval(() => {
        useLooperStore.setState({
          jitter: 0.003 + 0.003 * Math.random()
        });
      }, 300);
      return () => clearInterval(interval);
    }, []);
    return <LatencyMonitor />;
  }
}`,...s.parameters?.docs?.source}}};const j=["CalibrationRequired","CalibratedAndStable","UnstableJitter"];export{r as CalibratedAndStable,n as CalibrationRequired,s as UnstableJitter,j as __namedExportsOrder,b as default};
