import subprocess, sys, time
from playwright.sync_api import sync_playwright

def test_full_flow():
    server_process = subprocess.Popen([sys.executable, "-m", "http.server", "8114"], cwd=r"C:\Users\antho\.gemini\antigravity\scratch\paprec-rh-platform")
    time.sleep(2)

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page_a = browser.new_page()
            page_b = browser.new_page()

            # Automatically accept confirmation dialogs in Playwright
            page_a.on("dialog", lambda dialog: dialog.accept())
            page_b.on("dialog", lambda dialog: dialog.accept())

            print("=== TEST 1: CHARGEMENT INITIAL ===")
            page_a.goto("http://localhost:8114/", wait_until="networkidle")
            page_b.goto("http://localhost:8114/", wait_until="networkidle")
            time.sleep(3)

            count_a = len(page_a.query_selector_all(".emp-card"))
            count_b = len(page_b.query_selector_all(".emp-card"))
            print(f"Device A initial count: {count_a} | Device B initial count: {count_b}")

            # 1. CREATE ON DEVICE A
            print("\n=== TEST 2: CRÉATION AVEC CONFIRMATION SERVEUR SUR DEVICE A ===")
            create_res = page_a.evaluate("""async () => {
                const formData = {
                    nom: "TEST-GUIDE",
                    prenom: "CONFIRMED",
                    metier: "Chauffeurs",
                    role: "CHAUFFEUR PL",
                    categorie: "Ouvrier",
                    contrat: "CDI",
                    dateEntree: "2024-01-01"
                };
                const res = await window.saveEmployee(formData);
                return res !== null;
            }""")

            print("Server creation confirmation on Device A:", create_res)
            time.sleep(2)

            count_a_after = len(page_a.query_selector_all(".emp-card"))
            print(f"Device A count after creation: {count_a_after}")

            # 2. REFRESH DEVICE A
            print("\n=== TEST 3: REFRESH (CTRL+F5) SUR DEVICE A ===")
            page_a.reload(wait_until="networkidle")
            time.sleep(3)
            has_emp_after_refresh = "TEST-GUIDE" in page_a.text_content("body")
            print("Employee persists on Device A after refresh:", has_emp_after_refresh)

            # 3. REALTIME SYNC ON DEVICE B
            print("\n=== TEST 4: VERIFICATION DU TEMPS REEL SUR DEVICE B ===")
            page_b.reload(wait_until="networkidle")
            time.sleep(3)
            has_emp_device_b = "TEST-GUIDE" in page_b.text_content("body")
            print("Employee present on Device B:", has_emp_device_b)

            # 4. DELETE ON DEVICE A
            print("\n=== TEST 5: SUPPRESSION ATOMIQUE SUR DEVICE A ===")
            delete_res = page_a.evaluate("""async () => {
                const target = employees.find(e => e.nom === 'TEST-GUIDE');
                if (target) {
                    return await window.deleteEmployee(target.id);
                }
                return false;
            }""")

            print("Server delete confirmation on Device A:", delete_res)
            time.sleep(2)

            count_a_deleted = len(page_a.query_selector_all(".emp-card"))
            has_emp_a_deleted = "TEST-GUIDE" in page_a.text_content("body")
            print(f"Device A count after delete: {count_a_deleted} | Still present on Device A: {has_emp_a_deleted}")

            # 5. REFRESH DEVICE A & B AFTER DELETE
            print("\n=== TEST 6: REFRESH APRES SUPPRESSION SUR DEVICE A ET B ===")
            page_a.reload(wait_until="networkidle")
            page_b.reload(wait_until="networkidle")
            time.sleep(3)

            has_emp_a_final = "TEST-GUIDE" in page_a.text_content("body")
            has_emp_b_final = "TEST-GUIDE" in page_b.text_content("body")
            print(f"Present on Device A after refresh: {has_emp_a_final} | Present on Device B after refresh: {has_emp_b_final}")

            if create_res and has_emp_after_refresh and has_emp_device_b and delete_res and not has_emp_a_final and not has_emp_b_final:
                print("\nTOUS LES CRITERES DU GUIDE OBLIGATOIRE SONT VALIDES A 100% !")
            else:
                print("\nTEST ECHOUE.")

            browser.close()
    finally:
        server_process.terminate()

if __name__ == "__main__":
    test_full_flow()
