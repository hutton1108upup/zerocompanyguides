import Link from "next/link";
import { contentPages } from "@/content/pages";

type FooterGroup = {
  title: string;
  paths: string[];
};

const pageByPath = new Map(contentPages.map((page) => [page.path, page]));

const footerGroups: FooterGroup[] = [
  {
    title: "Decide & Start",
    paths: ["/game-info", "/system-requirements", "/multiplayer", "/worth-it"],
  },
  {
    title: "Build & Strategy",
    paths: ["/builds", "/builds/hawks", "/builds/best-team", "/classes/tier-list"],
  },
  {
    title: "Campaign Intel",
    paths: ["/guides", "/guides/respec", "/guides/beginners-guide", "/walkthrough"],
  },
  {
    title: "Technical & Reference",
    paths: ["/performance", "/performance/fps-fix", "/performance/steam-deck", "/mods"],
  },
];

const lastVerified = contentPages
  .map((page) => page.lastVerified)
  .sort((left, right) => right.localeCompare(left))[0];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__grid">
          {footerGroups.map((group) => (
            <section key={group.title}>
              <h2 className="site-footer__title">{group.title}</h2>
              <div className="site-footer__links">
                {group.paths.map((path) => {
                  const page = pageByPath.get(path);
                  if (!page) return null;
                  return (
                    <Link className="site-footer__link" href={path} key={path}>
                      {page.navLabel}
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="site-footer__legal">
          <strong>Unofficial fan-made guide.</strong> Not affiliated with EA, Bit Reactor,
          Lucasfilm, or Disney. Official facts, community synthesis, and unverified claims should
          remain visibly separated throughout the site. Registry snapshot last verified{" "}
          {lastVerified}.
        </div>
      </div>
    </footer>
  );
}
