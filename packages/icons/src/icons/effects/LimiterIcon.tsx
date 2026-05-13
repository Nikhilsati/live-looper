import { IconBase, IconProps } from "../IconBase";

export function LimiterIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 18V9" />
      <path d="M5 9h10" />
      <path d="M15 9v9" />
    </IconBase>
  );
}
