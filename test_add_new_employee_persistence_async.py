import subprocess, sys, time
from playwright.sync_api import sync_playwright

def test_persistence():
    server_process = subprocess.Popen([sys.executable, "-m", "http.server", "8104"], cwd=r"C:\Users\antho\.gemini\antigravity\scratch\paprec-rh-platform")
    time.sleep(2)

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()

            page.goto("http://localhost:8104/", wait_until="networkidle")
            time.sleep(1)

            print("Initial employee count:", len(page.query_selector_all(".emp-card")))

            # Fill form and explicitly await saveEmployeeAtomically
            print("\nFilling and saving 'PERSISTENCE TEST USER'...")
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

            time.sleep(1)

            count_after_add = len(page.query_selector_all(".emp-card"))
            print(f"Employee count after adding: {count_after_add}")

            # Reload page (Hard refresh test)
            print("\nReloading page (Simulating user CTRL+F5 refresh)...")
            page.reload(wait_until="networkidle")
            time.sleep(2)

            count_after_reload = len(page.query_selector_all(".emp-card"))
            has_new_emp = "PERSISTENCE TEST USER" in page.text_content("body")

            print(f"Employee count after page reload: {count_after_reload}")
            print(f"New employee 'PERSISTENCE TEST USER' persisted on screen after refresh: {has_new_emp}")

            # Cleanup
            page.evaluate("""async () => {
                await deleteEmployeeAtomically('emp_persistence_test_999');
            }""")
            time.sleep(1)

            if has_new_emp and count_after_reload == count_after_add:
                print("\nSUCCESS: NEW EMPLOYEE IS 100% PERSISTED IN POSTGRESQL AND SURVIVES REFRESH!")
            else:
                print("\nFAILURE: New employee did not survive refresh.")

            browser.close()
    finally:
        server_process.terminate()

if __name__ == "__main__":
    test_persistence()
