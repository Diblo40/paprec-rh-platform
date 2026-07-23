import urllib.request, json

supa_url = "https://wilukbpvjfdyxahasmmt.supabase.co/rest/v1/"
supa_key = "sb_publishable_P9MiaaGJqJ2f6zAFvHwXZA_jYHlF830"

headers = {
    "apikey": supa_key,
    "Authorization": "Bearer " + supa_key,
    "Content-Type": "application/json"
}

# 1. Fetch all rows
req = urllib.request.Request(supa_url + "employees?select=*", headers=headers)
with urllib.request.urlopen(req) as resp:
    rows = json.loads(resp.read().decode('utf-8'))

print(f"Total rows currently in Supabase: {len(rows)}")
for r in rows:
    print(f"Deleting row ID: {r.get('id')} | Name: {r.get('name')}")
    del_req = urllib.request.Request(supa_url + f"employees?id=eq.{r.get('id')}", headers=headers, method="DELETE")
    try:
        urllib.request.urlopen(del_req)
    except Exception as e:
        print("Delete error:", e)

print("Supabase employees table cleaned successfully!")
