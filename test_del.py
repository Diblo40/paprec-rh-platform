import subprocess, sys, time
from playwright.sync_api import sync_playwright

def test_delete_employee():
    server_process = subprocess.Popen([sys.executable, "-m", "http.server", "8102"], cwd=r"C:\Users\antho\.gemini\antigravity\scratch\paprec-rh-platform")
    time.sleep(2)

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()

            page.goto("http://localhost:8102/", wait_until="networkidle")
            time.sleep(1)

            print("Initial employee count:", len(page.query_selector_all(".emp-card")))

            # 1. Add fictitious employee
            print("\nAdding fictitious employee 'TEST DELETE FICTITIOUS'...")
            page.evaluate("""async () => {
                const dummy = {
                    id: "emp_dummy_delete_99",
                    nom: "FICTITIOUS",
                    prenom: "TEST DELETE",
                    name: "TEST DELETE FICTITIOUS",
                    poste: "Stagiaire",
                    metier: "Chauffeurs",
                    contrat: "Intérim",
                    dateEntree: "2026-07-23",
                    visiteMedicale: "2026-08-01",
                    telephone: "06 00 00 00 00",
                    email: "test.dummy@paprec.com",
                    cpAcquis: 0,
                    rttAcquis: 0,
                    tailleEpi: { veste: "M", pantalon: "40", chaussures: "41" },
                    statut: "Actif",
                    soldeCP: 0,
                    soldeRTT: 0,
                    documents: [],
                    formations: [],
                    conges: []
                };
                await saveEmployeeAtomically(dummy);
            }""")

            time.sleep(1)

            count_after_add = len(page.query_selector_all(".emp-card"))
            print(f"Employee count after add: {count_after_add}")

            # 2. Trigger Delete
            print("\nDeleting 'TEST DELETE FICTITIOUS'...")
            page.evaluate("""async () => {
                await deleteEmployeeAtomically('emp_dummy_delete_99');
            }""")

            time.sleep(2)

            count_after_delete = len(page.query_selector_all(".emp-card"))
            has_dummy = "TEST DELETE FICTITIOUS" in page.text_content("body")

            print(f"Employee count after delete: {count_after_delete}")
            print(f"Fictitious employee still present on screen: {has_dummy}")

            if not has_dummy and count_after_delete < count_after_add:
                print("\nSUCCESS: EMPLOYEE DELETED PERMANENTLY WITH ZERO TELEPORTATION!")
            else:
                print("\nFAILURE: Delete failed.")

            browser.close()
    finally:
        server_process.terminate()

if __name__ == "__main__":
    test_delete_employee()
