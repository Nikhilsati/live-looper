import { IconBase, IconProps } from "../IconBase";

export function DelayIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 16 12" />
      <path d="M18 12a6 6 0 1 0-6 6" style={{ strokeDasharray: "2 2" }} />
    </IconBase>
  );
}
