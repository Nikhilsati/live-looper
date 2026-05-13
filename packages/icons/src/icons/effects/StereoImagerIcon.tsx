import { IconBase, IconProps } from "../IconBase";

export function StereoImagerIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M5 12a7 7 0 0 1 14 0" />
      <path d="M2 12a10 10 0 0 1 20 0" />
    </IconBase>
  );
}
