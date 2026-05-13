import { IconBase, IconProps } from "../IconBase";

export function FreezeTrackIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3v18" />
      <path d="M7 7l10 10" />
      <path d="M17 7L7 17" />
    </IconBase>
  );
}
