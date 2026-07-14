import { useEffect } from "react";

/**
 * Prevent text selection when performing multiple row selection with "shift" + click
 */
export default function usePreventShiftTextSelect() {
  useEffect(() => {
    const handleEvent = (e: Event) => {
      const keyboardEvent = e as KeyboardEvent;
      document.onselectstart = function () {
        return !(keyboardEvent.key === "Shift" && keyboardEvent.shiftKey);
      };
    };

    ["keyup", "keydown"].forEach((event) => {
      window.addEventListener(event, handleEvent);
    });

    return () => {
      ["keyup", "keydown"].forEach((event) => {
        window.removeEventListener(event, handleEvent);
      });
    };
  }, []);
}
