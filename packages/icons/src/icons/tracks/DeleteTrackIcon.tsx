import { IconBase, IconProps } from "../IconBase";

export function DeleteTrackIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <rect x="6" y="7" width="12" height="13" rx="2" />
    </IconBase>
  );
}
