export default function GridMasonry(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="800"
      height="800"
      fill="currentColor"
      viewBox="0 0 16 16"
      {...props}
    >
      <path d="M7 1H1v4h6V1zM7 7H1v8h6V7zM9 1h6v8H9V1zM15 11H9v4h6v-4z"></path>
    </svg>
  );
}
