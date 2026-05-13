import { IconBase, IconProps } from "../IconBase";

export function GlueIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="8" width="7" height="8" rx="2" />
      <rect x="14" y="8" width="7" height="8" rx="2" />
      <path d="M10 12h4" />
    </IconBase>
  );
}
