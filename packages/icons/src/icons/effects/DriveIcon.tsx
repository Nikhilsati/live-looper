import { IconBase, IconProps } from "../IconBase";

export function DriveIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M13 2l-2 8h7l-8 12l2-8h-7l8-12" />
      <path d="M5 14h2" />
      <path d="M17 10h2" />
    </IconBase>
  );
}
