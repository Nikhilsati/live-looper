import { IconBase, IconProps } from "../IconBase";

export function CompressorIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        d="M4 20L10 14L16 12L20 12"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 14l6-6" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
      <polyline points="4 4 4 20 20 20" strokeWidth="1" opacity="0.3" />
    </IconBase>
  );
}
