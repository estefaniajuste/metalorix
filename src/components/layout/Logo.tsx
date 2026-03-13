export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient
          id="logo-grad"
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#D6B35A" />
          <stop offset="100%" stopColor="#B8943A" />
        </linearGradient>
      </defs>
      <rect
        x="0"
        y="2"
        width="28"
        height="28"
        rx="6"
        fill="url(#logo-grad)"
        opacity=".12"
      />
      <path
        d="M6 22V12l5 6.5L16 12v10"
        stroke="url(#logo-grad)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M18 18l4-6 4 6"
        stroke="url(#logo-grad)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="22" cy="11" r="1.5" fill="#D6B35A" />
      <text
        x="36"
        y="22"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="18"
        fontWeight="700"
        fill="currentColor"
      >
        Metalorix
      </text>
    </svg>
  );
}
