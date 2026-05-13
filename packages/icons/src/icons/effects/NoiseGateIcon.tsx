import { IconBase, IconProps } from "../IconBase";

export function NoiseGateIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 12h4l2-9l3 18l3-9h9" />
      <line x1="8" y1="7" x2="16" y2="7" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </IconBase>
  );
}
