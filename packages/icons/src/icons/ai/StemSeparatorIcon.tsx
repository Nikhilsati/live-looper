import { IconBase, IconProps } from "../IconBase";

export function StemSeparatorIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 12h4" />
      <path d="M9 12h2" />
      <path d="M13 12h2" />
      <path d="M17 12h4" />
      <path d="M9 8v8" />
      <path d="M15 8v8" />
    </IconBase>
  );
}
