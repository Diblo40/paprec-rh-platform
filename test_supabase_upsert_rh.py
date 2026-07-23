import urllib.request, json

supa_url = "https://wilukbpvjfdyxahasmmt.supabase.co/rest/v1/"
supa_key = "sb_publishable_P9MiaaGJqJ2f6zAFvHwXZA_jYHlF830"

headers = {
    "apikey": supa_key,
    "Authorization": "Bearer " + supa_key,
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

test_payload = json.dumps({"timestamp": 12345, "employees": [{"id": "emp_1", "nom": "TEST"}]})
row = {
    "id": "rh_global_state",
    "name": test_payload,
    "role": "RH_MASTER_PAYLOAD",
    "entryDate": "2026-07-23"
}

print("=== TESTING UPSERT POST ON rh_global_state ===")
try:
    req = urllib.request.Request(supa_url + "employees", headers=headers, method="POST", data=json.dumps(row).encode('utf-8'))
    with urllib.request.urlopen(req) as resp:
        print(f"POST UPSERT status: {resp.status}")
except Exception as e:
    if hasattr(e, 'read'):
        print(f"POST UPSERT error {e.code}: {e.read().decode('utf-8')}")
    else:
        print("POST UPSERT error:", e)

# Check GET again
get_req = urllib.request.Request(supa_url + "employees?id=eq.rh_global_state&select=*", headers={"apikey": supa_key, "Authorization": "Bearer " + supa_key})
with urllib.request.urlopen(get_req) as resp:
    rows = json.loads(resp.read().decode('utf-8'))
    print(f"GET rh_global_state rows after UPSERT: {len(rows)}")
