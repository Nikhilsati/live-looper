import { IconBase, IconProps } from "../IconBase";

export function QuantizeIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 4h16v16H4z" />
      <path d="M8 4v16" />
      <path d="M16 4v16" />
      <path d="M4 8h16" />
      <path d="M4 16h16" />
    </IconBase>
  );
}
