import{B as m}from"./index-D0kj-WeA.js";import"./iframe-2M05zz56.js";import"./preload-helper-PPVm8Dsz.js";const{expect:p}=__STORYBOOK_MODULE_TEST__,y={title:"UI/Button",component:m,tags:["ai-generated"],argTypes:{variant:{control:"select",options:["primary","success","danger","warning","accent","ghost","active-primary","active-warning","outline"]},size:{control:"select",options:["sm","md","lg","none"]},disabled:{control:"boolean"}},args:{children:"Button Text",variant:"primary",size:"none",disabled:!1}},r={args:{variant:"primary",children:"Primary Button"}},e={args:{variant:"success",children:"Success Button"}},a={args:{variant:"danger",children:"Danger Button"}},n={args:{variant:"warning",children:"Warning Button"}},s={args:{variant:"accent",children:"Accent Button"}},t={args:{variant:"ghost",children:"Ghost Button"}},o={args:{variant:"outline",children:"Outline Button"}},c={args:{size:"sm",children:"Small Button"}},i={args:{disabled:!0,children:"Disabled Button"}},d={args:{variant:"primary",children:"Style Check"},play:async({canvas:u})=>{const l=u.getByRole("button",{name:/style check/i});await p(getComputedStyle(l).borderRadius).toBe("12px")}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "primary",
    children: "Primary Button"
  }
}`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "success",
    children: "Success Button"
  }
}`,...e.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "danger",
    children: "Danger Button"
  }
}`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "warning",
    children: "Warning Button"
  }
}`,...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "accent",
    children: "Accent Button"
  }
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "ghost",
    children: "Ghost Button"
  }
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "outline",
    children: "Outline Button"
  }
}`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    size: "sm",
    children: "Small Button"
  }
}`,...c.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    children: "Disabled Button"
  }
}`,...i.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "primary",
    children: "Style Check"
  },
  play: async ({
    canvas
  }) => {
    const button = canvas.getByRole("button", {
      name: /style check/i
    });
    // Verify that the border radius from UI.css is loaded (12px)
    await expect(getComputedStyle(button).borderRadius).toBe("12px");
  }
}`,...d.parameters?.docs?.source}}};const S=["Primary","Success","Danger","Warning","Accent","Ghost","Outline","Small","Disabled","CssCheck"];export{s as Accent,d as CssCheck,a as Danger,i as Disabled,t as Ghost,o as Outline,r as Primary,c as Small,e as Success,n as Warning,S as __namedExportsOrder,y as default};
