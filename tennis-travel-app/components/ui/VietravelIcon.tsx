interface VietravelIconProps {
  id: string;
  size?: number;
  className?: string;
  "aria-hidden"?: boolean;
  style?: React.CSSProperties;
}

export default function VietravelIcon({
  id,
  size = 20,
  className = "",
  "aria-hidden": ariaHidden = true,
  style,
}: VietravelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      aria-hidden={ariaHidden}
      style={style}
    >
      <use href={`/sprites/common-extended.svg#${id}`} />
    </svg>
  );
}
