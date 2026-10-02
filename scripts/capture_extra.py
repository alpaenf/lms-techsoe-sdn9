import os
import time
from playwright.sync_api import sync_playwright

OUTPUT_DIR = os.path.abspath("docs/manual/images")
os.makedirs(OUTPUT_DIR, exist_ok=True)
BASE_URL = "http://127.0.0.1:8000"

def login(page, identifier, password='password123'):
    page.goto(f"{BASE_URL}/login", wait_until="networkidle")
    time.sleep(0.5)
    page.fill('input[name="login"]', identifier)
    page.fill('input[name="password"]', password)
    page.keyboard.press("Enter")
    page.wait_for_url("**/dashboard", timeout=12000)
    time.sleep(1.5)

def capture_extra():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        context = browser.new_context(viewport={"width": 1280, "height": 820}, device_scale_factor=1.5)
        page = context.new_page()

        print("Capturing Admin Master Data Tabs...")
        login(page, 'admin', 'password123')
        
        # 11. Master Siswa
        page.goto(f"{BASE_URL}/master-data?tab=siswa", wait_until="networkidle")
        time.sleep(1.5)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "11_master_siswa.png"))
        print("- 11_master_siswa.png")

        print("Capturing Guru Elearning Tugas...")
        page.context.clear_cookies()
        login(page, '198705122015021003', 'password123')
        page.goto(f"{BASE_URL}/elearning", wait_until="networkidle")
        time.sleep(1)
        # Click on second button tab in header
        tugas_btns = page.locator('button:has-text("Tugas")')
        if tugas_btns.count() > 0:
            tugas_btns.first.click()
            time.sleep(1)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "19_guru_elearning_tugas.png"))
        print("- 19_guru_elearning_tugas.png")

        print("Capturing Siswa Presensi & Raport...")
        page.context.clear_cookies()
        login(page, '0081234567', 'password123')
        page.goto(f"{BASE_URL}/presensi", wait_until="networkidle")
        time.sleep(1.2)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "30_siswa_presensi.png"))
        print("- 30_siswa_presensi.png")

        page.goto(f"{BASE_URL}/e-rapor", wait_until="networkidle")
        time.sleep(1.2)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "31_siswa_erapor.png"))
        print("- 31_siswa_erapor.png")

        print("Capturing BK & Pimpinan Dashboards...")
        page.context.clear_cookies()
        login(page, '199003202019032008', 'password123')
        page.screenshot(path=os.path.join(OUTPUT_DIR, "32_bk_dashboard.png"))
        print("- 32_bk_dashboard.png")

        page.context.clear_cookies()
        login(page, '198502012010012025', 'password123')
        page.screenshot(path=os.path.join(OUTPUT_DIR, "33_pimpinan_dashboard.png"))
        print("- 33_pimpinan_dashboard.png")

        browser.close()
        print("Done extra captures!")

if __name__ == "__main__":
    capture_extra()
