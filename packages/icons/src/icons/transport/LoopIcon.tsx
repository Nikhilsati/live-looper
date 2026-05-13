import { IconBase, IconProps } from "../IconBase";

export function LoopIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M17 7h3V4" />
      <path d="M20 7a8 8 0 0 0-14-3" />
      <path d="M7 17H4v3" />
      <path d="M4 17a8 8 0 0 0 14 3" />
    </IconBase>
  );
}
