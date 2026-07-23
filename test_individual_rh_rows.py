import urllib.request, json

supa_url = "https://wilukbpvjfdyxahasmmt.supabase.co/rest/v1/"
supa_key = "sb_publishable_P9MiaaGJqJ2f6zAFvHwXZA_jYHlF830"

headers = {
    "apikey": supa_key,
    "Authorization": "Bearer " + supa_key
}

print("=== INSPECTING INDIVIDUAL ROWS IN SUPABASE 'employees' TABLE ===")
try:
    req = urllib.request.Request(supa_url + "employees?select=*", headers=headers)
    with urllib.request.urlopen(req) as resp:
        rows = json.loads(resp.read().decode('utf-8'))
        print(f"Total rows: {len(rows)}")
        for r in rows:
            if r.get('id') != "rh_global_state":
                print(f"ID: {r.get('id')} | Name/Nom: {r.get('name') or r.get('nom')} | Keys: {list(r.keys())}")
except Exception as e:
    print("Fetch error:", e)
