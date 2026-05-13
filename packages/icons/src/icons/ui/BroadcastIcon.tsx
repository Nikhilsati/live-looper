import { IconBase, IconProps } from "../IconBase";

export function BroadcastIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M16.24 7.76a6 6 0 0 1 0 8.49" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M7.76 7.76a6 6 0 0 0 0 8.49" />
      <path d="M4.93 4.93a10 10 0 0 0 0 14.14" />
    </IconBase>
  );
}
