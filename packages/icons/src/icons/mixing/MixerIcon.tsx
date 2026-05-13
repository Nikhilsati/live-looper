import { IconBase, IconProps } from "../IconBase";

export function MixerIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <line x1="6" y1="4" x2="6" y2="20" />
      <circle cx="6" cy="9" r="2" fill="currentColor" stroke="none" />

      <line x1="12" y1="4" x2="12" y2="20" />
      <circle cx="12" cy="15" r="2" fill="currentColor" stroke="none" />

      <line x1="18" y1="4" x2="18" y2="20" />
      <circle cx="18" cy="7" r="2" fill="currentColor" stroke="none" />
    </IconBase>
  );
}
