import { IconBase, IconProps } from "../IconBase";

export function GainIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="7" />
      <path d="M12 12l4-4" />
    </IconBase>
  );
}
