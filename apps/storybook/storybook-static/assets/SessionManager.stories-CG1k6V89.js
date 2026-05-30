import{j as n}from"./jsx-runtime-u17CrQMm.js";import{r as d}from"./iframe-CuidZOye.js";import{S as o}from"./SessionManager-B_5e7Gzs.js";import{u as c,a as s}from"./useLooperStore-Dc0igdZd.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CzRv-HbD.js";import"./FloppyDisk.es-CZW2tNN9.js";import"./IconBase.es-CuMwx6Nm.js";import"./Trash.es-DJ39ZCtF.js";import"./X.es-DbGaH5J7.js";import"./useDialogStore-BNH4vANE.js";const R={title:"Web/SessionManager",component:o,tags:["ai-generated"]},l=[{id:"sess1",name:"Acoustic Jam Session",projectId:"p1",createdAt:Date.now()-3600*1e3*24,durationMs:45e3,events:[{},{},{},{}]},{id:"sess2",name:"Rock Solos Loop",projectId:"p1",createdAt:Date.now()-3600*1e3*2,durationMs:92e3,events:[{},{},{},{},{},{}]}],e={args:{onClose:()=>console.log("Close session manager")},render:t=>(d.useEffect(()=>{c.setState({currentProject:{id:"p1",name:"Project 1"},isPlaying:!1}),s.setState({isSessionArmed:!0,isSessionRecording:!1,isSessionReplaying:!1,sessions:l,fetchSessions:()=>Promise.resolve(),deleteSession:r=>{const i=s.getState().sessions.filter(a=>a.id!==r);return s.setState({sessions:i}),Promise.resolve()}})},[]),n.jsx("div",{style:{padding:"16px"},children:n.jsx(o,{...t})}))};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...e.parameters?.docs?.source}}};const A=["Default"];export{e as Default,A as __namedExportsOrder,R as default};
