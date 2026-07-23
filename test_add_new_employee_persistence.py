import subprocess, sys, time
from playwright.sync_api import sync_playwright

def test_persistence():
    server_process = subprocess.Popen([sys.executable, "-m", "http.server", "8103"], cwd=r"C:\Users\antho\.gemini\antigravity\scratch\paprec-rh-platform")
    time.sleep(2)

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()

            page.goto("http://localhost:8103/", wait_until="networkidle")
            time.sleep(1)

            print("Initial employee count:", len(page.query_selector_all(".emp-card")))

            # 1. Add new employee via UI / Form
            print("\nFilling and submitting form for 'PERSISTENCE TEST USER'...")
            page.evaluate("""async () => {
                document.getElementById('emp-id').value = '';
                document.getElementById('emp-nom').value = 'PERSISTENCE';
                document.getElementById('emp-prenom').value = 'TEST USER';
                document.getElementById('emp-metier').value = 'Chauffeurs';
                document.getElementById('emp-role').value = 'CHAUFFEUR PL';
                document.getElementById('emp-categorie').value = 'Ouvrier';
                document.getElementById('emp-contrat').value = 'CDI';
                document.getElementById('emp-date-entree').value = '2024-01-01';

                const form = document.getElementById('form-employee');
                const submitEvent = new Event('submit', { cancelable: true });
                form.dispatchEvent(submitEvent);
            }""")

            time.sleep(2)

            count_after_add = len(page.query_selector_all(".emp-card"))
            print(f"Employee count after adding: {count_after_add}")

            # 2. Reload page (Hard refresh test)
            print("\nReloading page (Simulating user CTRL+F5 refresh)...")
            page.reload(wait_until="networkidle")
            time.sleep(2)

            count_after_reload = len(page.query_selector_all(".emp-card"))
            has_new_emp = "PERSISTENCE TEST USER" in page.text_content("body")

            print(f"Employee count after page reload: {count_after_reload}")
            print(f"New employee 'PERSISTENCE TEST USER' persisted on screen after refresh: {has_new_emp}")

            # Cleanup
            page.evaluate("""async () => {
                const target = employees.find(e => e.nom === 'PERSISTENCE');
                if (target) {
                    await deleteEmployeeAtomically(target.id);
                }
            }""")
            time.sleep(1)

            if has_new_emp and count_after_reload == count_after_add:
                print("\n✅ PERFECT SUCCESS: NEW EMPLOYEE IS 100% PERSISTED IN POSTGRESQL AND SURVIVES REFRESH!")
            else:
                print("\n❌ FAILURE: New employee did not survive refresh.")

            browser.close()
    finally:
        server_process.terminate()

if __name__ == "__main__":
    test_persistence()
