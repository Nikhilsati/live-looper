import { IconBase, IconProps } from "../IconBase";

export function TempoIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M10 4v10" />
      <circle cx="10" cy="17" r="3" fill="currentColor" stroke="none" />
      <path d="M14 7h5" />
      <path d="M14 11h5" />
    </IconBase>
  );
}
