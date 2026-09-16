export default function Crown({ className, filled = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.6}
    >
      <path d="M3 8l4 3 5-6 5 6 4-3-2 10H5L3 8z" strokeLinejoin="round" />
      <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
