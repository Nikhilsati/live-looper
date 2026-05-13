import { IconBase, IconProps } from "../IconBase";

export function SpliceIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M8 4l8 16" />
      <path d="M16 4L8 20" />
    </IconBase>
  );
}
