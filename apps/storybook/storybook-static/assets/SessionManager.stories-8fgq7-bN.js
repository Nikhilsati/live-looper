import{j as o}from"./jsx-runtime-u17CrQMm.js";import{r as m}from"./iframe-DjrwvunH.js";import{S as n}from"./SessionManager-CjzD5akG.js";import{u as d}from"./useLooperStore-BigNJQ2X.js";import{u as s}from"./useSessionStore-BzABupKw.js";import"./preload-helper-PPVm8Dsz.js";import"./index-P_MXkEvz.js";import"./FloppyDisk.es-Cl30bR8a.js";import"./IconBase.es-BO8lnNST.js";import"./Trash.es-DvLdeK75.js";import"./X.es-DlqrGIDH.js";import"./useDialogStore-ptSJ_x83.js";import"./index-pn5caO_2.js";const E={title:"Web/SessionManager",component:n,tags:["ai-generated"]},c=[{id:"sess1",name:"Acoustic Jam Session",projectId:"p1",createdAt:Date.now()-3600*1e3*24,durationMs:45e3,events:[{},{},{},{}]},{id:"sess2",name:"Rock Solos Loop",projectId:"p1",createdAt:Date.now()-3600*1e3*2,durationMs:92e3,events:[{},{},{},{},{},{}]}],e={args:{onClose:()=>console.log("Close session manager")},render:t=>(m.useEffect(()=>{d.setState({currentProject:{id:"p1",name:"Project 1"},isPlaying:!1}),s.setState({isSessionArmed:!0,isSessionRecording:!1,isSessionReplaying:!1,sessions:c,fetchSessions:()=>Promise.resolve(),deleteSession:r=>{const i=s.getState().sessions.filter(a=>a.id!==r);return s.setState({sessions:i}),Promise.resolve()}})},[]),o.jsx("div",{style:{padding:"16px"},children:o.jsx(n,{...t})}))};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    onClose: () => console.log("Close session manager")
  },
  render: args => {
    useEffect(() => {
      useLooperStore.setState({
        currentProject: {
          id: "p1",
          name: "Project 1"
        } as any,
        isPlaying: false
      });
      useSessionStore.setState({
        isSessionArmed: true,
        isSessionRecording: false,
        isSessionReplaying: false,
        sessions: mockSessions as any,
        fetchSessions: () => Promise.resolve(),
        deleteSession: id => {
          const filtered = useSessionStore.getState().sessions.filter(s => s.id !== id);
          useSessionStore.setState({
            sessions: filtered
          });
          return Promise.resolve();
        }
      });
    }, []);
    return <div style={{
      padding: "16px"
    }}>
        <SessionManager {...args} />
      </div>;
  }
}`,...e.parameters?.docs?.source}}};const M=["Default"];export{e as Default,M as __namedExportsOrder,E as default};
