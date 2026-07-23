import subprocess, sys, time
from playwright.sync_api import sync_playwright

def test_push_pull_debug():
    server_process = subprocess.Popen([sys.executable, "-m", "http.server", "8082"], cwd=r"C:\Users\antho\.gemini\antigravity\scratch\paprec-rh-platform")
    time.sleep(2)

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page1 = browser.new_page()
            page2 = browser.new_page()

            page1.on("console", lambda m: print(f"[Page 1 Log] {m.text}"))
            page2.on("console", lambda m: print(f"[Page 2 Log] {m.text}"))

            page1.goto("http://localhost:8082/", wait_until="networkidle")
            page2.goto("http://localhost:8082/", wait_until="networkidle")

            time.sleep(1)

            # PC 1 adds new employee and awaits pushDataToCloud directly
            print("--- PAGE 1 PUSHING NEW EMPLOYEE ---")
            push_res = page1.evaluate("""async () => {
                const newEmp = {
                    id: "emp_debug_123",
                    nom: "DEBUG",
                    prenom: "USER",
                    name: "DEBUG USER",
                    poste: "Debug",
                    dateEntree: "2026-07-23",
                    avatarColor: "#10b981",
                    congesSolde: 25,
                    rttSolde: 10,
                    formations: []
                };
                employees.push(newEmp);
                saveEmployeesToStorage();
                await pushDataToCloud();
                return employees.length;
            }""")
            print(f"Page 1 employee count after push: {push_res}")

            time.sleep(1)

            # Page 2 pulls directly
            print("\n--- PAGE 2 PULLING FROM CLOUD ---")
            pull_res = page2.evaluate("""async () => {
                console.log("Page 2 before pull count:", employees.length);
                const ok = await pullDataFromCloud(true);
                console.log("Page 2 pull return value:", ok);
                console.log("Page 2 after pull count:", employees.length);
                return { ok, count: employees.length, names: employees.map(e => e.name) };
            }""")

            print(f"Page 2 pull result: {pull_res}")

            # Cleanup
            page1.evaluate("""async () => {
                employees = employees.filter(e => e.id !== "emp_debug_123");
                saveEmployeesToStorage();
                await pushDataToCloud();
            }""")

            browser.close()
    finally:
        server_process.terminate()

if __name__ == "__main__":
    test_push_pull_debug()
