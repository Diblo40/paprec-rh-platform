import subprocess, sys, time
from playwright.sync_api import sync_playwright

def test_persistence():
    server_process = subprocess.Popen([sys.executable, "-m", "http.server", "8105"], cwd=r"C:\Users\antho\.gemini\antigravity\scratch\paprec-rh-platform")
    time.sleep(2)

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()

            page.goto("http://localhost:8105/", wait_until="networkidle")
            time.sleep(2)

            count_initial = len(page.query_selector_all(".emp-card"))
            print(f"Initial employee count: {count_initial}")

            # Save new employee to Supabase
            print("\nSaving new employee 'PERSISTENCE TEST USER' to Supabase...")
            page.evaluate("""async () => {
                const newEmp = {
                    id: "emp_persistence_test_999",
                    nom: "PERSISTENCE",
                    prenom: "TEST USER",
                    name: "PERSISTENCE TEST USER",
                    poste: "Chauffeur PL",
                    metier: "Chauffeurs",
                    contrat: "CDI",
                    dateEntree: "2024-01-01",
                    visiteMedicale: "2025-10-10",
                    telephone: "06 00 00 00 00",
                    email: "test.persist@paprec.com",
                    cpAcquis: 25,
                    rttAcquis: 10,
                    tailleEpi: { veste: "L", pantalon: "42", chaussures: "43" },
                    statut: "Actif",
                    soldeCP: 25,
                    soldeRTT: 10,
                    documents: [],
                    formations: [],
                    conges: []
                };
                await saveEmployeeAtomically(newEmp);
            }""")

            time.sleep(2)

            count_after_add = len(page.query_selector_all(".emp-card"))
            print(f"Employee count after add: {count_after_add}")

            # Hard Reload
            print("\nReloading page (CTRL+F5 simulation)...")
            page.reload(wait_until="networkidle")
            time.sleep(3) # Give async reloadEmployees 3s to complete and render

            count_after_reload = len(page.query_selector_all(".emp-card"))
            has_emp = "PERSISTENCE TEST USER" in page.text_content("body")

            print(f"Employee count after page reload & 3s render: {count_after_reload}")
            print(f"Employee 'PERSISTENCE TEST USER' present on screen after refresh: {has_emp}")

            # Cleanup
            page.evaluate("""async () => {
                await deleteEmployeeAtomically('emp_persistence_test_999');
            }""")
            time.sleep(2)

            if has_emp and count_after_reload == count_after_add:
                print("\nSUCCESS: NEW EMPLOYEE PERSISTS ACCURATELY ACROSS REFRESH!")
            else:
                print("\nFAILED.")

            browser.close()
    finally:
        server_process.terminate()

if __name__ == "__main__":
    test_persistence()
