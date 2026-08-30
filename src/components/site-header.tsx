"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { startTransition, useEffect, useEffectEvent, useState } from "react";
import { contentPages } from "@/content/pages";
import { CloseIcon, MenuIcon } from "@/components/icons";
import { SiteSearch } from "@/components/site-search";

type NavLink = {
  href: string;
  label: string;
};

const pageByPath = new Map(contentPages.map((page) => [page.path, page]));

const primaryLinks: NavLink[] = [
  "/builds",
  "/classes",
  "/characters",
  "/walkthrough",
  "/trophy-guide",
  "/performance",
].map((path) => ({
  href: path,
  label: pageByPath.get(path)?.navLabel ?? path,
}));

const secondaryLinks: NavLink[] = [
  "/guides",
  "/guides/beginners-guide",
  "/guides/respec",
  "/game-info",
  "/system-requirements",
  "/multiplayer",
  "/performance/steam-deck",
  "/mods",
  "/worth-it",
].map((path) => ({
  href: path,
  label: pageByPath.get(path)?.navLabel ?? path,
}));

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => {
    startTransition(() => {
      setIsDrawerOpen(true);
    });
  };

  const closeDrawer = () => {
    startTransition(() => {
      setIsDrawerOpen(false);
    });
  };

  const handleGlobalKeys = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      closeDrawer();
    }
  });

  useEffect(() => {
    const listener = (event: KeyboardEvent) => handleGlobalKeys(event);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  useEffect(() => {
    closeDrawer();
  }, [pathname]);

  useEffect(() => {
    if (!isDrawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isDrawerOpen]);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link aria-label="Zero Company Intel home" className="site-logo" href="/">
          <span className="site-logo__gold">Zero</span>
          <span className="site-logo__cyan">Company</span>
          <span className="site-logo__gold">Intel</span>
        </Link>

        <nav aria-label="Primary site navigation" className="site-nav">
          {primaryLinks.map((link) => (
            <Link
              className="site-nav__link"
              data-active={isActivePath(pathname, link.href)}
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="site-header__tools">
          <SiteSearch />
          <button
            aria-controls="mobile-navigation"
            aria-expanded={isDrawerOpen}
            aria-label="Open mobile navigation"
            className="drawer-toggle"
            onClick={openDrawer}
            type="button"
          >
            <MenuIcon height={20} width={20} />
          </button>
        </div>
      </div>

      {isDrawerOpen ? (
        <>
          <button
            aria-label="Close mobile navigation"
            className="drawer-backdrop"
            onClick={closeDrawer}
            type="button"
          />
          <div className="mobile-drawer" id="mobile-navigation">
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
                  onClick={closeDrawer}
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
                      className="mobile-drawer__link"
                      data-active={isActivePath(pathname, link.href)}
                      href={link.href}
                      key={link.href}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </section>

              <section className="mobile-drawer__section">
                <div className="mobile-drawer__label">Field Tools</div>
                <div className="mobile-drawer__links">
                  {secondaryLinks.map((link) => (
                    <Link
                      className="mobile-drawer__link"
                      data-active={isActivePath(pathname, link.href)}
                      href={link.href}
                      key={link.href}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </>
      ) : null}
    </header>
  );
}
