import subprocess, sys, time
from playwright.sync_api import sync_playwright

def test_pure_cloud():
    server_process = subprocess.Popen([sys.executable, "-m", "http.server", "8098"], cwd=r"C:\Users\antho\.gemini\antigravity\scratch\paprec-rh-platform")
    time.sleep(2)

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page1 = browser.new_page()
            page2 = browser.new_page()

            print("Page 1 navigating...")
            page1.goto("http://localhost:8098/", wait_until="networkidle")

            print("Page 2 navigating...")
            page2.goto("http://localhost:8098/", wait_until="networkidle")

            time.sleep(1)

            count1 = len(page1.query_selector_all(".emp-card"))
            count2 = len(page2.query_selector_all(".emp-card"))
            print(f"Initial count - Page 1: {count1} | Page 2: {count2}")

            # Page 1 adds new employee
            print("\nPage 1 adding 'PURE CLOUD USER TEST'...")
            page1.evaluate("""async () => {
                const newEmp = {
                    id: "emp_pure_cloud_999",
                    nom: "PURE CLOUD",
                    prenom: "USER TEST",
                    name: "PURE CLOUD USER TEST",
                    poste: "Inspecteur QSE",
                    dateEntree: "2026-07-23",
                    avatarColor: "#059669",
                    congesSolde: 25,
                    rttSolde: 10,
                    formations: []
                };
                employees.push(newEmp);
                saveEmployeesToStorage();
            }""")

            print("Waiting 3 seconds for Page 2 to auto-pull Cloud heartbeat...")
            time.sleep(3)

            count2_after = len(page2.query_selector_all(".emp-card"))
            has_new_emp = "PURE CLOUD USER TEST" in page2.text_content("body")

            print(f"Page 2 count after 3s heartbeat: {count2_after}")
            print(f"Page 2 automatically received 'PURE CLOUD USER TEST': {has_new_emp}")

            # Cleanup
            page1.evaluate("""async () => {
                employees = employees.filter(e => e.id !== "emp_pure_cloud_999");
                saveEmployeesToStorage();
            }""")
            time.sleep(2)

            if has_new_emp and count2_after > count2:
                print("\n✅ PERFECT SUCCESS: PURE CLOUD ENGINE AUTOMATIC MULTI-DEVICE SYNC IS 100% WORKING!")
            else:
                print("\n❌ FAILURE: Multi-device sync failed.")

            browser.close()
    finally:
        server_process.terminate()

if __name__ == "__main__":
    test_pure_cloud()
