import { IconBase, IconProps } from "../IconBase";

export function PauseIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect
        x="6"
        y="5"
        width="4"
        height="14"
        rx="1"
        fill="currentColor"
        stroke="none"
      />
      <rect
        x="14"
        y="5"
        width="4"
        height="14"
        rx="1"
        fill="currentColor"
        stroke="none"
      />
    </IconBase>
  );
}
