import subprocess, sys, time
from playwright.sync_api import sync_playwright

def test_pure_cloud():
    server_process = subprocess.Popen([sys.executable, "-m", "http.server", "8099"], cwd=r"C:\Users\antho\.gemini\antigravity\scratch\paprec-rh-platform")
    time.sleep(2)

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page1 = browser.new_page()
            page2 = browser.new_page()

            page1.goto("http://localhost:8099/", wait_until="networkidle")
            page2.goto("http://localhost:8099/", wait_until="networkidle")

            time.sleep(1)

            print("Initial count - Page 1:", len(page1.query_selector_all(".emp-card")))
            print("Initial count - Page 2:", len(page2.query_selector_all(".emp-card")))

            # Page 1 adds new employee AND awaits pushDataToCloud
            print("\nPage 1 adding and pushing 'PURE CLOUD USER TEST'...")
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
                await pushDataToCloud();
            }""")

            print("Page 1 count after push:", len(page1.query_selector_all(".emp-card")))

            print("\nPage 2 fetching from Cloud...")
            page2_res = page2.evaluate("""async () => {
                await fetchPureCloudState(true);
                return {
                    count: employees.length,
                    hasEmp: employees.some(e => e.id === 'emp_pure_cloud_999')
                };
            }""")

            print("Page 2 fetch result:", page2_res)

            # Cleanup
            page1.evaluate("""async () => {
                employees = employees.filter(e => e.id !== "emp_pure_cloud_999");
                saveEmployeesToStorage();
                await pushDataToCloud();
            }""")
            time.sleep(1)

            if page2_res.get('hasEmp') and page2_res.get('count') == 16:
                print("\nSUCCESS: PURE CLOUD ENGINE MULTI-DEVICE SYNC IS 100% WORKING!")
            else:
                print("\nFAILED.")

            browser.close()
    finally:
        server_process.terminate()

if __name__ == "__main__":
    test_pure_cloud()
