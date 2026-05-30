import{j as a}from"./jsx-runtime-u17CrQMm.js";import{r as S}from"./iframe-3i2WR5Xa.js";import{M as r}from"./ModeSwitcher-HgozHfwl.js";import{u as e,a as d}from"./useLooperStore-D8NVNae3.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CAi--mKy.js";import"./PowerIcon-MhrZRzOh.js";import"./SessionManager-CI_pqoOp.js";import"./FloppyDisk.es-C-BEqMvD.js";import"./IconBase.es-BPfYamxb.js";import"./Trash.es-NkZ_2-SY.js";import"./X.es-DKF1rw0x.js";import"./useDialogStore-ChE-5abl.js";const L={title:"Web/ModeSwitcher",component:r,tags:["ai-generated"]},n={render:()=>(S.useEffect(()=>{e.setState({mode:"planning",setMode:s=>(e.setState({mode:s}),Promise.resolve())}),d.setState({isSessionArmed:!1,isSessionRecording:!1,isSessionReplaying:!1})},[]),a.jsx(r,{}))},t={render:()=>(S.useEffect(()=>{e.setState({mode:"practice",setMode:s=>(e.setState({mode:s}),Promise.resolve())}),d.setState({isSessionArmed:!1,isSessionRecording:!1,isSessionReplaying:!1})},[]),a.jsx(r,{}))},o={render:()=>(S.useEffect(()=>{e.setState({mode:"live",setMode:s=>(e.setState({mode:s}),Promise.resolve())}),d.setState({isSessionArmed:!1,isSessionRecording:!1,isSessionReplaying:!1})},[]),a.jsx(r,{}))},i={render:()=>(S.useEffect(()=>{e.setState({mode:"planning",setMode:s=>(e.setState({mode:s}),Promise.resolve())}),d.setState({isSessionArmed:!1,isSessionRecording:!1,isSessionReplaying:!0})},[]),a.jsx(r,{}))};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        mode: "planning",
        setMode: mode => {
          useLooperStore.setState({
            mode
          });
          return Promise.resolve();
        }
      });
      useSessionStore.setState({
        isSessionArmed: false,
        isSessionRecording: false,
        isSessionReplaying: false
      });
    }, []);
    return <ModeSwitcher />;
  }
}`,...n.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        mode: "practice",
        setMode: mode => {
          useLooperStore.setState({
            mode
          });
          return Promise.resolve();
        }
      });
      useSessionStore.setState({
        isSessionArmed: false,
        isSessionRecording: false,
        isSessionReplaying: false
      });
    }, []);
    return <ModeSwitcher />;
  }
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        mode: "live",
        setMode: mode => {
          useLooperStore.setState({
            mode
          });
          return Promise.resolve();
        }
      });
      useSessionStore.setState({
        isSessionArmed: false,
        isSessionRecording: false,
        isSessionReplaying: false
      });
    }, []);
    return <ModeSwitcher />;
  }
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => {
    useEffect(() => {
      useLooperStore.setState({
        mode: "planning",
        setMode: mode => {
          useLooperStore.setState({
            mode
          });
          return Promise.resolve();
        }
      });
      useSessionStore.setState({
        isSessionArmed: false,
        isSessionRecording: false,
        isSessionReplaying: true // Replaying session status active
      });
    }, []);
    return <ModeSwitcher />;
  }
}`,...i.parameters?.docs?.source}}};const A=["PlanningMode","PracticeMode","LiveModeActive","ReplayingSession"];export{o as LiveModeActive,n as PlanningMode,t as PracticeMode,i as ReplayingSession,A as __namedExportsOrder,L as default};
