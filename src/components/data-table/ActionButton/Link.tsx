import { SVGLink } from "../../icons/svg-repo/SVGLink";

export default function LinkButton() {
  return (
    <>
      <button className="group flex flex-col items-center gap-y-1 disabled:cursor-not-allowed">
        <div className="flex size-5.5 items-center justify-center text-erp-blue-11 group-disabled:text-erp-gray-5">
          <SVGLink />
        </div>
        <span className="text-[11px] font-medium leading-none group-disabled:text-erp-gray-5">
          Share Link
        </span>
      </button>
    </>
  );
}
