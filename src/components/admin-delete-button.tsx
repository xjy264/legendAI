"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";

function getPopoverPosition(button: HTMLButtonElement) {
  const rect = button.getBoundingClientRect();
  const above = rect.top > 180;
  return {
    top: above ? rect.top : rect.bottom,
    left: rect.right,
    above,
  };
}

export function AdminDeleteButton({
  slug,
  query,
  page,
  label,
  confirmLabel,
  cancelLabel,
  promptLabel,
}: {
  slug: string;
  query: string;
  page: number;
  label: string;
  confirmLabel: string;
  cancelLabel: string;
  promptLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number; above: boolean } | null>(
    null,
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const updatePosition = () => {
      const button = buttonRef.current;
      if (!button) {
        return;
      }

      setPosition(getPopoverPosition(button));
    };

    updatePosition();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      const root = rootRef.current;
      const popover = popoverRef.current;
      const target = event.target as Node;

      if ((root && root.contains(target)) || (popover && popover.contains(target))) {
        return;
      }

      setOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  function openPopover() {
    const button = buttonRef.current;
    if (!button) {
      setOpen(true);
      return;
    }

    setPosition(getPopoverPosition(button));
    setOpen(true);
  }

  return (
    <div ref={rootRef} className="inline-flex">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          if (open) {
            setOpen(false);
            return;
          }

          openPopover();
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-100"
      >
        {label}
      </button>

      {open && position && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={popoverRef}
              role="dialog"
              aria-modal="false"
              aria-label={label}
              className="fixed z-50 w-44 max-w-[calc(100vw-1rem)]"
              style={{
                top: position.top,
                left: position.left,
                transform: position.above
                  ? "translate(-100%, calc(-100% - 6px))"
                  : "translate(-100%, 6px)",
              }}
            >
              <div className="grid gap-2 rounded-xl border border-black/10 bg-white px-3 py-2.5 shadow-[0_16px_40px_rgba(15,23,42,0.18)]">
                <p className="text-xs leading-5 text-slate-700">{promptLabel}</p>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-md border border-black/10 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:border-emerald-200 hover:text-emerald-800"
                  >
                    {cancelLabel}
                  </button>
                  <form action={`/api/admin/posts/${encodeURIComponent(slug)}`} method="post">
                    <input type="hidden" name="q" value={query} />
                    <input type="hidden" name="page" value={page} />
                    <button
                      type="submit"
                      className="rounded-md bg-rose-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-rose-700"
                    >
                      {confirmLabel}
                    </button>
                  </form>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
