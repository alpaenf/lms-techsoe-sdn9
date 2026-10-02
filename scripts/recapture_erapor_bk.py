import os
import time
from playwright.sync_api import sync_playwright

OUTPUT_DIR = os.path.abspath("docs/manual/images")
BASE_URL = "http://127.0.0.1:8000"

def login(page, identifier, password='password123'):
    page.goto(f"{BASE_URL}/login", wait_until="networkidle")
    time.sleep(0.5)
    page.fill('input[name="login"]', identifier)
    page.fill('input[name="password"]', password)
    page.keyboard.press("Enter")
    page.wait_for_url("**/dashboard", timeout=12000)
    time.sleep(1.5)

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        context = browser.new_context(viewport={"width": 1280, "height": 820}, device_scale_factor=1.5)
        page = context.new_page()

        # 1. Admin /erapor and /bk
        login(page, 'admin', 'password123')
        page.goto(f"{BASE_URL}/erapor", wait_until="networkidle")
        time.sleep(1.5)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "15_erapor_leger.png"))
        print("15_erapor_leger.png saved, size:", os.path.getsize(os.path.join(OUTPUT_DIR, "15_erapor_leger.png")))

        page.goto(f"{BASE_URL}/bk", wait_until="networkidle")
        time.sleep(1.5)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "16_bk_konseling.png"))
        print("16_bk_konseling.png saved, size:", os.path.getsize(os.path.join(OUTPUT_DIR, "16_bk_konseling.png")))

        # 2. Guru /erapor
        page.context.clear_cookies()
        login(page, '198705122015021003', 'password123')
        page.goto(f"{BASE_URL}/erapor", wait_until="networkidle")
        time.sleep(1.5)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "25_guru_erapor.png"))
        print("25_guru_erapor.png saved, size:", os.path.getsize(os.path.join(OUTPUT_DIR, "25_guru_erapor.png")))

        # 3. Siswa /erapor
        page.context.clear_cookies()
        login(page, '0081234567', 'password123')
        page.goto(f"{BASE_URL}/erapor", wait_until="networkidle")
        time.sleep(1.5)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "31_siswa_erapor.png"))
        print("31_siswa_erapor.png saved, size:", os.path.getsize(os.path.join(OUTPUT_DIR, "31_siswa_erapor.png")))

        browser.close()
        print("Done recapturing erapor and bk!")

if __name__ == "__main__":
    run()
