import { IconBase, IconProps } from "../IconBase";

export function MonoIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="4" />
    </IconBase>
  );
}
