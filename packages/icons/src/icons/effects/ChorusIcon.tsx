import { IconBase, IconProps } from "../IconBase";

export function ChorusIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M2 12c4-6 8-6 12 0s8 6 12 0" />
      <path d="M2 15c4-6 8-6 12 0s8 6 12 0" style={{ opacity: 0.5 }} />
      <path d="M2 9c4-6 8-6 12 0s8 6 12 0" style={{ opacity: 0.5 }} />
    </IconBase>
  );
}
