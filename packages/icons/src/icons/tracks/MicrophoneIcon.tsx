import { IconBase, IconProps } from "../IconBase";

export function MicrophoneIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="9" y="3" width="6" height="12" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <line x1="12" y1="21" x2="12" y2="22" />
    </IconBase>
  );
}
