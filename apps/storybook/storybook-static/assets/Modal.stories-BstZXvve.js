import{M as a,j as n,B as s,C as o,H as i,T as l}from"./index-sm5rAtOb.js";import{r as p}from"./iframe-BQs9XC90.js";import"./preload-helper-PPVm8Dsz.js";const g={title:"UI/Modal",component:a},t={render:()=>{const[r,e]=p.useState(!1);return n.jsxs("div",{style:{padding:"40px",minHeight:"300px"},children:[n.jsx(s,{variant:"primary",onClick:()=>e(!0),style:{padding:"10px 20px"},children:"Open Dialog Modal"}),r&&n.jsx(a,{onClose:()=>e(!1),children:n.jsxs(o,{style:{width:"420px",padding:"24px",border:"1px solid var(--border)",boxShadow:"0 20px 25px -5px rgba(0, 0, 0, 0.5)"},children:[n.jsx(i,{style:{fontSize:"20px",marginBottom:"12px"},children:"Confirm Session Clear"}),n.jsx(l,{style:{fontSize:"14px",color:"rgba(255, 255, 255, 0.6)",marginBottom:"24px",lineHeight:"1.5"},children:"Are you sure you want to clear your current recording session? All unsaved tracks and planned timelines will be permanently lost."}),n.jsxs("div",{style:{display:"flex",justifyContent:"flex-end",gap:"12px"},children:[n.jsx(s,{variant:"ghost",onClick:()=>e(!1),style:{padding:"8px 16px"},children:"Cancel"}),n.jsx(s,{variant:"danger",onClick:()=>e(!1),style:{padding:"8px 16px"},children:"Clear Session"})]})]})})]})}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return <div style={{
      padding: "40px",
      minHeight: "300px"
    }}>
        <Button variant="primary" onClick={() => setIsOpen(true)} style={{
        padding: "10px 20px"
      }}>
          Open Dialog Modal
        </Button>

        {isOpen && <Modal onClose={() => setIsOpen(false)}>
            <Card style={{
          width: "420px",
          padding: "24px",
          border: "1px solid var(--border)",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)"
        }}>
              <Heading style={{
            fontSize: "20px",
            marginBottom: "12px"
          }}>
                Confirm Session Clear
              </Heading>
              <Text style={{
            fontSize: "14px",
            color: "rgba(255, 255, 255, 0.6)",
            marginBottom: "24px",
            lineHeight: "1.5"
          }}>
                Are you sure you want to clear your current recording session? All unsaved tracks and
                planned timelines will be permanently lost.
              </Text>
              <div style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px"
          }}>
                <Button variant="ghost" onClick={() => setIsOpen(false)} style={{
              padding: "8px 16px"
            }}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={() => setIsOpen(false)} style={{
              padding: "8px 16px"
            }}>
                  Clear Session
                </Button>
              </div>
            </Card>
          </Modal>}
      </div>;
  }
}`,...t.parameters?.docs?.source}}};const u=["Interactive"];export{t as Interactive,u as __namedExportsOrder,g as default};
