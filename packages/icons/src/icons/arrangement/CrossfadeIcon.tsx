import { IconBase, IconProps } from "../IconBase";

export function CrossfadeIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 18c4 0 8-8 16-8" />
      <path d="M4 10c8 0 12 8 16 8" />
    </IconBase>
  );
}
