import { IconBase, IconProps } from "../IconBase";

export function StereoIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="8" cy="12" r="2" />
      <circle cx="16" cy="12" r="2" />
      <path d="M10 12h4" />
    </IconBase>
  );
}
