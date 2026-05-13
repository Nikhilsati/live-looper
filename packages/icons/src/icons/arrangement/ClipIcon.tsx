import { IconBase, IconProps } from "../IconBase";

export function ClipIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="6" width="18" height="12" rx="3" />
      <path d="M6 12h2l1-3 2 6 2-4 1 2h4" />
    </IconBase>
  );
}
