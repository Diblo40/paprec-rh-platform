import urllib.request, json

supa_url = "https://wilukbpvjfdyxahasmmt.supabase.co/rest/v1/"
supa_key = "sb_publishable_P9MiaaGJqJ2f6zAFvHwXZA_jYHlF830"

headers = {
    "apikey": supa_key,
    "Authorization": "Bearer " + supa_key
}

req = urllib.request.Request(supa_url + "employees?select=*", headers=headers)
with urllib.request.urlopen(req) as resp:
    rows = json.loads(resp.read().decode('utf-8'))

print(f"=== ALL ROWS IN SUPABASE 'employees' TABLE ({len(rows)}) ===")
for r in rows:
    print(f"ID: {r.get('id')} | Name: {r.get('name')} | Role: {r.get('role')[:50] if r.get('role') else ''}")
