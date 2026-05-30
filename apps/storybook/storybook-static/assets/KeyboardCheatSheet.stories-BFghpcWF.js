import{j as e}from"./jsx-runtime-u17CrQMm.js";import{C as o,a as n,b as s,R as d}from"./index-CAi--mKy.js";import"./iframe-3i2WR5Xa.js";import"./preload-helper-PPVm8Dsz.js";const a=()=>e.jsx(o,{style:{position:"fixed",bottom:24,right:24,padding:"16px 20px",background:"rgba(0,0,0,0.6)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.08)",width:260,zIndex:100,boxShadow:"0 8px 32px rgba(0,0,0,0.4)"},children:e.jsxs(n,{style:{gap:"16px"},children:[e.jsx(s,{style:{fontSize:"10px",opacity:.4,letterSpacing:"0.05em"},children:"KEYBOARD SHORTCUTS"}),e.jsx(n,{style:{gap:"10px"},children:[{key:"1-4",label:"Arm Track"},{key:"SPACE",label:"Play / Pause"}].map((r,i)=>e.jsxs(d,{style:{justifyContent:"space-between",alignItems:"center"},children:[e.jsx("span",{style:{fontSize:"10px",padding:"4px 8px",background:"rgba(255,255,255,0.08)",color:"white",borderRadius:6,fontFamily:"monospace",fontWeight:800,border:"1px solid rgba(255,255,255,0.1)"},children:r.key}),e.jsx("span",{style:{fontSize:"12px",opacity:.8,color:"white"},children:r.label})]},i))})]})});a.__docgenInfo={description:"",methods:[],displayName:"KeyboardCheatSheet"};const h={title:"Web/KeyboardCheatSheet",component:a,tags:["ai-generated"]},t={render:()=>e.jsx("div",{style:{background:"#0a0a0f",minHeight:"200px",padding:"20px"},children:e.jsx("div",{style:{position:"relative",width:"100%",height:"150px"},children:e.jsx(a,{})})})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => {
    return <div style={{
      background: "#0a0a0f",
      minHeight: "200px",
      padding: "20px"
    }}>
        {/* We place it in a relative container so it positions correctly inside Storybook iframe */}
        <div style={{
        position: "relative",
        width: "100%",
        height: "150px"
      }}>
          <KeyboardCheatSheet />
        </div>
      </div>;
  }
}`,...t.parameters?.docs?.source}}};const b=["Default"];export{t as Default,b as __namedExportsOrder,h as default};
