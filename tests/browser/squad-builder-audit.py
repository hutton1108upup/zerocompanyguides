import json
import os
import tempfile
from pathlib import Path

from playwright.sync_api import sync_playwright


BASE_URL = os.environ.get("BASE_URL", "http://127.0.0.1:3000").rstrip("/")
SCREENSHOT_DIR = Path(
    os.environ.get(
        "SCREENSHOT_DIR",
        str(Path(tempfile.gettempdir()) / "zero-company-squad-builder-audit"),
    )
)
ROUTES = ["/", "/squad-builder", "/corrections", "/updates"]


def wait_for_page(page, route):
    response = page.goto(f"{BASE_URL}{route}", wait_until="domcontentloaded")
    page.locator("h1").wait_for(state="visible")
    page.wait_for_timeout(100)
    return response


def audit_route(page, route, prefix=""):
    response = wait_for_page(page, route)
    return {
        "route": f"{prefix}{route}",
        "status": response.status if response else None,
        "h1": page.locator("h1").count(),
        "overflow": page.evaluate(
            "document.documentElement.scrollWidth > document.documentElement.clientWidth"
        ),
        "title": page.title(),
    }


def main():
    SCREENSHOT_DIR.mkdir(parents=True, exist_ok=True)
    results = []
    console_errors = []
    page_errors = []

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 1000})
        context.grant_permissions(
            ["clipboard-read", "clipboard-write"], origin=BASE_URL
        )
        page = context.new_page()
        page.on(
            "console",
            lambda message: console_errors.append(f"{page.url}: {message.text}")
            if message.type == "error"
            else None,
        )
        page.on("pageerror", lambda error: page_errors.append(f"{page.url}: {error}"))

        for route in ROUTES:
            results.append(audit_route(page, route))

        wait_for_page(page, "/squad-builder")
        assert page.locator("[data-squad-slot]").count() == 4
        page.get_by_role("button", name="Permadeath safety", exact=False).click()
        assert (
            page.locator("select[aria-label='Specialization 1']").input_value()
            == "medic"
        )
        page.locator("select[aria-label='Operator 1']").select_option("custom")
        assert page.get_by_text("Story missions require Hawks", exact=True).is_visible()
        page.get_by_text("skirmish", exact=True).click()
        assert not page.get_by_text(
            "Story missions require Hawks", exact=True
        ).is_visible()
        page.locator("select[aria-label='Operator 1']").select_option("tel-rea")
        specialization = page.locator("select[aria-label='Specialization 1']")
        assert specialization.input_value() == "jedi-padawan"
        assert specialization.is_disabled()

        page.get_by_role("button", name="Copy share link", exact=True).click()
        clipboard = page.evaluate("navigator.clipboard.readText()")
        assert "/squad-builder?s=" in clipboard
        page.get_by_role("button", name="Save in browser", exact=True).click()
        stored = page.evaluate("localStorage.getItem('zero-company-squad:v1')")
        assert stored and stored.startswith("v1|")

        shared = context.new_page()
        wait_for_page(shared, clipboard.replace(BASE_URL, "") if clipboard.startswith(BASE_URL) else clipboard)
        shared.wait_for_timeout(100)
        assert shared.locator("select[aria-label='Operator 1']").input_value() == "tel-rea"
        assert (
            shared.locator("select[aria-label='Specialization 1']").input_value()
            == "jedi-padawan"
        )
        shared.close()
        page.screenshot(
            path=str(SCREENSHOT_DIR / "squad-builder-desktop.png"), full_page=True
        )

        wait_for_page(page, "/corrections")
        correction_href = page.get_by_role(
            "link", name="Submit a correction with evidence"
        ).get_attribute("href")
        assert correction_href
        assert "issues/new" in correction_href
        assert "evidence%20link" in correction_href

        mobile = context.new_page()
        mobile.set_viewport_size({"width": 390, "height": 844})
        mobile.on(
            "console",
            lambda message: console_errors.append(f"mobile: {message.text}")
            if message.type == "error"
            else None,
        )
        mobile.on("pageerror", lambda error: page_errors.append(f"mobile: {error}"))
        for route in ROUTES:
            results.append(audit_route(mobile, route, "mobile:"))
        wait_for_page(mobile, "/squad-builder")
        assert mobile.locator("[data-squad-slot]").count() == 4
        assert mobile.get_by_role("button", name="Copy share link", exact=True).is_visible()
        mobile.screenshot(
            path=str(SCREENSHOT_DIR / "squad-builder-mobile.png"), full_page=True
        )
        mobile.close()
        browser.close()

    assert all(item["status"] == 200 for item in results)
    assert all(item["h1"] == 1 for item in results)
    assert not any(item["overflow"] for item in results)
    assert not console_errors
    assert not page_errors

    print(
        json.dumps(
            {
                "results": results,
                "builder": {
                    "fourSlots": True,
                    "preset": True,
                    "storyConflict": True,
                    "skirmishClearsConflict": True,
                    "lockedSpecialization": True,
                    "shareRoundTrip": True,
                    "localSave": True,
                },
                "consoleErrors": console_errors,
                "pageErrors": page_errors,
                "screenshots": [
                    str(SCREENSHOT_DIR / "squad-builder-desktop.png"),
                    str(SCREENSHOT_DIR / "squad-builder-mobile.png"),
                ],
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
