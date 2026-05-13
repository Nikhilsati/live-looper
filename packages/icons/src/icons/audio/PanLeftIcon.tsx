import { IconBase, IconProps } from "../IconBase";

export function PanLeftIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M14 6l-6 6 6 6" />
      <line x1="20" y1="12" x2="9" y2="12" />
    </IconBase>
  );
}
