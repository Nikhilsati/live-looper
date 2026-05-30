import{j as a}from"./jsx-runtime-u17CrQMm.js";import{r as S}from"./iframe-BXJpxzHH.js";import{M as r}from"./ModeSwitcher-DbVd5MMv.js";import{u as e}from"./useLooperStore-BfSgrONV.js";import{u as d}from"./useSessionStore-DGrFwR9j.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D3pbEsCm.js";import"./PowerIcon-MhrZRzOh.js";import"./SessionManager-CuiFqSbi.js";import"./FloppyDisk.es-DfosdXF7.js";import"./IconBase.es-c7dv95h9.js";import"./Trash.es-BgCRKvX9.js";import"./X.es-OFt9uGlE.js";import"./useDialogStore-7q7Veijn.js";import"./index-BhM3fhe2.js";const x={title:"Web/ModeSwitcher",component:r,tags:["ai-generated"]},n={render:()=>(S.useEffect(()=>{e.setState({mode:"planning",setMode:s=>(e.setState({mode:s}),Promise.resolve())}),d.setState({isSessionArmed:!1,isSessionRecording:!1,isSessionReplaying:!1})},[]),a.jsx(r,{}))},t={render:()=>(S.useEffect(()=>{e.setState({mode:"practice",setMode:s=>(e.setState({mode:s}),Promise.resolve())}),d.setState({isSessionArmed:!1,isSessionRecording:!1,isSessionReplaying:!1})},[]),a.jsx(r,{}))},o={render:()=>(S.useEffect(()=>{e.setState({mode:"live",setMode:s=>(e.setState({mode:s}),Promise.resolve())}),d.setState({isSessionArmed:!1,isSessionRecording:!1,isSessionReplaying:!1})},[]),a.jsx(r,{}))},i={render:()=>(S.useEffect(()=>{e.setState({mode:"planning",setMode:s=>(e.setState({mode:s}),Promise.resolve())}),d.setState({isSessionArmed:!1,isSessionRecording:!1,isSessionReplaying:!0})},[]),a.jsx(r,{}))};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const h=["PlanningMode","PracticeMode","LiveModeActive","ReplayingSession"];export{o as LiveModeActive,n as PlanningMode,t as PracticeMode,i as ReplayingSession,h as __namedExportsOrder,x as default};
