export function SVGSortByTime(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="800"
      height="800"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
        d="M10 7H2M8 12H2M10 17H2"
      ></path>
      <circle cx="17" cy="12" r="5" stroke="currentColor" strokeWidth="1.5"></circle>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M17 10v1.846L18 13"
      ></path>
    </svg>
  );
}
