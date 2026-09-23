"""Exercise the production preview's task navigation and contextual link graph."""
import json
import os
from pathlib import Path
from urllib.parse import urlparse

from playwright.sync_api import sync_playwright, expect

BASE = os.environ.get("TEST_BASE", "http://127.0.0.1:3000").rstrip("/")
OUT = Path(os.environ.get("AUDIT_OUT", "artifacts/nav-refresh-2026-09-23"))
OUT.mkdir(parents=True, exist_ok=True)
GROUPS = ["Walkthrough", "Builds & Gear", "Guides", "Fixes", "Game Info"]
report = {"viewports": [], "interactions": [], "page_errors": [], "external_requests": "blocked"}

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    try:
        context = browser.new_context(viewport={"width": 1440, "height": 1000}, reduced_motion="reduce")
        context.route("**/*", lambda r: r.continue_() if urlparse(r.request.url).netloc == urlparse(BASE).netloc else r.abort())
        page = context.new_page()
        page.on("pageerror", lambda error: report["page_errors"].append(str(error)))

        def visit(path):
            response = page.goto(BASE + path, wait_until="networkidle")
            assert response.status == 200, (path, response.status)
            consent = page.get_by_role("button", name="Reject analytics", exact=True)
            if consent.is_visible():
                consent.click()

        def unlocked():
            page.wait_for_function("document.body.style.overflow !== 'hidden'")
            assert not page.evaluate("Boolean(document.querySelector('.app-shell')?.inert)")
            assert not page.evaluate("Boolean(document.querySelector('.site-header')?.inert)")

        for width in [1440, 1280, 1180, 1041, 1024, 768, 390, 320]:
            page.set_viewport_size({"width": width, "height": 900})
            visit("/")
            assert page.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), width
            desktop = width > 1040
            assert page.locator(".site-nav").is_visible() == desktop
            assert page.locator(".drawer-toggle").is_visible() != desktop
            if desktop:
                assert page.locator(".site-nav__link").all_text_contents() == GROUPS
                for group in GROUPS:
                    trigger = page.get_by_role("button", name=f"Expand {group} navigation", exact=True)
                    trigger.click()
                    panel = page.locator("#" + trigger.get_attribute("aria-controls"))
                    panel.wait_for(state="visible")
                    assert page.locator(".site-nav__dropdown:visible").count() == 1
                    rect = panel.bounding_box()
                    assert rect["x"] >= 0 and rect["x"] + rect["width"] <= width + 1, (width, group, rect)
                    page.keyboard.press("Escape")
                    panel.wait_for(state="hidden")
                    expect(trigger).to_be_focused()
            else:
                page.get_by_role("button", name="Open mobile navigation", exact=True).click()
                drawer = page.get_by_role("dialog", name="Site navigation", exact=True)
                drawer.wait_for(state="visible")
                assert drawer.locator(".mobile-drawer__category").all_text_contents() == GROUPS
                assert drawer.locator(".mobile-drawer__links:visible").count() == 0
                for group in GROUPS:
                    trigger = drawer.get_by_role("button", name=f"Expand {group} navigation", exact=True)
                    trigger.click()
                    page.locator("#" + trigger.get_attribute("aria-controls")).wait_for(state="visible")
                    assert drawer.locator(".mobile-drawer__links:visible").count() == 1
                for _ in range(16):
                    page.keyboard.press("Tab")
                    assert page.evaluate("Boolean(document.activeElement?.closest('.mobile-drawer'))")
                page.keyboard.press("Escape")
                drawer.wait_for(state="hidden")
                expect(page.locator(".drawer-toggle")).to_be_focused()
                unlocked()
            report["viewports"].append({"width": width, "passed": True})

        page.set_viewport_size({"width": 1280, "height": 900})
        visit("/")
        trigger = page.get_by_role("button", name="Expand Builds & Gear navigation", exact=True)
        trigger.focus()
        page.keyboard.press("Enter")
        page.keyboard.press("Tab")
        page.wait_for_function("Boolean(document.activeElement?.closest('#desktop-nav-builds'))")
        page.locator("h1").click()
        expect(trigger).to_have_attribute("aria-expanded", "false")
        trigger.click()
        page.screenshot(path=str(OUT / "desktop-navigation.png"))
        page.locator("#desktop-nav-builds").get_by_role("link", name="Weapons", exact=True).click()
        page.wait_for_url(BASE + "/weapons")
        assert page.locator('.site-nav__link[data-active="true"]').inner_text() == "Builds & Gear"
        page.locator(".site-nav__dropdown:visible").wait_for(state="hidden")
        report["interactions"].append("desktop keyboard, outside click, navigation and semantic owner")

        page.set_viewport_size({"width": 390, "height": 844})
        for path, owner in [("/weapons", "builds"), ("/trophy-guide", "guides"), ("/mods", "fixes")]:
            visit(path)
            page.get_by_role("button", name="Open mobile navigation", exact=True).click()
            page.locator(f"#mobile-nav-{owner}").wait_for(state="visible")
            assert page.locator(".mobile-drawer__links:visible").count() == 1
            if path == "/weapons":
                page.screenshot(path=str(OUT / "mobile-navigation.png"))
            page.keyboard.press("Escape")
            unlocked()
        report["interactions"].append("mobile current category expands without guessing URL prefix")

        visit("/walkthrough")
        page.get_by_role("button", name="Open mobile navigation", exact=True).click()
        page.locator("#mobile-nav-walkthrough").get_by_role("link", name="Protection Application", exact=True).click()
        page.wait_for_function("location.hash === '#protection-application-credits-or-team-bond'")
        page.locator(".mobile-drawer").wait_for(state="hidden")
        unlocked()
        report["interactions"].append("same-page fragment closes drawer and unlocks scrolling")

        for shortcut in [False, True]:
            page.get_by_role("button", name="Open mobile navigation", exact=True).click()
            page.locator(".mobile-drawer").wait_for(state="visible")
            if shortcut:
                page.keyboard.press("Control+k")
            else:
                page.get_by_role("button", name="Search guides and tasks", exact=True).click()
            search = page.locator(".search-panel")
            search.wait_for(state="visible")
            page.locator(".mobile-drawer").wait_for(state="hidden")
            page.get_by_role("textbox", name="Search site content", exact=True).fill("help wanted")
            expect(search.locator('a[href="/walkthrough/help-wanted"]')).to_have_count(1)
            for _ in range(8):
                page.keyboard.press("Tab")
                assert page.evaluate("Boolean(document.activeElement?.closest('.search-panel'))")
            page.keyboard.press("Escape")
            search.wait_for(state="hidden")
            unlocked()
        report["interactions"].append("drawer search button and shortcut hand off one accessible dialog")

        page.get_by_role("button", name="Open mobile navigation", exact=True).click()
        page.set_viewport_size({"width": 1440, "height": 900})
        page.locator(".mobile-drawer").wait_for(state="hidden")
        unlocked()
        report["interactions"].append("resize closes mobile drawer and restores page interaction")

        sitemap = page.request.get(BASE + "/sitemap.xml").text()
        import re
        paths = [urlparse(url).path for url in re.findall(r"<loc>(.*?)</loc>", sitemap)]
        incoming = {path: set() for path in paths if path not in ["/", "/corrections", "/updates"]}
        for path in incoming:
            visit(path)
            assert page.locator('meta[name="robots"]').get_attribute("content") == "index, follow"
            links = page.locator(".article-body a[href^='/']").evaluate_all("nodes => nodes.map(n => n.getAttribute('href').split('#')[0])")
            for target in set(links):
                if target in incoming and target != path:
                    incoming[target].add(path)
        for path, sources in incoming.items():
            assert len(sources) >= 2, (path, sources)
        report["contextual_incoming"] = {path: sorted(sources) for path, sources in incoming.items()}
        assert "/walkthrough/sloppy-supply-route" not in paths
        assert "/walkthrough/in-debt-to-the-hutts" not in paths
        assert not report["page_errors"], report["page_errors"]
        context.close()
    finally:
        browser.close()
        (OUT / "navigation-report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")

print(json.dumps({"viewports": len(report["viewports"]), "interaction_groups": len(report["interactions"]), "interlinked_pages": len(report.get("contextual_incoming", {})), "errors": report["page_errors"]}))
