import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as d}from"./iframe-BXJpxzHH.js";import{b as o}from"./useDialogStore-7q7Veijn.js";import{M as x,C as h,a as b,H as y,T as D,R as j,B as c}from"./index-D3pbEsCm.js";import"./preload-helper-PPVm8Dsz.js";const s=()=>{const{isOpen:r,options:l,closeDialog:i}=o();if(!r||!l)return null;const{type:g,title:p,message:u,danger:t,confirmText:m="OK",cancelText:f="Cancel"}=l;return e.jsx(x,{onClose:()=>i(!1),children:e.jsx(h,{style:{width:440,padding:32,background:"var(--surface, #1e1e1e)",border:t?"1px solid rgba(255, 107, 107, 0.3)":"1px solid rgba(255, 255, 255, 0.1)",boxShadow:t?"0 25px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255, 107, 107, 0.1) inset":"0 25px 50px rgba(0,0,0,0.5)"},children:e.jsxs(b,{style:{gap:24},children:[e.jsx(y,{style:{fontSize:24,margin:0,color:t?"#ff6b6b":"white"},children:p}),e.jsx(D,{style:{fontSize:16,opacity:.9},children:u}),e.jsxs(j,{style:{gap:16,justifyContent:"flex-end",marginTop:8},children:[g==="confirm"&&e.jsx(c,{variant:"ghost",onClick:()=>i(!1),style:{padding:"10px 24px",borderRadius:8,background:"rgba(255,255,255,0.05)",fontWeight:600},children:f}),e.jsx(c,{variant:"primary",onClick:()=>i(!0),style:{padding:"10px 24px",borderRadius:8,background:t?"rgba(239, 68, 68, 0.2)":"var(--primary, #a881ff)",color:t?"#ff6b6b":"white",border:t?"none":"auto",fontWeight:600},children:m})]})]})})})};s.__docgenInfo={description:"",methods:[],displayName:"GlobalDialog"};const k={title:"Web/GlobalDialog",component:s,tags:["ai-generated"]},a={render:()=>(d.useEffect(()=>{o.setState({isOpen:!0,options:{type:"alert",title:"Audio Engine Initialized",message:"The Live Looper audio engine has started successfully. Plug in your guitar to begin.",confirmText:"Got it"},closeDialog:r=>{console.log("Dialog closed with result:",r),o.setState({isOpen:!1})}})},[]),e.jsx("div",{style:{background:"#0a0a0f",minHeight:"300px"},children:e.jsx(s,{})}))},n={render:()=>(d.useEffect(()=>{o.setState({isOpen:!0,options:{type:"confirm",title:"Delete Project?",message:"This will permanently remove the project 'Midnight Blues' and all recorded layers.",danger:!0,confirmText:"Delete Permanently",cancelText:"Keep Project"},closeDialog:r=>{console.log("Dialog closed with result:",r),o.setState({isOpen:!1})}})},[]),e.jsx("div",{style:{background:"#0a0a0f",minHeight:"300px"},children:e.jsx(s,{})}))};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => {
    useEffect(() => {
      useDialogStore.setState({
        isOpen: true,
        options: {
          type: "alert",
          title: "Audio Engine Initialized",
          message: "The Live Looper audio engine has started successfully. Plug in your guitar to begin.",
          confirmText: "Got it"
        },
        closeDialog: res => {
          console.log("Dialog closed with result:", res);
          useDialogStore.setState({
            isOpen: false
          });
        }
      });
    }, []);
    return <div style={{
      background: "#0a0a0f",
      minHeight: "300px"
    }}>
        <GlobalDialog />
      </div>;
  }
}`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => {
    useEffect(() => {
      useDialogStore.setState({
        isOpen: true,
        options: {
          type: "confirm",
          title: "Delete Project?",
          message: "This will permanently remove the project 'Midnight Blues' and all recorded layers.",
          danger: true,
          confirmText: "Delete Permanently",
          cancelText: "Keep Project"
        },
        closeDialog: res => {
          console.log("Dialog closed with result:", res);
          useDialogStore.setState({
            isOpen: false
          });
        }
      });
    }, []);
    return <div style={{
      background: "#0a0a0f",
      minHeight: "300px"
    }}>
        <GlobalDialog />
      </div>;
  }
}`,...n.parameters?.docs?.source}}};const C=["StandardAlert","DangerConfirm"];export{n as DangerConfirm,a as StandardAlert,C as __namedExportsOrder,k as default};
