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

rh_employees = []
for r in rows:
    if r.get('id') == "rh_global_state":
        continue
    
    notes_json = {}
    if r.get('notes'):
        try:
            notes_json = json.loads(r['notes'])
        except: pass

    full_name = r.get('name') or "Collaborateur"
    parts = full_name.split(' ')
    nom = notes_json.get('nom') or parts[0]
    prenom = notes_json.get('prenom') or (" ".join(parts[1:]) if len(parts) > 1 else "")

    emp = {
        "id": r.get('id'),
        "nom": nom,
        "prenom": prenom,
        "name": full_name,
        "poste": notes_json.get('poste') or r.get('role') or "Collaborateur",
        "dateEntree": notes_json.get('dateEntree') or r.get('entryDate') or "2026-01-01",
        "avatarColor": notes_json.get('avatarColor') or "#0284c7",
        "congesSolde": notes_json.get('congesSolde', 25),
        "rttSolde": notes_json.get('rttSolde', 10),
        "formations": notes_json.get('formations', [])
    }
    rh_employees.append(emp)

print(f"=== RECONSTRUCTED RH EMPLOYEES COUNT: {len(rh_employees)} ===")
for idx, e in enumerate(rh_employees):
    print(f"{idx+1}. ID: {e['id']} | Nom: {e['nom']} | Prenom: {e['prenom']} | Name: {e['name']}")
