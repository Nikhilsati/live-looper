import { IconBase, IconProps } from "../IconBase";

export function TimeSignatureIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M8 7h4" />
      <path d="M8 17h4" />
      <line x1="14" y1="5" x2="14" y2="19" />
    </IconBase>
  );
}
