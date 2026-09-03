"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { startTransition, useEffect, useEffectEvent, useRef, useState } from "react";
import { contentPages } from "@/content/pages";
import { ChevronRightIcon, CloseIcon, MenuIcon } from "@/components/icons";
import { SiteSearch } from "@/components/site-search";
import {
  footerNavigationSections,
  moreNavigationSections,
  primaryNavigationPaths,
} from "@/lib/site";
import { trapDialogFocus } from "@/lib/focus";

type NavLink = {
  href: string;
  label: string;
};

type NavSection = {
  title: string;
  links: NavLink[];
};

const pageByPath = new Map(contentPages.map((page) => [page.path, page]));

function toNavLinks(paths: readonly string[]): NavLink[] {
  return paths.flatMap((path) => {
    const page = pageByPath.get(path);
    return page ? [{ href: path, label: page.navLabel }] : [];
  });
}

const primaryLinks = toNavLinks(primaryNavigationPaths);
const primaryPathSet = new Set<string>(primaryNavigationPaths);
const moreSections: NavSection[] = moreNavigationSections.map((section) => ({
  title: section.title,
  links: toNavLinks(section.paths),
}));
const moreLinks = moreSections.flatMap((section) => section.links);
const mobileSections: NavSection[] = footerNavigationSections
  .map((section) => ({
    title: section.title,
    links: toNavLinks(section.paths.filter((path) => !primaryPathSet.has(path))),
  }))
  .filter((section) => section.links.length > 0);

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

type DrawerFocusRestore = "keyboard" | "none" | "pointer";

export function SiteHeader() {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const drawerCloseRef = useRef<HTMLButtonElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const drawerTriggerRef = useRef<HTMLButtonElement | null>(null);
  const restoreDrawerFocusRef = useRef<DrawerFocusRestore>("none");
  const moreNavigationRef = useRef<HTMLDivElement | null>(null);
  const moreTriggerRef = useRef<HTMLButtonElement | null>(null);

  const openDrawer = () => {
    restoreDrawerFocusRef.current = "none";
    startTransition(() => {
      setIsDrawerOpen(true);
    });
  };

  const closeDrawer = (restoreFocus: DrawerFocusRestore = "keyboard") => {
    restoreDrawerFocusRef.current = restoreFocus;
    startTransition(() => {
      setIsDrawerOpen(false);
    });
  };

  const closeMoreNavigation = () => {
    startTransition(() => {
      setIsMoreOpen(false);
    });
  };

  const toggleMoreNavigation = () => {
    startTransition(() => {
      setIsMoreOpen((isOpen) => !isOpen);
    });
  };

  const handleGlobalKeys = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === "Escape" && isDrawerOpen) {
      event.preventDefault();
      closeDrawer("keyboard");
      return;
    }

    if (isDrawerOpen) {
      trapDialogFocus(event, drawerRef.current);
      return;
    }

    if (event.key === "Escape" && isMoreOpen) {
      event.preventDefault();
      closeMoreNavigation();
      requestAnimationFrame(() => moreTriggerRef.current?.focus());
    }
  });

  useEffect(() => {
    const listener = (event: KeyboardEvent) => handleGlobalKeys(event);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  useEffect(() => {
    closeDrawer("none");
    closeMoreNavigation();
  }, [pathname]);

  useEffect(() => {
    if (!isMoreOpen) return;

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!moreNavigationRef.current?.contains(event.target as Node)) {
        closeMoreNavigation();
      }
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, [isMoreOpen]);

  useEffect(() => {
    if (!isDrawerOpen) return;

    const drawerTrigger = drawerTriggerRef.current;
    const previousOverflow = document.body.style.overflow;
    const background = [
      document.querySelector<HTMLElement>(".site-header"),
      document.querySelector<HTMLElement>(".site-main"),
      document.querySelector<HTMLElement>(".site-footer"),
    ].filter((element): element is HTMLElement => Boolean(element));
    const previousInert = background.map((element) => element.inert);
    document.body.style.overflow = "hidden";
    background.forEach((element) => {
      element.inert = true;
    });
    requestAnimationFrame(() => drawerCloseRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      background.forEach((element, index) => {
        element.inert = previousInert[index];
      });
      const restoreMode = restoreDrawerFocusRef.current;
      if (restoreMode !== "none") {
        requestAnimationFrame(() => {
          if (!drawerTrigger) return;
          if (restoreMode === "pointer") {
            drawerTrigger.dataset.focusOrigin = "pointer";
          } else {
            delete drawerTrigger.dataset.focusOrigin;
          }
          drawerTrigger.focus({ preventScroll: true });
        });
      }
      restoreDrawerFocusRef.current = "none";
    };
  }, [isDrawerOpen]);

  const activePrimaryPath = primaryLinks.find((link) => (
    isActivePath(pathname, link.href)
  ))?.href;
  const isMoreActive = !activePrimaryPath && moreLinks.some((link) => (
    isActivePath(pathname, link.href)
  ));

  return (
    <>
      <header className="site-header">
        <div className="container site-header__inner">
          <Link aria-label="Zero Company Intel home" className="site-logo" href="/">
            <span className="site-logo__gold">Zero</span>
            <span className="site-logo__cyan">Company</span>
            <span className="site-logo__gold">Intel</span>
          </Link>

          <nav aria-label="Primary site navigation" className="site-nav">
            {primaryLinks.map((link) => {
              const isActive = isActivePath(pathname, link.href);
              return (
                <Link
                  aria-current={pathname === link.href ? "page" : isActive ? "location" : undefined}
                  className="site-nav__link"
                  data-active={isActive}
                  href={link.href}
                  key={link.href}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="site-nav__more" ref={moreNavigationRef}>
              <button
                aria-controls="desktop-more-navigation"
                aria-expanded={isMoreOpen}
                aria-haspopup="true"
                className="site-nav__more-button"
                data-active={isMoreActive}
                onClick={toggleMoreNavigation}
                ref={moreTriggerRef}
                type="button"
              >
                More
                <ChevronRightIcon className="site-nav__more-chevron" height={15} width={15} />
              </button>

              <div
                aria-hidden={!isMoreOpen}
                className="site-nav__dropdown"
                data-open={isMoreOpen}
                id="desktop-more-navigation"
              >
                {moreSections.map((section) => (
                  <section className="site-nav__dropdown-section" key={section.title}>
                    <div className="site-nav__dropdown-label">{section.title}</div>
                    <div className="site-nav__dropdown-links">
                      {section.links.map((link) => (
                        <Link
                          aria-current={pathname === link.href ? "page" : undefined}
                          className="site-nav__dropdown-link"
                          data-active={isActivePath(pathname, link.href)}
                          href={link.href}
                          key={link.href}
                          onClick={closeMoreNavigation}
                          tabIndex={isMoreOpen ? 0 : -1}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </nav>

          <div className="site-header__tools">
            <SiteSearch />
            <button
              aria-controls="mobile-navigation"
              aria-expanded={isDrawerOpen}
              aria-label="Open mobile navigation"
              className="drawer-toggle"
              onClick={openDrawer}
              onBlur={(event) => delete event.currentTarget.dataset.focusOrigin}
              ref={drawerTriggerRef}
              type="button"
            >
              <MenuIcon height={20} width={20} />
            </button>
          </div>
        </div>
      </header>

      {isDrawerOpen ? (
        <>
          <button
            aria-label="Close mobile navigation"
            className="drawer-backdrop"
            onClick={() => closeDrawer("pointer")}
            tabIndex={-1}
            type="button"
          />
          <div
            aria-label="Site navigation"
            aria-modal="true"
            className="mobile-drawer"
            id="mobile-navigation"
            ref={drawerRef}
            role="dialog"
            tabIndex={-1}
          >
            <div className="mobile-drawer__panel">
              <div className="mobile-drawer__header">
                <div>
                  <div className="mobile-drawer__label">Site Navigation</div>
                  <div className="site-logo">
                    <span className="site-logo__gold">Zero</span>
                    <span className="site-logo__cyan">Company</span>
                    <span className="site-logo__gold">Intel</span>
                  </div>
                </div>
                <button
                  aria-label="Close mobile navigation"
                  className="icon-button"
                  onClick={(event) => closeDrawer(event.detail === 0 ? "keyboard" : "pointer")}
                  ref={drawerCloseRef}
                  type="button"
                >
                  <CloseIcon height={18} width={18} />
                </button>
              </div>

              <section className="mobile-drawer__section">
                <div className="mobile-drawer__label">Primary</div>
                <div className="mobile-drawer__links">
                  {primaryLinks.map((link) => (
                    <Link
                      aria-current={pathname === link.href ? "page" : undefined}
                      className="mobile-drawer__link"
                      data-active={isActivePath(pathname, link.href)}
                      href={link.href}
                      key={link.href}
                      onClick={() => closeDrawer("none")}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </section>

              {mobileSections.map((section) => (
                <details
                  className="mobile-drawer__group"
                  key={section.title}
                  open={section.links.some((link) => isActivePath(pathname, link.href))}
                >
                  <summary className="mobile-drawer__label">{section.title}</summary>
                  <div className="mobile-drawer__links">
                    {section.links.map((link) => (
                      <Link
                        aria-current={pathname === link.href ? "page" : undefined}
                        className="mobile-drawer__link"
                        data-active={isActivePath(pathname, link.href)}
                        href={link.href}
                        key={link.href}
                        onClick={() => closeDrawer("none")}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
