const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "summary",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (element) => {
      const closedDetails = element.closest<HTMLDetailsElement>("details:not([open])");
      const isVisibleClosedSummary =
        closedDetails && element.tagName === "SUMMARY" && element.parentElement === closedDetails;

      return (
        element.getAttribute("aria-hidden") !== "true" &&
        (!closedDetails || isVisibleClosedSummary) &&
        element.getClientRects().length > 0
      );
    },
  );
}

export function trapDialogFocus(event: KeyboardEvent, container: HTMLElement | null): boolean {
  if (event.key !== "Tab" || !container) return false;

  const focusable = getFocusableElements(container);
  if (focusable.length === 0) {
    event.preventDefault();
    container.focus();
    return true;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;

  if (!container.contains(active)) {
    event.preventDefault();
    first.focus();
    return true;
  }

  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
    return true;
  }

  if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
    return true;
  }

  return false;
}
