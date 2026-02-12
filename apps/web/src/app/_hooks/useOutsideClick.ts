import { useEffect, useRef, RefObject } from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 */
export function useOutsideClick<T extends HTMLElement>(
  handler: () => void,
  listenCapturing = true
): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(
    function () {
      function handleClick(e: MouseEvent | TouchEvent) {
        if (ref.current && !ref.current.contains(e.target as Node)) {
          handler();
        }
      }

      document.addEventListener("click", handleClick, listenCapturing);

      return () =>
        document.removeEventListener("click", handleClick, listenCapturing);
    },
    [handler, listenCapturing]
  );

  return ref;
}

/**
 * Hook that alerts clicks outside of an array of refs
 */
export function useClickOutside(
  refs: RefObject<HTMLElement | null>[],
  handler: () => void,
  enabled = true,
  listenCapturing = true
) {
  useEffect(() => {
    if (!enabled) return;

    function handleClick(e: MouseEvent | TouchEvent) {
      const isOutside = refs.every(
        (ref) => ref.current && !ref.current.contains(e.target as Node)
      );

      if (isOutside) {
        handler();
      }
    }

    document.addEventListener("mousedown", handleClick, listenCapturing);
    return () =>
      document.removeEventListener("mousedown", handleClick, listenCapturing);
  }, [refs, handler, enabled, listenCapturing]);
}