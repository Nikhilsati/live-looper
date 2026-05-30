import{C as t,j as n,H as o,T as i,B as s}from"./index-D0kj-WeA.js";import"./iframe-2M05zz56.js";import"./preload-helper-PPVm8Dsz.js";const g={title:"UI/Card",component:t,tags:["ai-generated"]},e={args:{style:{padding:"20px",maxWidth:"400px"}},render:a=>n.jsxs(t,{...a,children:[n.jsx(o,{style:{fontSize:"18px",marginBottom:"8px"},children:"Track Title"}),n.jsx(i,{style:{fontSize:"14px",color:"rgba(255,255,255,0.6)",marginBottom:"16px"},children:"Configure track settings, routing channels, and loop levels here."}),n.jsxs("div",{style:{display:"flex",gap:"8px"},children:[n.jsx(s,{variant:"primary",style:{padding:"8px 16px"},children:"Edit Settings"}),n.jsx(s,{variant:"outline",style:{padding:"8px 16px"},children:"Mute Track"})]})]})},r={args:{style:{padding:"24px",maxWidth:"400px",border:"1px solid rgba(167, 139, 250, 0.3)",background:"rgba(167, 139, 250, 0.05)"}},render:a=>n.jsxs(t,{...a,children:[n.jsx(o,{style:{fontSize:"18px",color:"#a78bfa",marginBottom:"8px"},children:"Premium Card"}),n.jsx(i,{style:{fontSize:"14px",color:"rgba(255,255,255,0.7)"},children:"This card uses a custom border and subtle glowing background to indicate an active state."})]})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
}`,...r.parameters?.docs?.source}}};const x=["Default","BorderedOrCustomBackground"];export{r as BorderedOrCustomBackground,e as Default,x as __namedExportsOrder,g as default};
