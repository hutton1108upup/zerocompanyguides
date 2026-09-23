"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { startTransition, useEffect, useEffectEvent, useRef, useState } from "react";
import { ChevronRightIcon, CloseIcon, MenuIcon, SearchIcon } from "@/components/icons";
import { SiteSearch } from "@/components/site-search";
import { getNavigationGroup, getPublicNavigationGroups, siteUtilityLinks } from "@/lib/site";
import { trapDialogFocus } from "@/lib/focus";

const groups = getPublicNavigationGroups();

type DrawerFocusRestore = "keyboard" | "none" | "pointer";

export function SiteHeader() {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const activeGroup = getNavigationGroup(pathname)?.id;
  const drawerCloseRef = useRef<HTMLButtonElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const drawerTriggerRef = useRef<HTMLButtonElement | null>(null);
  const restoreDrawerFocusRef = useRef<DrawerFocusRestore>("none");
  const navigationRef = useRef<HTMLElement | null>(null);
  const groupTriggers = useRef<Record<string, HTMLButtonElement | null>>({});

  const openDrawer = () => {
    restoreDrawerFocusRef.current = "none";
    startTransition(() => {
      setMobileGroup(activeGroup ?? null);
      setIsDrawerOpen(true);
    });
  };

  const closeDrawer = (restoreFocus: DrawerFocusRestore = "keyboard") => {
    restoreDrawerFocusRef.current = restoreFocus;
    startTransition(() => {
      setIsDrawerOpen(false);
    });
  };

  const closeNavigation = () => startTransition(() => setOpenGroup(null));
  const openDrawerSearch = () => {
    closeDrawer("none");
    requestAnimationFrame(() => {
      document.querySelector<HTMLButtonElement>(".site-header .search-trigger")?.click();
    });
  };

  const handleGlobalKeys = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === "Escape" && isDrawerOpen) {
      event.preventDefault();
      closeDrawer("keyboard");
      return;
    }

    if (isDrawerOpen && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      openDrawerSearch();
      return;
    }

    if (isDrawerOpen) {
      trapDialogFocus(event, drawerRef.current);
      return;
    }

    if (event.key === "Escape" && openGroup) {
      event.preventDefault();
      const trigger = groupTriggers.current[openGroup];
      closeNavigation();
      requestAnimationFrame(() => trigger?.focus());
    }
  });

  useEffect(() => {
    const listener = (event: KeyboardEvent) => handleGlobalKeys(event);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  useEffect(() => {
    closeDrawer("none");
    closeNavigation();
  }, [pathname]);

  useEffect(() => {
    if (!openGroup) return;

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!navigationRef.current?.contains(event.target as Node)) {
        closeNavigation();
      }
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, [openGroup]);

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

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 1040px)");
    const onResize = () => {
      closeNavigation();
      if (!mobile.matches) closeDrawer("none");
    };
    mobile.addEventListener("change", onResize);
    return () => mobile.removeEventListener("change", onResize);
  }, []);

  return (
    <>
      <header className="site-header">
        <div className="container site-header__inner">
          <Link aria-label="Zero Company Intel home" className="site-logo" href="/">
            <span className="site-logo__gold">Zero</span>
            <span className="site-logo__cyan">Company</span>
            <span className="site-logo__gold">Intel</span>
          </Link>
          <nav aria-label="Primary site navigation" className="site-nav" ref={navigationRef}>
            {groups.map((group) => {
              const active = activeGroup === group.id;
              const expanded = openGroup === group.id;
              return (
                <div className="site-nav__group" key={group.id}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) closeNavigation();
                  }}>
                  <Link className="site-nav__link" href={group.path} data-active={active}
                    aria-current={pathname === group.path ? "page" : active ? "location" : undefined}
                    onClick={closeNavigation}>{group.label}</Link>
                  <button type="button" className="site-nav__toggle"
                    aria-label={`Expand ${group.label} navigation`}
                    aria-controls={`desktop-nav-${group.id}`} aria-expanded={expanded}
                    ref={(element) => { groupTriggers.current[group.id] = element; }}
                    onClick={() => setOpenGroup(expanded ? null : group.id)}>
                    <ChevronRightIcon height={14} width={14} />
                  </button>
                  <div className="site-nav__dropdown" id={`desktop-nav-${group.id}`} hidden={!expanded}>
                    <p className="site-nav__dropdown-label">{group.label}</p>
                    {group.links.map((link) => (
                      <Link className="site-nav__dropdown-link" href={link.href} key={link.href}
                        aria-current={pathname === link.href ? "page" : undefined}
                        tabIndex={expanded ? 0 : -1} onClick={closeNavigation}>{link.label}</Link>
                    ))}
                    <Link className="site-nav__dropdown-link site-nav__overview" href={group.path}
                      tabIndex={expanded ? 0 : -1} onClick={closeNavigation}>View all {group.label}</Link>
                  </div>
                </div>
              );
            })}
          </nav>
          <div className="site-header__tools">
            <Link className="site-tool-link" href="/squad-builder" data-active={pathname === "/squad-builder"}
              aria-current={pathname === "/squad-builder" ? "page" : undefined}>Squad Builder</Link>
            <SiteSearch onOpen={() => { closeNavigation(); closeDrawer("none"); }} />
            <button aria-controls="mobile-navigation" aria-expanded={isDrawerOpen}
              aria-label="Open mobile navigation" className="drawer-toggle" onClick={openDrawer}
              onBlur={(event) => delete event.currentTarget.dataset.focusOrigin} ref={drawerTriggerRef} type="button">
              <MenuIcon height={20} width={20} />
            </button>
          </div>
        </div>
      </header>
      {isDrawerOpen ? (
        <>
          <button aria-label="Close mobile navigation" className="drawer-backdrop"
            onClick={() => closeDrawer("pointer")} tabIndex={-1} type="button" />
          <div aria-label="Site navigation" aria-modal="true" className="mobile-drawer"
            id="mobile-navigation" ref={drawerRef} role="dialog" tabIndex={-1}>
            <div className="mobile-drawer__panel">
              <div className="mobile-drawer__header">
                <span className="mobile-drawer__label">Browse Zero Company</span>
                <button aria-label="Close mobile navigation" className="icon-button"
                  onClick={(event) => closeDrawer(event.detail === 0 ? "keyboard" : "pointer")}
                  ref={drawerCloseRef} type="button"><CloseIcon height={18} width={18} /></button>
              </div>
              <div className="mobile-drawer__tools">
                <button className="mobile-drawer__search" type="button" onClick={openDrawerSearch}>
                  <SearchIcon height={18} width={18} /> Search guides and tasks
                </button>
                <Link className="site-tool-link" href="/squad-builder" onClick={() => closeDrawer("none")}
                  aria-current={pathname === "/squad-builder" ? "page" : undefined}>Open Squad Builder</Link>
              </div>
              {groups.map((group) => {
                const expanded = mobileGroup === group.id;
                return (
                  <section className="mobile-drawer__group" key={group.id}>
                    <div className="mobile-drawer__group-heading">
                      <Link href={group.path} className="mobile-drawer__category" data-active={activeGroup === group.id}
                        aria-current={pathname === group.path ? "page" : activeGroup === group.id ? "location" : undefined}
                        onClick={() => closeDrawer("none")}>{group.label}</Link>
                      <button type="button" className="site-nav__toggle" aria-expanded={expanded}
                        aria-controls={`mobile-nav-${group.id}`} aria-label={`Expand ${group.label} navigation`}
                        onClick={() => setMobileGroup(expanded ? null : group.id)}>
                        <ChevronRightIcon height={16} width={16} />
                      </button>
                    </div>
                    <div id={`mobile-nav-${group.id}`} className="mobile-drawer__links" hidden={!expanded}>
                      {group.links.map((link) => (
                        <Link className="mobile-drawer__link" href={link.href} key={link.href}
                          aria-current={pathname === link.href ? "page" : undefined}
                          data-active={pathname === link.href} onClick={() => closeDrawer("none")}>{link.label}</Link>
                      ))}
                    </div>
                  </section>
                );
              })}
              <div className="mobile-drawer__utility">
                {siteUtilityLinks.map((link) => <Link href={link.href} key={link.href}
                  onClick={() => closeDrawer("none")}>{link.label}</Link>)}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
