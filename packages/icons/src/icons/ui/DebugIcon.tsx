import { IconBase, IconProps } from "../IconBase";

export function DebugIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="6" y="8" width="12" height="13" rx="2" />
      <path d="M9 11v3" />
      <path d="M15 11v3" />
      <path d="M6 13H4" />
      <path d="M20 13h-2" />
      <path d="M6 17H4" />
      <path d="M20 17h-2" />
      <path d="M6 9l-2-2" />
      <path d="M20 9l-2-2" />
      <path d="M12 5V2" />
      <path d="M12 8a3 3 0 0 1-3-3" />
      <path d="M12 8a3 3 0 0 0 3-3" />
    </IconBase>
  );
}
