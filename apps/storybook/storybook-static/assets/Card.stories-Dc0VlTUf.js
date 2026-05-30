import{j as n}from"./jsx-runtime-u17CrQMm.js";import{C as t,H as s,T as i,B as o}from"./index-B8eWrQ5m.js";import"./iframe-CV-5FfhP.js";import"./preload-helper-PPVm8Dsz.js";const x={title:"UI/Card",component:t,tags:["ai-generated"]},r={args:{style:{padding:"20px",maxWidth:"400px"}},render:a=>n.jsxs(t,{...a,children:[n.jsx(s,{style:{fontSize:"18px",marginBottom:"8px"},children:"Track Title"}),n.jsx(i,{style:{fontSize:"14px",color:"rgba(255,255,255,0.6)",marginBottom:"16px"},children:"Configure track settings, routing channels, and loop levels here."}),n.jsxs("div",{style:{display:"flex",gap:"8px"},children:[n.jsx(o,{variant:"primary",style:{padding:"8px 16px"},children:"Edit Settings"}),n.jsx(o,{variant:"outline",style:{padding:"8px 16px"},children:"Mute Track"})]})]})},e={args:{style:{padding:"24px",maxWidth:"400px",border:"1px solid rgba(167, 139, 250, 0.3)",background:"rgba(167, 139, 250, 0.05)"}},render:a=>n.jsxs(t,{...a,children:[n.jsx(s,{style:{fontSize:"18px",color:"#a78bfa",marginBottom:"8px"},children:"Premium Card"}),n.jsx(i,{style:{fontSize:"14px",color:"rgba(255,255,255,0.7)"},children:"This card uses a custom border and subtle glowing background to indicate an active state."})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    style: {
      padding: "20px",
      maxWidth: "400px"
    }
  },
  render: args => <Card {...args}>
      <Heading style={{
      fontSize: "18px",
      marginBottom: "8px"
    }}>Track Title</Heading>
      <Text style={{
      fontSize: "14px",
      color: "rgba(255,255,255,0.6)",
      marginBottom: "16px"
    }}>
        Configure track settings, routing channels, and loop levels here.
      </Text>
      <div style={{
      display: "flex",
      gap: "8px"
    }}>
        <Button variant="primary" style={{
        padding: "8px 16px"
      }}>
          Edit Settings
        </Button>
        <Button variant="outline" style={{
        padding: "8px 16px"
      }}>
          Mute Track
        </Button>
      </div>
    </Card>
}`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    style: {
      padding: "24px",
      maxWidth: "400px",
      border: "1px solid rgba(167, 139, 250, 0.3)",
      background: "rgba(167, 139, 250, 0.05)"
    }
  },
  render: args => <Card {...args}>
      <Heading style={{
      fontSize: "18px",
      color: "#a78bfa",
      marginBottom: "8px"
    }}>
        Premium Card
      </Heading>
      <Text style={{
      fontSize: "14px",
      color: "rgba(255,255,255,0.7)"
    }}>
        This card uses a custom border and subtle glowing background to indicate an active state.
      </Text>
    </Card>
}`,...e.parameters?.docs?.source}}};const c=["Default","BorderedOrCustomBackground"];export{e as BorderedOrCustomBackground,r as Default,c as __namedExportsOrder,x as default};
