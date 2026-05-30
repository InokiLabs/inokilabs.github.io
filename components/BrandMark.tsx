/**
 * Inoki Labs mark: a precision crosshair locating a single break point on a
 * boundary contour — the company's whole thesis in one glyph.
 */
export function BrandMark({
  size = 22,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10.5" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      {/* failure-boundary contour */}
      <path
        d="M2 15.5C5.5 15.5 6.5 7.5 12 7.5C17.5 7.5 18.5 15.5 22 15.5"
        stroke="currentColor"
        strokeWidth="1.1"
        opacity="0.65"
      />
      {/* crosshair on the break point */}
      <path d="M12 4.5V19.5M4.5 12H19.5" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <circle cx="12" cy="12" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="12" cy="12" r="0.9" fill="currentColor" />
    </svg>
  );
}
