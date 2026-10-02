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

def logout(page):
    try:
        logout_btn = page.locator('button[title="Keluar"], a:has-text("Keluar")')
        if logout_btn.count() > 0:
            logout_btn.first.click()
            time.sleep(1)
    except Exception:
        pass

def capture():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        context = browser.new_context(viewport={"width": 1280, "height": 820}, device_scale_factor=1.5)
        page = context.new_page()

        print("=== 1. Capturing Public/Auth Pages ===")
        # 1. Landing Page
        page.goto(f"{BASE_URL}/", wait_until="networkidle")
        time.sleep(1)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "01_landing_page.png"))
        print("- 01_landing_page.png")

        # 2. Login Page
        page.goto(f"{BASE_URL}/login", wait_until="networkidle")
        time.sleep(1)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "02_login_page.png"))
        print("- 02_login_page.png")

        # 3. Forgot Password
        page.goto(f"{BASE_URL}/forgot-password", wait_until="networkidle")
        time.sleep(1)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "03_forgot_password.png"))
        print("- 03_forgot_password.png")

        # 4. Register Page
        page.goto(f"{BASE_URL}/register", wait_until="networkidle")
        time.sleep(1)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "04_register_page.png"))
        print("- 04_register_page.png")

        print("=== 2. Capturing Administrator / Pimpinan Pages ===")
        login(page, 'admin', 'password123')
        
        # 5. Admin Dashboard
        page.screenshot(path=os.path.join(OUTPUT_DIR, "05_admin_dashboard.png"))
        print("- 05_admin_dashboard.png")

        # 6. Admin Notification Dropdown
        bell_btn = page.locator('button[aria-label="Lihat notifikasi"]')
        if bell_btn.count() > 0:
            bell_btn.click()
            time.sleep(0.8)
            page.screenshot(path=os.path.join(OUTPUT_DIR, "06_admin_notification_dropdown.png"))
            print("- 06_admin_notification_dropdown.png")
            page.keyboard.press("Escape")
            time.sleep(0.5)

        # 7. Notifications Index
        page.goto(f"{BASE_URL}/notifications", wait_until="networkidle")
        time.sleep(1)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "07_admin_notifications_page.png"))
        print("- 07_admin_notifications_page.png")

        # 8. Profile Page
        page.goto(f"{BASE_URL}/profile", wait_until="networkidle")
        time.sleep(1)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "08_admin_profile_page.png"))
        print("- 08_admin_profile_page.png")

        # 9. Kelembagaan Profil
        page.goto(f"{BASE_URL}/kelembagaan", wait_until="networkidle")
        time.sleep(1.2)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "09_kelembagaan_profil.png"))
        print("- 09_kelembagaan_profil.png")

        # 10. Master Data - Rombel
        page.goto(f"{BASE_URL}/master-data", wait_until="networkidle")
        time.sleep(1.2)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "10_master_rombel.png"))
        print("- 10_master_rombel.png")

        # 11. Master Data - Siswa
        tab_siswa = page.locator("button:has-text('Peserta Didik'), button:has-text('Data Siswa')")
        if tab_siswa.count() > 0:
            tab_siswa.first.click()
            time.sleep(0.8)
            page.screenshot(path=os.path.join(OUTPUT_DIR, "11_master_siswa.png"))
            print("- 11_master_siswa.png")

        # 12. Master Data - Pendidik
        tab_guru = page.locator("button:has-text('Pendidik'), button:has-text('Guru')")
        if tab_guru.count() > 0:
            tab_guru.first.click()
            time.sleep(0.8)
            page.screenshot(path=os.path.join(OUTPUT_DIR, "12_master_pendidik.png"))
            print("- 12_master_pendidik.png")

        # 13. Master Data - Mapel
        tab_mapel = page.locator("button:has-text('Mata Pelajaran'), button:has-text('Mapel')")
        if tab_mapel.count() > 0:
            tab_mapel.first.click()
            time.sleep(0.8)
            page.screenshot(path=os.path.join(OUTPUT_DIR, "13_master_mapel.png"))
            print("- 13_master_mapel.png")

        # 14. Presensi Admin
        page.goto(f"{BASE_URL}/presensi", wait_until="networkidle")
        time.sleep(1.2)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "14_presensi_harian.png"))
        print("- 14_presensi_harian.png")

        # 15. E-Rapor Leger Nilai
        page.goto(f"{BASE_URL}/e-rapor", wait_until="networkidle")
        time.sleep(1.2)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "15_erapor_leger.png"))
        print("- 15_erapor_leger.png")

        # 16. Bimbingan Konseling
        page.goto(f"{BASE_URL}/bimbingan-konseling", wait_until="networkidle")
        time.sleep(1.2)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "16_bk_konseling.png"))
        print("- 16_bk_konseling.png")

        print("=== 3. Capturing Guru / Pendidik Pages ===")
        # Logout & Login Guru
        page.context.clear_cookies()
        login(page, '198705122015021003', 'password123')

        # 17. Guru Dashboard
        page.screenshot(path=os.path.join(OUTPUT_DIR, "17_guru_dashboard.png"))
        print("- 17_guru_dashboard.png")

        # 18. E-Learning Guru - Materi
        page.goto(f"{BASE_URL}/elearning", wait_until="networkidle")
        time.sleep(1.2)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "18_guru_elearning_materi.png"))
        print("- 18_guru_elearning_materi.png")

        # 19. E-Learning Guru - Tugas
        tab_tugas = page.locator("button:has-text('Tugas Terstruktur'), button:has-text('Tugas')")
        if tab_tugas.count() > 0:
            tab_tugas.first.click()
            time.sleep(0.8)
            page.screenshot(path=os.path.join(OUTPUT_DIR, "19_guru_elearning_tugas.png"))
            print("- 19_guru_elearning_tugas.png")

        # 20. CBT Guru - Daftar Ujian
        page.goto(f"{BASE_URL}/exams", wait_until="networkidle")
        time.sleep(1.2)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "20_guru_cbt_daftar_ujian.png"))
        print("- 20_guru_cbt_daftar_ujian.png")

        # 21. CBT Guru - Buat Ujian
        page.goto(f"{BASE_URL}/exams/create", wait_until="networkidle")
        time.sleep(1.2)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "21_guru_cbt_buat_ujian.png"))
        print("- 21_guru_cbt_buat_ujian.png")

        # 22. CBT Guru - Detail & Soal
        page.goto(f"{BASE_URL}/exams/1", wait_until="networkidle")
        time.sleep(1.2)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "22_guru_cbt_kelola_soal.png"))
        print("- 22_guru_cbt_kelola_soal.png")

        # 23. CBT Guru - Hasil Ujian
        page.goto(f"{BASE_URL}/exams/1/results", wait_until="networkidle")
        time.sleep(1.2)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "23_guru_cbt_hasil_ujian.png"))
        print("- 23_guru_cbt_hasil_ujian.png")

        # 24. Presensi Guru
        page.goto(f"{BASE_URL}/presensi", wait_until="networkidle")
        time.sleep(1.2)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "24_guru_presensi.png"))
        print("- 24_guru_presensi.png")

        # 25. E-Rapor Guru
        page.goto(f"{BASE_URL}/e-rapor", wait_until="networkidle")
        time.sleep(1.2)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "25_guru_erapor.png"))
        print("- 25_guru_erapor.png")

        print("=== 4. Capturing Siswa Pages ===")
        # Logout & Login Siswa
        page.context.clear_cookies()
        login(page, '0081234567', 'password123')

        # 26. Siswa Dashboard
        page.screenshot(path=os.path.join(OUTPUT_DIR, "26_siswa_dashboard.png"))
        print("- 26_siswa_dashboard.png")

        # 27. Siswa E-Learning
        page.goto(f"{BASE_URL}/elearning", wait_until="networkidle")
        time.sleep(1.2)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "27_siswa_elearning.png"))
        print("- 27_siswa_elearning.png")

        # 28. Siswa CBT Jadwal
        page.goto(f"{BASE_URL}/student/exams", wait_until="networkidle")
        time.sleep(1.2)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "28_siswa_cbt_jadwal.png"))
        print("- 28_siswa_cbt_jadwal.png")

        # 29. Siswa CBT Detail / Konfirmasi
        page.goto(f"{BASE_URL}/student/exams/1", wait_until="networkidle")
        time.sleep(1.2)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "29_siswa_cbt_detail.png"))
        print("- 29_siswa_cbt_detail.png")

        # 30. Siswa Presensi
        page.goto(f"{BASE_URL}/presensi", wait_until="networkidle")
        time.sleep(1.2)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "30_siswa_presensi.png"))
        print("- 30_siswa_presensi.png")

        # 31. Siswa E-Rapor
        page.goto(f"{BASE_URL}/e-rapor", wait_until="networkidle")
        time.sleep(1.2)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "31_siswa_erapor.png"))
        print("- 31_siswa_erapor.png")

        print("=== 5. Capturing Orang Tua Pages ===")
        # Logout & Login Orang Tua
        page.context.clear_cookies()
        login(page, 'ortu_siti', 'password123')

        # 32. Ortu Dashboard
        page.screenshot(path=os.path.join(OUTPUT_DIR, "32_ortu_dashboard.png"))
        print("- 32_ortu_dashboard.png")

        browser.close()
        print(f"\n[SUCCESS] Successfully captured all 32 screenshots into: {OUTPUT_DIR}")

if __name__ == "__main__":
    capture()
