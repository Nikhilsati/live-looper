import { IconBase, IconProps } from "../IconBase";

export function PanRightIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M10 6l6 6-6 6" />
      <line x1="4" y1="12" x2="15" y2="12" />
    </IconBase>
  );
}
