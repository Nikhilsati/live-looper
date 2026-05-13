import { SVGProps } from "react";

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: string | number;
}

export function IconBase({
  children,
  width,
  height,
  size = 24,
  ...props
}: IconProps) {
  const w = width ?? size;
  const h = height ?? size;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={w}
      height={h}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}
