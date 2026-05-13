import { IconBase, IconProps } from "../IconBase";

export function TremoloIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M2 12h2l2-4l4 8l4-8l4 8l2-4h2" />
      <path d="M6 12h12" style={{ opacity: 0.3 }} />
    </IconBase>
  );
}
