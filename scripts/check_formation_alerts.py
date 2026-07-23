import os, sys, json, urllib.request, smtplib
from datetime import datetime, date, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

supa_url = os.environ.get("SUPABASE_URL", "https://wilukbpvjfdyxahasmmt.supabase.co")
supa_key = os.environ.get("SUPABASE_KEY", "sb_publishable_P9MiaaGJqJ2f6zAFvHwXZA_jYHlF830")

smtp_host = os.environ.get("SMTP_HOST", "smtp.gmail.com")
smtp_port = int(os.environ.get("SMTP_PORT", "587"))
smtp_user = os.environ.get("SMTP_USER", "")
smtp_pass = os.environ.get("SMTP_PASS", "")
to_email = os.environ.get("ALERT_TO_EMAIL", "emilie.jayat@paprec.com")

print("=== DEBUT DE LA VERIFICATION DES FORMATIONS RH (J-30 & JOUR J) ===")
print(f"Date du jour: {date.today().isoformat()}")

headers = {
    "apikey": supa_key,
    "Authorization": "Bearer " + supa_key
}

req = urllib.request.Request(f"{supa_url}/rest/v1/employees?id=eq.rh_platform_master_state&select=*", headers=headers)

try:
    with urllib.request.urlopen(req) as resp:
        rows = json.loads(resp.read().decode('utf-8'))
        if not rows or not rows[0].get('name'):
            print("Aucune donnee RH trouvee sur le Cloud.")
            sys.exit(0)
        
        payload = json.loads(rows[0]['name'])
        employees = payload.get('employees', [])
        settings = payload.get('settings', {})
        if settings.get('signataireNom'):
            print(f"Responsable RH: {settings.get('signataireNom')}")
except Exception as e:
    print("Erreur lors de la recuperation des donnees Supabase:", e)
    sys.exit(1)

today = date.today()

alerts_j30 = []
alerts_jour_j = []
alerts_expired = []

for emp in employees:
    emp_name = f"{emp.get('prenom', '')} {emp.get('nom', '')}".strip() or emp.get('name', 'Collaborateur')
    emp_role = emp.get('poste', emp.get('role', 'Salarié'))
    formations = emp.get('formations', [])

    for f in formations:
        f_name = f.get('name') or f.get('intitule') or 'Formation QSE'
        exp_str = f.get('dateRecyclage') or f.get('expiration')

        if exp_str:
            try:
                exp_date = datetime.strptime(exp_str, "%Y-%m-%d").date()
                diff_days = (exp_date - today).days

                alert_item = {
                    "employee": emp_name,
                    "role": emp_role,
                    "formation": f_name,
                    "exp_date": exp_str,
                    "days": diff_days
                }

                if diff_days == 30 or (25 <= diff_days <= 30):
                    alerts_j30.append(alert_item)
                elif diff_days == 0:
                    alerts_jour_j.append(alert_item)
                elif diff_days < 0:
                    alerts_expired.append(alert_item)
            except Exception as parse_err:
                pass

print(f"Alerte(s) J-30 trouvee(s): {len(alerts_j30)}")
print(f"Alerte(s) Jour J trouvee(s): {len(alerts_jour_j)}")
print(f"Formation(s) deja perimee(s): {len(alerts_expired)}")

if not alerts_j30 and not alerts_jour_j and not alerts_expired:
    print("Aucune formation a echeance J-30 ou Jour J aujourd'hui. Fin du traitement.")
    sys.exit(0)

# Build HTML Email Content
html_body = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {{ font-family: Arial, sans-serif; background-color: #f8fafc; color: #0f172a; padding: 20px; }}
        .container {{ max-width: 650px; background: #ffffff; border-radius: 10px; border: 1px solid #e2e8f0; padding: 24px; margin: 0 auto; }}
        .header {{ background: linear-gradient(135deg, #004d99, #002952); color: white; padding: 18px 24px; border-radius: 8px; font-weight: bold; font-size: 1.2rem; display: flex; align-items: center; justify-content: space-between; }}
        .section-title {{ font-size: 1rem; font-weight: bold; margin-top: 20px; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 2px solid #e2e8f0; }}
        .alert-box {{ background: #fff7ed; border-left: 4px solid #ea580c; padding: 12px 16px; margin-bottom: 12px; border-radius: 4px; }}
        .danger-box {{ background: #fef2f2; border-left: 4px solid #ef4444; padding: 12px 16px; margin-bottom: 12px; border-radius: 4px; }}
        .table {{ width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 0.88rem; }}
        .table th {{ background: #f1f5f9; padding: 10px; text-align: left; border-bottom: 1px solid #cbd5e1; }}
        .table td {{ padding: 10px; border-bottom: 1px solid #e2e8f0; }}
        .footer {{ font-size: 0.78rem; color: #64748b; margin-top: 24px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 16px; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <span>PAPREC - Plateforme RH & QSE</span>
            <span style="font-size: 0.85rem; font-weight: normal;">Agence Laroque d'Olmes</span>
        </div>

        <p style="margin-top: 20px; font-size: 0.95rem;">Bonjour Emilie,</p>
        <p style="font-size: 0.92rem; color: #334155;">Voici le récapitulatif quotidien automatique des <strong>échéances de formations QSE</strong> pour les collaborateurs de l'agence :</p>
"""

if alerts_jour_j:
    html_body += """
        <div class="section-title" style="color: #c2410c;">⚠️ ALERTES EN EXPIRATION AUJOURD'HUI (Jour J)</div>
        <div class="alert-box">
            <table class="table">
                <thead>
                    <tr>
                        <th>Collaborateur</th>
                        <th>Poste</th>
                        <th>Formation QSE</th>
                        <th>Date d'échéance</th>
                    </tr>
                </thead>
                <tbody>
    """
    for a in alerts_jour_j:
        html_body += f"""
                    <tr>
                        <td><strong>{a['employee']}</strong></td>
                        <td>{a['role']}</td>
                        <td><span style="color: #c2410c; font-weight: bold;">{a['formation']}</span></td>
                        <td><strong>AUJOURD'HUI ({a['exp_date']})</strong></td>
                    </tr>
        """
    html_body += """
                </tbody>
            </table>
        </div>
    """

if alerts_j30:
    html_body += """
        <div class="section-title" style="color: #d97706;">🔔 ALERTES ECHEANCE PROCHE (J-30)</div>
        <div class="alert-box" style="background: #fefce8; border-color: #ca8a04;">
            <table class="table">
                <thead>
                    <tr>
                        <th>Collaborateur</th>
                        <th>Poste</th>
                        <th>Formation QSE</th>
                        <th>Date d'échéance</th>
                        <th>Délai</th>
                    </tr>
                </thead>
                <tbody>
    """
    for a in alerts_j30:
        html_body += f"""
                    <tr>
                        <td><strong>{a['employee']}</strong></td>
                        <td>{a['role']}</td>
                        <td>{a['formation']}</td>
                        <td>{a['exp_date']}</td>
                        <td><span style="color: #b45309; font-weight: bold;">dans {a['days']} jour(s)</span></td>
                    </tr>
        """
    html_body += """
                </tbody>
            </table>
        </div>
    """

html_body += f"""
        <p style="font-size: 0.9rem; margin-top: 20px;">
            🔗 <strong>Consulter et enregistrer les recyclages :</strong><br>
            <a href="https://diblo40.github.io/paprec-rh-platform/" style="color: #004d99; font-weight: bold; text-decoration: none;">Ouvrir la Plateforme RH Paprec &rarr;</a>
        </p>

        <div class="footer">
            Message automatique généré par GitHub Actions &bull; Paprec Sud Ouest Agence Laroque d'Olmes &bull; {today.strftime('%d/%m/%Y')}
        </div>
    </div>
</body>
</html>
"""

print("Rapport d'alerte genere avec succes !")

if not smtp_user or not smtp_pass:
    print("[INFO] SMTP_USER ou SMTP_PASS non configure dans GitHub Secrets.")
    print("Le rapport d'alerte a ete controle avec succes. Pour recevoir l'email quotidien, configurez les Secrets GitHub.")
    sys.exit(0)

try:
    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"🚨 [Alerte RH PAPREC] {len(alerts_jour_j) + len(alerts_j30)} formation(s) arrive(nt) à échéance !"
    msg["From"] = smtp_user
    msg["To"] = to_email

    msg.attach(MIMEText(html_body, "html"))

    print(f"Connexion au serveur SMTP {smtp_host}:{smtp_port}...")
    server = smtplib.SMTP(smtp_host, smtp_port)
    server.starttls()
    server.login(smtp_user, smtp_pass)
    server.sendmail(smtp_user, [to_email], msg.as_string())
    server.quit()
    print(f"✅ EMAIL D'ALERTE ENVOYE AVEC SUCCES A {to_email} !")
except Exception as send_err:
    print("Erreur lors de l'envoi de l'email SMTP:", send_err)
