import{j as a}from"./jsx-runtime-u17CrQMm.js";import{r as S}from"./iframe-DKAZBu9M.js";import{M as r}from"./ModeSwitcher-CYBZtonk.js";import{u as e,a as d}from"./useLooperStore-Dvf83KgO.js";import"./preload-helper-PPVm8Dsz.js";import"./index-i1lnfb4e.js";import"./PowerIcon-CYQyr_4Q.js";import"./SessionManager-6Gz7Ej7z.js";import"./FloppyDisk.es-BbvJ0HUu.js";import"./IconBase.es-D5nQXiR-.js";import"./Trash.es-Ci1ayznQ.js";import"./X.es-Cy8g2o_c.js";import"./useDialogStore-B5Zmn5Ro.js";const L={title:"Web/ModeSwitcher",component:r,tags:["ai-generated"]},n={render:()=>(S.useEffect(()=>{e.setState({mode:"planning",setMode:s=>(e.setState({mode:s}),Promise.resolve())}),d.setState({isSessionArmed:!1,isSessionRecording:!1,isSessionReplaying:!1})},[]),a.jsx(r,{}))},t={render:()=>(S.useEffect(()=>{e.setState({mode:"practice",setMode:s=>(e.setState({mode:s}),Promise.resolve())}),d.setState({isSessionArmed:!1,isSessionRecording:!1,isSessionReplaying:!1})},[]),a.jsx(r,{}))},o={render:()=>(S.useEffect(()=>{e.setState({mode:"live",setMode:s=>(e.setState({mode:s}),Promise.resolve())}),d.setState({isSessionArmed:!1,isSessionRecording:!1,isSessionReplaying:!1})},[]),a.jsx(r,{}))},i={render:()=>(S.useEffect(()=>{e.setState({mode:"planning",setMode:s=>(e.setState({mode:s}),Promise.resolve())}),d.setState({isSessionArmed:!1,isSessionRecording:!1,isSessionReplaying:!0})},[]),a.jsx(r,{}))};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
