import { IconBase, IconProps } from "../IconBase";

export function ReverbIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 21h18v-12a9 9 0 0 0-18 0v12z" />
      <path d="M7 12h10" style={{ opacity: 0.3 }} />
      <path d="M5 15h14" style={{ opacity: 0.2 }} />
      <path d="M9 9h6" style={{ opacity: 0.4 }} />
    </IconBase>
  );
}
