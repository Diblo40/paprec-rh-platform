import urllib.request, json

supa_url = "https://wilukbpvjfdyxahasmmt.supabase.co/rest/v1/"
supa_key = "sb_publishable_P9MiaaGJqJ2f6zAFvHwXZA_jYHlF830"

headers = {
    "apikey": supa_key,
    "Authorization": "Bearer " + supa_key,
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

test_payload = {
    "id": "emp_balazard_tywan",
    "name": "BALAZARD TYWAN",
    "role": json.dumps({"poste": "Chauffeur", "congesSolde": 25, "rttSolde": 10, "formations": []}),
    "entryDate": "2024-03-15"
}

print("=== TESTING UPSERT WITH JSON IN ROLE FIELD ===")
try:
    req = urllib.request.Request(supa_url + "employees", headers=headers, method="POST", data=json.dumps(test_payload).encode('utf-8'))
    with urllib.request.urlopen(req) as resp:
        print(f"Status: {resp.status}")
except Exception as e:
    if hasattr(e, 'read'):
        print(f"Error {e.code}: {e.read().decode('utf-8')}")
    else:
        print(f"Error: {e}")
