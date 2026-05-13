import { IconBase, IconProps } from "../IconBase";

export function UndoIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 7v6h6" />
      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
    </IconBase>
  );
}
