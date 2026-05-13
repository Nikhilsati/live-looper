import { IconBase, IconProps } from "../IconBase";

export function BounceIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 4v12" />
      <path d="M8 12l4 4 4-4" />
      <path d="M4 20h16" />
    </IconBase>
  );
}
