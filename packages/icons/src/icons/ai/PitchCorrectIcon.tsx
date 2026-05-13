import { IconBase, IconProps } from "../IconBase";

export function PitchCorrectIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="10" cy="10" r="3" />
      <path d="M13 13l6 6" />
      <path d="M17 15v4h4" />
    </IconBase>
  );
}
