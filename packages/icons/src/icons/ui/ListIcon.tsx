import { IconBase, IconProps } from "../IconBase";

export function ListIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <line x1="9" y1="6" x2="20" y2="6" />
      <line x1="9" y1="12" x2="20" y2="12" />
      <line x1="9" y1="18" x2="20" y2="18" />
      <path d="M5 6v.01" />
      <path d="M5 12v.01" />
      <path d="M5 18v.01" />
    </IconBase>
  );
}
