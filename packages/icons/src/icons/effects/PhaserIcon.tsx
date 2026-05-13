import { IconBase, IconProps } from "../IconBase";

export function PhaserIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" style={{ opacity: 0.5 }} />
      <path d="M12 3v18" />
      <path d="M3 12h18" />
    </IconBase>
  );
}
