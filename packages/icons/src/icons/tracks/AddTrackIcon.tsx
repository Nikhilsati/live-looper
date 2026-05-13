import { IconBase, IconProps } from "../IconBase";

export function AddTrackIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 12h8" />
      <path d="M7 8v8" />
      <path d="M14 12h2l1-4 2 8 1-4h1" />
    </IconBase>
  );
}
