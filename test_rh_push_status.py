import urllib.request, json

supa_url = "https://wilukbpvjfdyxahasmmt.supabase.co/rest/v1/"
supa_key = "sb_publishable_P9MiaaGJqJ2f6zAFvHwXZA_jYHlF830"

headers = {
    "apikey": supa_key,
    "Authorization": "Bearer " + supa_key,
    "Content-Type": "application/json"
}

# 1. Fetch current row
req = urllib.request.Request(supa_url + "employees?id=eq.rh_global_state&select=*", headers=headers)
try:
    with urllib.request.urlopen(req) as resp:
        rows = json.loads(resp.read().decode('utf-8'))
        print(f"GET rh_global_state rows: {len(rows)}")
        if rows:
            print("First 100 chars of name:", rows[0].get('name')[:100])
except Exception as e:
    print("GET error:", e)

# 2. Test PATCH with payload
test_payload = json.dumps({"timestamp": 12345, "employees": [{"id": "emp_1", "nom": "TEST"}]})
patch_req = urllib.request.Request(supa_url + "employees?id=eq.rh_global_state", headers=headers, method="PATCH", data=json.dumps({"name": test_payload}).encode('utf-8'))
try:
    with urllib.request.urlopen(patch_req) as resp:
        print(f"PATCH status: {resp.status}")
except Exception as e:
    if hasattr(e, 'read'):
        print(f"PATCH error {e.code}: {e.read().decode('utf-8')}")
    else:
        print("PATCH error:", e)
