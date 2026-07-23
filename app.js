
function triggerCloudPush() {
    pushDataToCloud();
}

// Complete Revamped Application Logic for Paprec RH Platform & Formations QSE

const STORAGE_EMP_KEY = 'paprec_rh_employees_v10';
const STORAGE_PLANNING_KEY = 'paprec_rh_planning_v10';
const STORAGE_SETTINGS_KEY = 'paprec_rh_settings_v10';

// App State
let employees = [];
let planningData = {};
let fichesPoste = [];
let rhSettings = {
    signataireNom: "Emilie JAYAT",
    signataireTitre: "Responsable RH & QSE",
    agenceNom: "Paprec Sud Ouest - Agence Laroque d'Olmes"
};

let currentEditingEmpId = null;
let activePlanningCell = null;
let activeInfoFormation = null;

// Calendar View State (3 Months)
let currentCongesStartMonth = 6; // 0-indexed: 6 = Juillet
let currentCongesStartYear = 2026;

// Init State
function init() {
    // Load Settings
    const savedSet = localStorage.getItem(STORAGE_SETTINGS_KEY);
    if (savedSet) {
        try { rhSettings = JSON.parse(savedSet); } catch (e) {}
    }
    updateSettingsDisplay();

    // Load Employees
    const savedEmp = localStorage.getItem(STORAGE_EMP_KEY);
    if (savedEmp) {
        try {
            employees = JSON.parse(savedEmp);
        } catch (e) {
            employees = JSON.parse(JSON.stringify(INITIAL_EMPLOYEES));
        }
    } else {
        employees = JSON.parse(JSON.stringify(INITIAL_EMPLOYEES));
    }

    // Clean old fictitious SST entries from stored data to strictly match Excel
    employees.forEach(emp => {
        if (emp.formations) {
            emp.formations = emp.formations.filter(f => f.id !== 'sst');
        }
    });
    saveEmployeesToStorage();

    // Load Planning
    const savedPlanning = localStorage.getItem(STORAGE_PLANNING_KEY);
    if (savedPlanning) {
        try {
            planningData = JSON.parse(savedPlanning);
        } catch (e) {
            planningData = JSON.parse(JSON.stringify(INITIAL_PLANNING));
        }
    } else {
        planningData = JSON.parse(JSON.stringify(INITIAL_PLANNING));
        savePlanningToStorage();
    }

    fichesPoste = JSON.parse(JSON.stringify(INITIAL_FICHES_POSTE));

    processEmployeesFormationsStatus();
    setupEventListeners();
    updateStats();
    checkStorageUsage();
    renderPersonnel();
    renderConges();
    renderPlanning();
    renderFichesPoste();
    renderFormationsMatrix();
}

function saveEmployeesToStorage() {
    localStorage.setItem(STORAGE_EMP_KEY, JSON.stringify(employees));
    checkStorageUsage();
    triggerCloudPush();
}

function savePlanningToStorage() {
    localStorage.setItem(STORAGE_PLANNING_KEY, JSON.stringify(planningData));
    triggerCloudPush();
}

function saveSettingsToStorage() {
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(rhSettings));
    triggerCloudPush();
}

function checkStorageUsage() {
    try {
        let totalBytes = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                totalBytes += (localStorage[key].length + key.length) * 2;
            }
        }
        const megaBytes = (totalBytes / (1024 * 1024)).toFixed(2);
        const warningBar = document.getElementById('storage-warning-bar');
        
        if (megaBytes > 3.5 && warningBar) {
            warningBar.style.display = 'block';
        } else if (warningBar) {
            warningBar.style.display = 'none';
        }
    } catch (e) {}
}

function updateSettingsDisplay() {
    document.querySelectorAll('.signataire-display-name').forEach(el => {
        el.textContent = rhSettings.signataireNom;
    });
    const navName = document.getElementById('nav-signataire-name');
    if (navName) navName.textContent = rhSettings.signataireNom;
}

function openSettingsRHModal() {
    const _el_1 = document.getElementById('settings-signataire-nom');
    if (_el_1) _el_1.value = rhSettings.signataireNom;
    const _el_2 = document.getElementById('settings-signataire-titre');
    if (_el_2) _el_2.value = rhSettings.signataireTitre;
    const _el_3 = document.getElementById('settings-agence-nom');
    if (_el_3) _el_3.value = rhSettings.agenceNom;
    document.getElementById('modal-settings-rh')?.classList.add('active');
}

function saveSettingsRH() {
    rhSettings.signataireNom = document.getElementById('settings-signataire-nom')?.value.trim() || 'Emilie JAYAT';
    rhSettings.signataireTitre = document.getElementById('settings-signataire-titre')?.value.trim() || 'Responsable RH & QSE';
    rhSettings.agenceNom = document.getElementById('settings-agence-nom')?.value.trim() || "Paprec Sud Ouest - Laroque d'Olmes";

    saveSettingsToStorage();
    updateSettingsDisplay();
    closeModals();
    alert("Configuration de la Responsable RH enregistrée avec succès !");
}

// DEFINITIVE CLEAN PRINTING FUNCTION (STRICT SINGLE PAGE A4 FIT, ZERO OVERFLOW)
function printCleanContent(htmlContent, documentTitle = 'Document RH Paprec', isLandscape = false) {
    const printWin = window.open('', '_blank', 'width=1100,height=850');
    printWin.document.write(`
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <title>${documentTitle}</title>
            <style>
                @page {
                    size: ${isLandscape ? 'landscape' : 'portrait'};
                    margin: 0.4cm;
                }
                * { box-sizing: border-box; margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; }
                html, body { height: 100%; background: #ffffff; color: #0f172a; padding: 4px; font-size: 10px; line-height: 1.22; }
                .de39-header-table { width: 100%; border-collapse: collapse; margin-bottom: 4px; }
                .de39-header-table td { border: 1px solid #004d99; padding: 3px 6px; font-size: 9.5px; }
                .de39-table { width: 100%; border-collapse: collapse; margin: 4px 0; }
                .de39-table th, .de39-table td { border: 1px solid #cbd5e1; padding: 3px 5px; text-align: left; vertical-align: top; font-size: 9.5px; }
                .de39-table th { background: #e6f0fa; color: #004d99; font-weight: 800; text-transform: uppercase; font-size: 9.5px; }
                .de39-section-hdr { background: #f1f5f9; color: #004d99; font-weight: 800; padding: 3px 5px; font-size: 10px; border: 1px solid #cbd5e1; }
                ul { margin-top: 1px; margin-bottom: 1px; padding-left: 14px; }
                li { margin-bottom: 1px; }
                .print-signatures { display: flex; justify-content: space-between; margin-top: 8px; padding-top: 4px; }
                .print-sig-box { width: 45%; border-top: 1px solid #94a3b8; padding-top: 3px; font-size: 9.5px; font-weight: 600; color: #475569; }
                .badge { padding: 2px 6px; border-radius: 3px; font-size: 9px; font-weight: 700; display: inline-block; }
                .badge-primary { background: #e6f0fa; color: #004d99; }
                .badge-secondary { background: #d1fae5; color: #047857; }
                .calendar-grid-header { display: grid; grid-template-columns: repeat(7, 1fr); background: #f1f5f9; font-weight: 700; text-align: center; padding: 4px 0; border: 1px solid #cbd5e1; }
                .calendar-grid-days { display: grid; grid-template-columns: repeat(7, 1fr); }
                .calendar-day-cell { border: 1px solid #cbd5e1; min-height: 42px; padding: 3px; background: #ffffff; font-size: 9.5px; }
                .calendar-day-number { font-weight: 700; color: #64748b; margin-bottom: 1px; }
                .calendar-event-tag { padding: 1px 3px; border-radius: 2px; font-size: 9px; font-weight: 700; margin-bottom: 1px; }
                .calendar-event-tag.cp { background: #e6f0fa; color: #004d99; }
                .calendar-event-tag.rtt { background: #d1fae5; color: #047857; }
                .calendar-event-tag.maladie { background: #fee2e2; color: #b91c1c; }
            </style>
        </head>
        <body>
            ${htmlContent}
            <script>
                window.onload = function() {
                    window.print();
                    setTimeout(function() { window.close(); }, 500);
                };
            <\/script>
        </body>
        </html>
    `);
    printWin.document.close();
}

// Helpers
function formatDateFR(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('fr-FR');
}

function getInitials(nom, prenom) {
    const n = nom ? nom.charAt(0) : '';
    const p = prenom ? prenom.charAt(0) : '';
    return (p + n).toUpperCase() || 'RH';
}

function calcDaysBetween(startStr, endStr) {
    if (!startStr || !endStr) return 0;
    const d1 = new Date(startStr);
    const d2 = new Date(endStr);
    const diff = d2 - d1;
    if (diff < 0) return 0;
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}

function calcExpirationStatus(expirationDate) {
    if (!expirationDate) return null;
    const exp = new Date(expirationDate);
    if (isNaN(exp.getTime())) return null;
    
    const now = new Date();
    const diffDays = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return { status: 'danger', label: 'PÉRIMÉ', days: diffDays };
    if (diffDays <= 90) return { status: 'warning', label: `${diffDays}j restants`, days: diffDays };
    return { status: 'ok', label: 'OK', days: diffDays };
}

function calculateAutoExpiration(typeId, startDateStr) {
    if (!startDateStr) return '';
    const def = FORMATION_DEFINITIONS.find(d => d.id === typeId);
    if (!def || !def.defaultMonths) return '';
    
    const startDate = new Date(startDateStr);
    if (isNaN(startDate.getTime())) return '';
    
    const expDate = new Date(startDate);
    expDate.setMonth(expDate.getMonth() + def.defaultMonths);
    
    return expDate.toISOString().split('T')[0];
}

function processEmployeesFormationsStatus() {
    employees.forEach(emp => {
        let hasDanger = false;
        let hasWarning = false;
        
        (emp.formations || []).forEach(f => {
            if (f.expiration) {
                const s = calcExpirationStatus(f.expiration);
                if (s) {
                    f.statusInfo = s;
                    if (s.status === 'danger') hasDanger = true;
                    if (s.status === 'warning') hasWarning = true;
                }
            } else {
                f.statusInfo = { status: 'ok', label: 'OK' };
            }
        });
        
        emp.hasDanger = hasDanger;
        emp.hasWarning = hasWarning;
        
        if (hasDanger) emp.globalStatus = 'danger';
        else if (hasWarning) emp.globalStatus = 'warning';
        else emp.globalStatus = 'ok';
    });
}

// Tab Switching
function switchTab(tabId) {
    document.querySelectorAll('.nav-tab').forEach(btn => {
        if (btn.dataset.tab === tabId) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    document.querySelectorAll('.tab-content').forEach(sec => {
        if (sec.id === tabId) sec.classList.add('active');
        else sec.classList.remove('active');
    });
}

// Update Stats
function updateStats() {
    const total = employees.length;
    const cdi = employees.filter(e => e.contrat === 'CDI').length;
    const interim = employees.filter(e => e.contrat === 'Intérim' || e.categorie === 'Intérimaire').length;
    
    let docsCount = 0;
    let okForm = 0, warnForm = 0, dangForm = 0;

    employees.forEach(e => {
        if (e.documents) docsCount += e.documents.length;
        if (e.hasDanger) dangForm++;
        if (e.hasWarning) warnForm++;
        if (!e.hasDanger && !e.hasWarning) okForm++;
    });

    const _el_4 = document.getElementById('stat-total-emp');
    if (_el_4) _el_4.textContent = total;
    const _el_5 = document.getElementById('stat-cdi-emp');
    if (_el_5) _el_5.textContent = cdi;
    const _el_6 = document.getElementById('stat-interim-emp');
    if (_el_6) _el_6.textContent = interim;
    const _el_7 = document.getElementById('stat-docs-total');
    if (_el_7) _el_7.textContent = docsCount;

    // Formations stats
    const _el_8 = document.getElementById('fstat-total');
    if (_el_8) _el_8.textContent = total;
    const _el_9 = document.getElementById('fstat-ok');
    if (_el_9) _el_9.textContent = okForm;
    const _el_10 = document.getElementById('fstat-warning');
    if (_el_10) _el_10.textContent = warnForm;
    const _el_11 = document.getElementById('fstat-danger');
    if (_el_11) _el_11.textContent = dangForm;
}

// ================= MODULE 1: PERSONNEL =================

function renderPersonnel() {
    const container = document.getElementById('emp-cards-container');
    container.innerHTML = '';

    const searchTerm = document.getElementById('search-personnel')?.value.toLowerCase().trim();
    const filterMetier = document.getElementById('filter-metier-personnel')?.value;
    const filterContrat = document.getElementById('filter-contrat-personnel')?.value;

    const filtered = employees.filter(emp => {
        if (searchTerm) {
            const fullStr = `${emp.nom} ${emp.prenom} ${emp.role} ${emp.email}`.toLowerCase();
            if (!fullStr.includes(searchTerm)) return false;
        }
        if (filterMetier !== 'all' && emp.metier !== filterMetier) return false;
        if (filterContrat !== 'all' && emp.contrat !== filterContrat) return false;
        return true;
    });

    if (filtered.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 40px; color: var(--text-muted);">
            <i class="fa-solid fa-users-slash" style="font-size: 2.5rem; margin-bottom: 12px;"></i>
            <p>Aucun collaborateur ne correspond aux critères de recherche.</p>
        </div>`;
        return;
    }

    filtered.forEach(emp => {
        const card = document.createElement('div');
        card.className = 'emp-card';
        card.onclick = () => openProfileModal(emp.id);

        const docsCount = emp.documents ? emp.documents.length : 0;
        const initials = getInitials(emp.nom, emp.prenom);

        card.innerHTML = `
            <div class="emp-card-header">
                <div class="emp-avatar">${initials}</div>
                <div class="emp-details">
                    <h4>${emp.prenom} ${emp.nom}</h4>
                    <p><span class="badge badge-primary">${emp.metier}</span></p>
                </div>
            </div>
            <div class="emp-info-list">
                <div class="emp-info-item">
                    <span>Poste / Rôle:</span>
                    <span>${emp.role || '-'}</span>
                </div>
                <div class="emp-info-item">
                    <span>Contrat / Statut:</span>
                    <span><span class="badge badge-gray">${emp.contrat || 'CDI'} (${emp.categorie || 'Ouvrier'})</span></span>
                </div>
                <div class="emp-info-item">
                    <span>Date d'entrée:</span>
                    <span>${formatDateFR(emp.dateEntree)}</span>
                </div>
                <div class="emp-info-item">
                    <span>Visite Médicale:</span>
                    <span>${formatDateFR(emp.visiteMedicale)}</span>
                </div>
                <div class="emp-info-item">
                    <span>Équipements (EPI):</span>
                    <span>${emp.tailleEpi ? `Veste: ${emp.tailleEpi.veste || '-'} / P: ${emp.tailleEpi.pantalon || '-'} / Ch: ${emp.tailleEpi.chaussures || '-'}` : 'Non spécifié'}</span>
                </div>
            </div>
            <div class="emp-card-actions" onclick="event.stopPropagation()">
                <button class="btn btn-outline btn-sm" onclick="openProfileModal('${emp.id}')" style="flex: 1;">
                    <i class="fa-solid fa-id-card" style="color: var(--primary);"></i> Fiche Salarié (${docsCount} docs)
                </button>
                <button class="btn-icon" onclick="openEditEmpModal('${emp.id}')" title="Modifier profil">
                    <i class="fa-solid fa-user-pen"></i>
                </button>
                <button class="btn-icon danger" onclick="deleteEmployee('${emp.id}')" title="Supprimer salarié">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

function openProfileModal(empId) {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;

    currentEditingEmpId = empId;

    const _el_12 = document.getElementById('profile-avatar');
    if (_el_12) _el_12.textContent = getInitials(emp.nom, emp.prenom);
    const _el_13 = document.getElementById('profile-full-name');
    if (_el_13) _el_13.textContent = `${emp.prenom} ${emp.nom}`;
    const _el_14 = document.getElementById('profile-sub');
    if (_el_14) _el_14.textContent = `${emp.role || emp.metier} (${emp.contrat || 'CDI'})`;

    const _el_15 = document.getElementById('profile-metier-badge');
    if (_el_15) _el_15.textContent = emp.metier || 'Général';
    const _el_16 = document.getElementById('profile-categorie-badge');
    if (_el_16) _el_16.textContent = emp.categorie || 'Ouvrier';
    const _el_17 = document.getElementById('profile-statut-badge');
    if (_el_17) _el_17.textContent = emp.statut || 'Salarié Actif';

    const _el_18 = document.getElementById('profile-date-entree');
    if (_el_18) _el_18.textContent = formatDateFR(emp.dateEntree);
    const _el_19 = document.getElementById('profile-visite-med');
    if (_el_19) _el_19.textContent = formatDateFR(emp.visiteMedicale);
    const _el_20 = document.getElementById('profile-telephone');
    if (_el_20) _el_20.textContent = emp.telephone || '-';
    const _el_21 = document.getElementById('profile-email');
    if (_el_21) _el_21.textContent = emp.email || '-';

    if (emp.tailleEpi) {
        const _el_22 = document.getElementById('profile-epi-info');
        if (_el_22) _el_22.textContent = `Veste: ${emp.tailleEpi.veste || '-'} | Pantalon: ${emp.tailleEpi.pantalon || '-'} | Chaussures: ${emp.tailleEpi.chaussures || '-'}`;
    } else {
        const _el_23 = document.getElementById('profile-epi-info');
        if (_el_23) _el_23.textContent = 'Non renseigné';
    }

    const leaveStats = calculateEmployeeLeaveStats(emp, '2026');
    const _el_solde_cp = document.getElementById('profile-solde-cp'); if (_el_solde_cp) _el_solde_cp.innerHTML = `
        <span style="font-size: 1.3rem; font-weight:800; color:var(--primary);">${leaveStats.cpSolde} j restants</span>
        <div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">Acquis: ${leaveStats.cpAcquis} j | Pris: ${leaveStats.cpPris} j</div>
    `;
    const _el_solde_rtt = document.getElementById('profile-solde-rtt'); if (_el_solde_rtt) _el_solde_rtt.innerHTML = `
        <span style="font-size: 1.3rem; font-weight:800; color:var(--secondary);">${leaveStats.rttSolde} j restants</span>
        <div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">Acquis: ${leaveStats.rttAcquis} j | Pris: ${leaveStats.rttPris} j</div>
    `;

    const formContainer = document.getElementById('profile-formations-container');
    formContainer.innerHTML = '';

    const forms = emp.formations || [];
    if (forms.length === 0) {
        formContainer.innerHTML = `<p style="font-size:0.82rem; color:var(--text-muted);">Aucune formation enregistrée pour ce salarié.</p>`;
    } else {
        let fHtml = `<div style="display:flex; flex-wrap:wrap; gap:8px;">`;
        forms.forEach(f => {
            let cl = f.statusInfo ? f.statusInfo.status : 'ok';
            let labelStr = f.statusInfo ? f.statusInfo.label : 'OK';
            fHtml += `
                <div class="cell-pill ${cl}" onclick="openFormationInfoModal('${emp.id}', '${f.id}')" style="min-width: 140px; cursor:pointer;" title="Cliquer pour détails">
                    <span>${f.name}</span>
                    <span style="font-size:0.7rem;">${formatDateFR(f.expiration)} (${labelStr})</span>
                </div>
            `;
        });
        fHtml += `</div>`;
        formContainer.innerHTML = fHtml;
    }

    renderEmployeeFiles(emp);

    const _el_profile_edit = document.getElementById('btn-profile-edit'); if (_el_profile_edit) _el_profile_edit.onclick = () => {
        closeModals();
        openEditEmpModal(emp.id);
    };

    document.getElementById('modal-fiche-salarie')?.classList.add('active');
}

function triggerProfileFileUpload() {
    document.getElementById('profile-file-input-hidden')?.click();
}

function handleProfileFileUpload(event) {
    const file = event.target.files[0];
    if (!file || !currentEditingEmpId) return;

    const emp = employees.find(e => e.id === currentEditingEmpId);
    if (!emp) return;

    if (!emp.documents) emp.documents = [];

    const sz = file.size > 1024 * 1024 ? (file.size / (1024 * 1024)).toFixed(1) + ' MB' : Math.round(file.size / 1024) + ' KB';

    const newDoc = {
        id: 'doc_' + Date.now(),
        name: file.name,
        type: 'Document RH Joint',
        date: new Date().toISOString().split('T')[0],
        size: sz
    };

    emp.documents.push(newDoc);
    saveEmployeesToStorage();
    updateStats();
    renderEmployeeFiles(emp);
    renderPersonnel();

    event.target.value = '';
    alert(`Document "${file.name}" ajouté avec succès au dossier de ${emp.prenom} ${emp.nom} !`);
}

function openAddEmpModal() {
    const _el_24 = document.getElementById('modal-emp-title');
    if (_el_24) _el_24.textContent = 'Nouveau Collaborateur';
    const _el_25 = document.getElementById('emp-id');
    if (_el_25) _el_25.value = '';
    const _el_26 = document.getElementById('emp-nom');
    if (_el_26) _el_26.value = '';
    const _el_27 = document.getElementById('emp-prenom');
    if (_el_27) _el_27.value = '';
    const _el_28 = document.getElementById('emp-metier');
    if (_el_28) _el_28.value = 'Chauffeurs';
    const _el_29 = document.getElementById('emp-role');
    if (_el_29) _el_29.value = '';
    const _el_30 = document.getElementById('emp-categorie');
    if (_el_30) _el_30.value = 'Ouvrier';
    const _el_31 = document.getElementById('emp-contrat');
    if (_el_31) _el_31.value = 'CDI';
    const _el_32 = document.getElementById('emp-date-entree');
    if (_el_32) _el_32.value = '';
    const _el_33 = document.getElementById('emp-visite-medicale');
    if (_el_33) _el_33.value = '';
    const _el_34 = document.getElementById('emp-telephone');
    if (_el_34) _el_34.value = '';
    const _el_35 = document.getElementById('emp-email');
    if (_el_35) _el_35.value = '';
    const _el_36 = document.getElementById('emp-epi-veste');
    if (_el_36) _el_36.value = '';
    const _el_37 = document.getElementById('emp-epi-pantalon');
    if (_el_37) _el_37.value = '';
    const _el_38 = document.getElementById('emp-epi-chaussures');
    if (_el_38) _el_38.value = '';

    document.getElementById('modal-employee')?.classList.add('active');
}

function calculateEmployeeLeaveStats(emp, year = '2026') {
    const cpAcquis = emp.cpAcquis !== undefined ? parseFloat(emp.cpAcquis) : 25;
    const rttAcquis = emp.rttAcquis !== undefined ? parseFloat(emp.rttAcquis) : 10;

    let cpPris = 0;
    let rttPris = 0;

    (emp.conges || []).forEach(c => {
        if (c.statut === 'Validé' && c.debut && c.fin && c.debut.startsWith(year)) {
            const days = calcDaysBetween(c.debut, c.fin);
            if (c.type === 'CP') cpPris += days;
            if (c.type === 'RTT') rttPris += days;
        }
    });

    const cpSolde = Math.max(0, cpAcquis - cpPris);
    const rttSolde = Math.max(0, rttAcquis - rttPris);

    return {
        cpAcquis,
        cpPris,
        cpSolde,
        rttAcquis,
        rttPris,
        rttSolde
    };
}

function openEditEmpModal(empId) {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;

    const _el_39 = document.getElementById('modal-emp-title');
    if (_el_39) _el_39.textContent = 'Modifier Profil Salarié';
    const _el_40 = document.getElementById('emp-id');
    if (_el_40) _el_40.value = emp.id;
    const _el_41 = document.getElementById('emp-nom');
    if (_el_41) _el_41.value = emp.nom || '';
    const _el_42 = document.getElementById('emp-prenom');
    if (_el_42) _el_42.value = emp.prenom || '';
    const _el_43 = document.getElementById('emp-metier');
    if (_el_43) _el_43.value = emp.metier || 'Chauffeurs';
    const _el_44 = document.getElementById('emp-role');
    if (_el_44) _el_44.value = emp.role || '';
    const _el_45 = document.getElementById('emp-categorie');
    if (_el_45) _el_45.value = emp.categorie || 'Ouvrier';
    const _el_46 = document.getElementById('emp-contrat');
    if (_el_46) _el_46.value = emp.contrat || 'CDI';
    const _el_47 = document.getElementById('emp-date-entree');
    if (_el_47) _el_47.value = emp.dateEntree || '';
    const _el_48 = document.getElementById('emp-visite-medicale');
    if (_el_48) _el_48.value = emp.visiteMedicale || '';
    const _el_49 = document.getElementById('emp-telephone');
    if (_el_49) _el_49.value = emp.telephone || '';
    const _el_50 = document.getElementById('emp-email');
    if (_el_50) _el_50.value = emp.email || '';
    const _el_51 = document.getElementById('emp-cp-acquis');
    if (_el_51) _el_51.value = emp.cpAcquis !== undefined ? emp.cpAcquis : 25;
    const _el_52 = document.getElementById('emp-rtt-acquis');
    if (_el_52) _el_52.value = emp.rttAcquis !== undefined ? emp.rttAcquis : 10;

    if (emp.tailleEpi) {
        const _el_53 = document.getElementById('emp-epi-veste');
        if (_el_53) _el_53.value = emp.tailleEpi.veste || '';
        const _el_54 = document.getElementById('emp-epi-pantalon');
        if (_el_54) _el_54.value = emp.tailleEpi.pantalon || '';
        const _el_55 = document.getElementById('emp-epi-chaussures');
        if (_el_55) _el_55.value = emp.tailleEpi.chaussures || '';
    } else {
        const _el_56 = document.getElementById('emp-epi-veste');
        if (_el_56) _el_56.value = '';
        const _el_57 = document.getElementById('emp-epi-pantalon');
        if (_el_57) _el_57.value = '';
        const _el_58 = document.getElementById('emp-epi-chaussures');
        if (_el_58) _el_58.value = '';
    }

    document.getElementById('modal-employee')?.classList.add('active');
}

function saveEmployeeForm(e) {
    e.preventDefault();

    const id = document.getElementById('emp-id')?.value;
    const nom = document.getElementById('emp-nom')?.value.trim();
    const prenom = document.getElementById('emp-prenom')?.value.trim();
    const metier = document.getElementById('emp-metier')?.value;
    const role = document.getElementById('emp-role')?.value.trim();
    const categorie = document.getElementById('emp-categorie')?.value;
    const contrat = document.getElementById('emp-contrat')?.value;
    const dateEntree = document.getElementById('emp-date-entree')?.value;
    const visiteMedicale = document.getElementById('emp-visite-medicale')?.value;
    const telephone = document.getElementById('emp-telephone')?.value.trim();
    const email = document.getElementById('emp-email')?.value.trim();
    const cpAcquis = parseFloat(document.getElementById('emp-cp-acquis')?.value) || 25;
    const rttAcquis = parseFloat(document.getElementById('emp-rtt-acquis')?.value) || 10;

    const veste = document.getElementById('emp-epi-veste')?.value.trim();
    const pantalon = document.getElementById('emp-epi-pantalon')?.value.trim();
    const chaussures = document.getElementById('emp-epi-chaussures')?.value.trim();

    if (!nom || !prenom) return;

    if (id) {
        const emp = employees.find(e => e.id === id);
        if (emp) {
            emp.nom = nom;
            emp.prenom = prenom;
            emp.metier = metier;
            emp.role = role;
            emp.categorie = categorie;
            emp.contrat = contrat;
            emp.dateEntree = dateEntree;
            emp.visiteMedicale = visiteMedicale;
            emp.telephone = telephone;
            emp.email = email;
            emp.cpAcquis = cpAcquis;
            emp.rttAcquis = rttAcquis;
            emp.tailleEpi = { veste, pantalon, chaussures };
        }
    } else {
        const newEmp = {
            id: 'emp_' + Date.now(),
            nom: nom,
            prenom: prenom,
            metier: metier,
            role: role,
            categorie: categorie,
            contrat: contrat,
            dateEntree: dateEntree,
            visiteMedicale: visiteMedicale,
            telephone: telephone,
            email: email,
            cpAcquis: cpAcquis,
            rttAcquis: rttAcquis,
            tailleEpi: { veste, pantalon, chaussures },
            statut: 'Actif',
            soldeCP: cpAcquis,
            soldeRTT: rttAcquis,
            documents: [],
            formations: [],
            conges: []
        };
        employees.push(newEmp);
    }

    processEmployeesFormationsStatus();
    saveEmployeesToStorage();
    closeModals();
    updateStats();
    renderPersonnel();
    renderConges();
    renderPlanning();
    renderFormationsMatrix();
}

function deleteEmployee(empId) {
    if (confirm('Voulez-vous vraiment supprimer ce collaborateur du système RH ?')) {
        employees = employees.filter(e => e.id !== empId);
        processEmployeesFormationsStatus();
        saveEmployeesToStorage();
        updateStats();
        renderPersonnel();
        renderConges();
        renderPlanning();
        renderFormationsMatrix();
    }
}

function renderEmployeeFiles(emp) {
    const listEl = document.getElementById('profile-files-list');
    listEl.innerHTML = '';

    const docs = emp.documents || [];

    if (docs.length === 0) {
        listEl.innerHTML = `<p style="text-align:center; padding: 14px; color: var(--text-muted); font-size: 0.82rem;">
            Aucun document n'a été versé au dossier.
        </p>`;
        return;
    }

    docs.forEach(doc => {
        const item = document.createElement('div');
        item.className = 'file-item';
        item.innerHTML = `
            <div class="file-item-info">
                <i class="fa-solid fa-file-pdf"></i>
                <div>
                    <strong style="color: var(--text-main); display: block;">${doc.name}</strong>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">${doc.type} • Ajouté le ${formatDateFR(doc.date)} (${doc.size || '300 KB'})</span>
                </div>
            </div>
            <div style="display: flex; gap: 8px;">
                <button class="btn btn-outline btn-sm" onclick="downloadDoc('${doc.id}')" title="Télécharger">
                    <i class="fa-solid fa-download"></i>
                </button>
                <button class="btn-icon danger" onclick="deleteDoc('${emp.id}', '${doc.id}')" title="Supprimer">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        listEl.appendChild(item);
    });
}

function downloadDoc(docId) {
    alert("Téléchargement du document RH simulé avec succès !");
}

function deleteDoc(empId, docId) {
    const emp = employees.find(e => e.id === empId);
    if (!emp || !emp.documents) return;

    if (confirm("Voulez-vous supprimer ce document du dossier RH ?")) {
        emp.documents = emp.documents.filter(d => d.id !== docId);
        saveEmployeesToStorage();
        updateStats();
        renderEmployeeFiles(emp);
    }
}

// ================= MODULE 2: GESTION DES CONGÉS =================

function renderConges() {
    renderCongesTable();
    renderCongesCalendar3Months();
}

function renderCongesTable() {
    const tbody = document.getElementById('conges-table-body');
    tbody.innerHTML = '';

    const year = document.getElementById('conges-year-select')?.value;
    const metierFilter = document.getElementById('filter-metier-conges')?.value;

    const filtered = employees.filter(emp => {
        if (metierFilter !== 'all' && emp.metier !== metierFilter) return false;
        return true;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 24px; color: var(--text-muted);">Aucun salarié trouvé.</td></tr>`;
        return;
    }

    filtered.forEach(emp => {
        const tr = document.createElement('tr');
        tr.className = 'clickable-row';
        tr.onclick = () => openProfileModal(emp.id);

        const congesList = (emp.conges || []).filter(c => {
            if (!c.debut) return true;
            return c.debut.startsWith(year);
        });

        let congesHtml = '';
        if (congesList.length === 0) {
            congesHtml = '<span style="color: var(--text-muted); font-size: 0.82rem;">Aucun congé posé sur cet exercice</span>';
        } else {
            congesList.forEach(c => {
                let badgeCl = 'badge-primary';
                if (c.type === 'RTT') badgeCl = 'badge-secondary';
                if (c.type === 'Maladie' || c.type === 'AT') badgeCl = 'badge-danger';
                if (c.type === 'SansSolde') badgeCl = 'badge-warning';

                const days = calcDaysBetween(c.debut, c.fin);

                congesHtml += `
                    <div style="margin-bottom: 6px; display: flex; align-items: center; gap: 8px;" onclick="event.stopPropagation()">
                        <span class="badge ${badgeCl}">${c.type} (${days}j)</span>
                        <span style="font-weight: 600;">Du ${formatDateFR(c.debut)} au ${formatDateFR(c.fin)}</span>
                        <span style="font-size: 0.78rem; color: var(--text-muted);">${c.motif ? '('+c.motif+')' : ''}</span>
                        <button class="btn-icon danger" style="width:24px; height:24px;" onclick="deleteConge('${emp.id}', '${c.id}')" title="Supprimer congé">
                            <i class="fa-solid fa-trash" style="font-size:0.75rem;"></i>
                        </button>
                    </div>
                `;
            });
        }

        const leaveStats = calculateEmployeeLeaveStats(emp, year);

        tr.innerHTML = `
            <td><strong>${emp.prenom} ${emp.nom}</strong></td>
            <td><span class="badge badge-gray">${emp.role || emp.metier}</span></td>
            <td style="text-align: center;">
                <span class="badge badge-primary" style="font-size:0.85rem; font-weight:700;">Restant : ${leaveStats.cpSolde} j</span>
                <div style="font-size:0.75rem; color:var(--text-muted); margin-top:3px;">Acquis: ${leaveStats.cpAcquis}j | Pris: ${leaveStats.cpPris}j</div>
            </td>
            <td style="text-align: center;">
                <span class="badge badge-secondary" style="font-size:0.85rem; font-weight:700;">Restant : ${leaveStats.rttSolde} j</span>
                <div style="font-size:0.75rem; color:var(--text-muted); margin-top:3px;">Acquis: ${leaveStats.rttAcquis}j | Pris: ${leaveStats.rttPris}j</div>
            </td>
            <td>${congesHtml}</td>
            <td style="text-align: right;" onclick="event.stopPropagation()">
                <button class="btn btn-outline btn-sm" onclick="openAddCongeForEmp('${emp.id}')">
                    <i class="fa-solid fa-plus"></i> Saisir Congé
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderCongesCalendar3Months() {
    const container = document.getElementById('conges-3months-grid');
    container.innerHTML = '';

    const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

    for (let mOffset = 0; mOffset < 3; mOffset++) {
        let monthIdx = currentCongesStartMonth + mOffset;
        let yearNum = currentCongesStartYear;

        if (monthIdx > 11) {
            monthIdx -= 12;
            yearNum++;
        }

        const monthBox = document.createElement('div');
        monthBox.style.border = '1px solid var(--border-color)';
        monthBox.style.borderRadius = '10px';
        monthBox.style.overflow = 'hidden';
        monthBox.style.background = '#ffffff';

        const headerHtml = `
            <div style="background: var(--primary-light); color: var(--primary); font-weight:700; padding: 10px 16px; font-size:1rem; border-bottom: 1px solid var(--border-color);">
                ${monthNames[monthIdx]} ${yearNum}
            </div>
            <div class="calendar-grid-header">
                <div>Lun</div><div>Mar</div><div>Mer</div><div>Jeu</div><div>Ven</div><div>Sam</div><div>Dim</div>
            </div>
        `;

        const firstDay = new Date(yearNum, monthIdx, 1);
        const lastDay = new Date(yearNum, monthIdx + 1, 0);

        let startingDay = firstDay.getDay() - 1;
        if (startingDay === -1) startingDay = 6;

        const totalDays = lastDay.getDate();

        let daysHtml = `<div class="calendar-grid-days">`;

        for (let i = 0; i < startingDay; i++) {
            daysHtml += `<div class="calendar-day-cell" style="background:#f8fafc;"></div>`;
        }

        for (let day = 1; day <= totalDays; day++) {
            const dayStr = `${yearNum}-${String(monthIdx + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            let eventsHtml = '';
            employees.forEach(emp => {
                (emp.conges || []).forEach(c => {
                    if (c.debut && c.fin && dayStr >= c.debut && dayStr <= c.fin) {
                        let tagCl = 'cp';
                        if (c.type === 'RTT') tagCl = 'rtt';
                        if (c.type === 'Maladie') tagCl = 'maladie';

                        eventsHtml += `<div class="calendar-event-tag ${tagCl}" title="${emp.prenom} ${emp.nom}: ${c.type}">
                            ${emp.prenom.charAt(0)}. ${emp.nom} (${c.type})
                        </div>`;
                    }
                });
            });

            daysHtml += `
                <div class="calendar-day-cell">
                    <div class="calendar-day-number">${day}</div>
                    ${eventsHtml}
                </div>
            `;
        }

        daysHtml += `</div>`;

        monthBox.innerHTML = headerHtml + daysHtml;
        container.appendChild(monthBox);
    }
}

function changeCongesQuarter(offset) {
    currentCongesStartMonth += offset * 3;
    if (currentCongesStartMonth < 0) {
        currentCongesStartMonth += 12;
        currentCongesStartYear--;
    } else if (currentCongesStartMonth > 11) {
        currentCongesStartMonth -= 12;
        currentCongesStartYear++;
    }
    renderCongesCalendar3Months();
}

function printCongesCalendarClean() {
    const gridHtml = document.getElementById('conges-3months-grid')?.innerHTML;
    const titleStr = document.getElementById('conges-calendar-title')?.textContent;

    const printContent = `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:3px solid #004d99; padding-bottom:8px; margin-bottom:12px;">
            <div style="font-size:22px; font-weight:900; color:#004d99;">PAPREC</div>
            <div style="text-align:right;">
                <strong>EXPLOITATION — PLANNING DES CONGÉS</strong><br>
                <span>${rhSettings.agenceNom}</span>
            </div>
        </div>
        <h3 style="text-align:center; color:#004d99; text-transform:uppercase; margin-bottom:12px;">${titleStr}</h3>
        <div>${gridHtml}</div>
    `;

    printCleanContent(printContent, "Planning Congés 3 Mois Paprec", true);
}

function openCongesNoticeModal() {
    document.getElementById('modal-conges-notice')?.classList.add('active');
}

function openAddCongeModal() {
    populateEmpSelect();
    const _el_59 = document.getElementById('conge-id');
    if (_el_59) _el_59.value = '';
    const _el_60 = document.getElementById('conge-debut');
    if (_el_60) _el_60.value = '';
    const _el_61 = document.getElementById('conge-fin');
    if (_el_61) _el_61.value = '';
    const _el_62 = document.getElementById('conge-motif');
    if (_el_62) _el_62.value = '';
    document.getElementById('modal-conge')?.classList.add('active');
}

function openAddCongeForEmp(empId) {
    populateEmpSelect();
    const _el_63 = document.getElementById('conge-emp-id');
    if (_el_63) _el_63.value = empId;
    const _el_64 = document.getElementById('conge-id');
    if (_el_64) _el_64.value = '';
    const _el_65 = document.getElementById('conge-debut');
    if (_el_65) _el_65.value = '';
    const _el_66 = document.getElementById('conge-fin');
    if (_el_66) _el_66.value = '';
    const _el_67 = document.getElementById('conge-motif');
    if (_el_67) _el_67.value = '';
    document.getElementById('modal-conge')?.classList.add('active');
}

function populateEmpSelect() {
    const sel = document.getElementById('conge-emp-id');
    sel.innerHTML = '';
    employees.forEach(emp => {
        const opt = document.createElement('option');
        opt.value = emp.id;
        opt.textContent = `${emp.nom} ${emp.prenom} (${emp.metier})`;
        sel.appendChild(opt);
    });
}

function saveCongeForm(e) {
    e.preventDefault();

    const empId = document.getElementById('conge-emp-id')?.value;
    const type = document.getElementById('conge-type')?.value;
    const statut = document.getElementById('conge-statut')?.value;
    const debut = document.getElementById('conge-debut')?.value;
    const fin = document.getElementById('conge-fin')?.value;
    const motif = document.getElementById('conge-motif')?.value.trim();

    const emp = employees.find(e => e.id === empId);
    if (!emp || !debut || !fin) return;

    if (!emp.conges) emp.conges = [];

    const newConge = {
        id: 'c_' + Date.now(),
        type: type,
        debut: debut,
        fin: fin,
        statut: statut,
        motif: motif
    };

    emp.conges.push(newConge);

    if (statut === 'Validé') {
        const days = calcDaysBetween(debut, fin);
        if (type === 'CP' && emp.soldeCP) emp.soldeCP = Math.max(0, emp.soldeCP - days);
        if (type === 'RTT' && emp.soldeRTT) emp.soldeRTT = Math.max(0, emp.soldeRTT - days);
    }

    saveEmployeesToStorage();
    closeModals();
    renderConges();
    renderPlanning();
}

function deleteConge(empId, congeId) {
    const emp = employees.find(e => e.id === empId);
    if (!emp || !emp.conges) return;

    if (confirm("Voulez-vous annuler ce congé ?")) {
        emp.conges = emp.conges.filter(c => c.id !== congeId);
        saveEmployeesToStorage();
        renderConges();
        renderPlanning();
    }
}

// ================= MODULE 3: PLANNING INTERACTIF =================

function renderPlanning() {
    renderPlanningTable();
}

function getDateForWeekDay(weekKey, dayIndex) {
    const year = parseInt(weekKey.substring(0, 4)) || 2026;
    const week = parseInt(weekKey.substring(6)) || 30;
    const day = 20 + dayIndex;
    return `${year}-07-${String(day).padStart(2, '0')}`;
}

function renderPlanningTable() {
    const tbody = document.getElementById('planning-table-body');
    tbody.innerHTML = '';

    const weekKey = document.getElementById('planning-week-picker')?.value || '2026-W30';
    const filterMetier = document.getElementById('filter-metier-planning')?.value;

    const filtered = employees.filter(emp => {
        if (filterMetier !== 'all' && emp.metier !== filterMetier) return false;
        return true;
    });

    const weekSchedule = planningData[weekKey] || [];
    const days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

    filtered.forEach(emp => {
        const tr = document.createElement('tr');

        let empPlan = weekSchedule.find(p => p.empId === emp.id);
        if (!empPlan) {
            empPlan = {
                empId: emp.id,
                lundi: 'Service Standard',
                mardi: 'Service Standard',
                mercredi: 'Service Standard',
                jeudi: 'Service Standard',
                vendredi: 'Service Standard',
                samedi: 'Repos',
                dimanche: 'Repos'
            };
        }

        let daysHtml = '';

        days.forEach((day, idx) => {
            const dayDateStr = getDateForWeekDay(weekKey, idx);

            let congeOnDay = null;
            (emp.conges || []).forEach(c => {
                if (c.debut && c.fin && dayDateStr >= c.debut && dayDateStr <= c.fin) {
                    congeOnDay = c;
                }
            });

            let val = empPlan[day] || 'Repos';
            let cellClass = 'cell-shift';

            if (congeOnDay) {
                val = `CONGÉ (${congeOnDay.type})`;
                cellClass = 'cell-conge';
            } else if (val === 'Repos') {
                cellClass = 'cell-rest';
            }

            daysHtml += `
                <td onclick="openPlanningCellModal('${emp.id}', '${day}', '${weekKey}')">
                    <div class="${cellClass}">${val}</div>
                </td>
            `;
        });

        tr.innerHTML = `
            <td onclick="openProfileModal('${emp.id}')" style="cursor:pointer;">
                <strong>${emp.prenom} ${emp.nom}</strong>
                <br><span style="font-size:0.75rem; color:var(--text-muted);">${emp.role || emp.metier}</span>
            </td>
            ${daysHtml}
        `;

        tbody.appendChild(tr);
    });
}

function openPlanningCellModal(empId, dayKey, weekKey) {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;

    activePlanningCell = { empId, dayKey, weekKey };

    let weekSchedule = planningData[weekKey] || [];
    let empPlan = weekSchedule.find(p => p.empId === empId);
    const currentVal = empPlan ? (empPlan[dayKey] || '') : '';

    const dayName = dayKey.charAt(0).toUpperCase() + dayKey.slice(1);
    const _el_68 = document.getElementById('planning-cell-info');
    if (_el_68) _el_68.textContent = `${emp.prenom} ${emp.nom} — ${dayName} (${weekKey})`;
    const _el_69 = document.getElementById('planning-cell-text');
    if (_el_69) _el_69.value = currentVal;

    document.getElementById('modal-planning-cell')?.classList.add('active');
}

function savePlanningCell() {
    if (!activePlanningCell) return;
    const { empId, dayKey, weekKey } = activePlanningCell;

    const textVal = document.getElementById('planning-cell-text')?.value.trim() || 'Repos';

    if (!planningData[weekKey]) planningData[weekKey] = [];

    let empPlan = planningData[weekKey].find(p => p.empId === empId);
    if (empPlan) {
        empPlan[dayKey] = textVal;
    } else {
        const newPlan = { empId: empId };
        newPlan[dayKey] = textVal;
        planningData[weekKey].push(newPlan);
    }

    savePlanningToStorage();
    closeModals();
    renderPlanning();
}

function printWeeklyPlanningClean() {
    const tableHtml = document.getElementById('planning-main-table')?.outerHTML;
    const weekVal = document.getElementById('planning-week-picker')?.value || '2026-W30';

    const printContent = `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:3px solid #004d99; padding-bottom:8px; margin-bottom:12px;">
            <div style="font-size:22px; font-weight:900; color:#004d99;">PAPREC</div>
            <div style="text-align:right;">
                <strong>EXPLOITATION — PLANNING HEBDOMADAIRE</strong><br>
                <span>${rhSettings.agenceNom}</span>
            </div>
        </div>
        <h3 style="text-align:center; color:#004d99; text-transform:uppercase; margin-bottom:12px;">PLANNING DE SERVICE — SEMAINE ${weekVal}</h3>
        <div>${tableHtml}</div>
    `;

    printCleanContent(printContent, `Planning Semaine ${weekVal}`, true);
}

// ================= MODULE 4: DOCUMENTS, FICHES & PROCÉDURES RH =================

function renderFichesPoste() {
    const container = document.getElementById('fiches-poste-grid');
    if (!container) return;
    container.innerHTML = '';

    fichesPoste.forEach(fp => {
        const card = document.createElement('div');
        card.className = 'doc-card';

        let compHtml = '';
        if (fp.competences) {
            fp.competences.forEach(c => {
                compHtml += `<span class="badge badge-gray" style="margin-right: 4px; margin-bottom: 4px;">${c}</span>`;
            });
        }

        card.innerHTML = `
            <div class="doc-card-header">
                <div class="doc-card-icon"><i class="fa-solid fa-id-badge"></i></div>
                <div>
                    <h4>${fp.titre}</h4>
                    <span class="badge badge-primary">${fp.metier} • ${fp.version}</span>
                </div>
            </div>
            <p>${fp.description}</p>
            <div style="margin-bottom: 16px;">${compHtml}</div>
            <button class="btn btn-primary btn-sm" onclick="openPrintableFichePosteModal('${fp.id}')">
                <i class="fa-solid fa-print"></i> Consulter & Imprimer
            </button>
        `;
        container.appendChild(card);
    });
}

function openChauffeurFicheEditor() {
    const sel = document.getElementById('ch-editor-emp');
    sel.innerHTML = '';

    const chauffeurs = employees.filter(e => e.metier === 'Chauffeurs' || e.role.toLowerCase().includes('chauffeur'));
    chauffeurs.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = `${c.nom} ${c.prenom} (${c.role})`;
        sel.appendChild(opt);
    });

    if (chauffeurs.length > 0) autoFillChauffeurEditor(chauffeurs[0].id);

    document.getElementById('modal-fiche-chauffeur-editor')?.classList.add('active');
}

function autoFillChauffeurEditor(empId) {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;

    const _el_70 = document.getElementById('ch-editor-nom');
    if (_el_70) _el_70.value = emp.nom || '';
    const _el_71 = document.getElementById('ch-editor-prenom');
    if (_el_71) _el_71.value = emp.prenom || '';
    const _el_72 = document.getElementById('ch-editor-fonction');
    if (_el_72) _el_72.value = emp.role || 'Chauffeur PL / SPL Ampliroll';
}

// EXACT VISUAL LAYOUT CLONE OF OFFICIAL PAPREC FORM DE39 (ZERO IMAGES AT PRINT)
function generateAndPrintChauffeurFiche() {
    // 1. INFO GÉNÉRALE
    const nom = (document.getElementById('ch-editor-nom')?.value || 'NOM').trim();
    const prenom = (document.getElementById('ch-editor-prenom')?.value || 'Prénom').trim();
    const fonction = (document.getElementById('ch-editor-fonction')?.value || 'Chauffeur PL / SPL').trim();
    const affectation = (document.getElementById('ch-editor-affectation')?.value || rhSettings.agenceNom).trim();

    // 2. TYPE DE PERMIS & HABILITATIONS
    const permisType = (document.getElementById('ch-editor-permis-type')?.value || 'Permis Poids Lourds / Super Lourds').trim();
    const permisCat = document.getElementById('ch-editor-permis-cat')?.value || 'Permis CE (Super Lourds)';
    const permisValidite = document.getElementById('ch-editor-permis-validite')?.value || '';
    const permisDateObt = document.getElementById('ch-editor-permis-date-obt')?.value || '';
    const permisOrganisme = (document.getElementById('ch-editor-permis-organisme')?.value || 'AFTRAL / ECF').trim();
    const permisDateAuto = document.getElementById('ch-editor-permis-date-auto')?.value || '';

    closeModals();

    const htmlContent = `
        <table class="de39-header-table">
            <tr>
                <td style="width: 25%; font-weight: 900; font-size: 20px; color: #004d99; text-align: center;">
                    PAPREC
                </td>
                <td style="width: 50%; font-size: 16px; font-weight: 800; text-align: center; color: #004d99;">
                    FICHE DE POSTE — CHAUFFEUR
                </td>
                <td style="width: 25%; font-size: 11px; text-align: right;">
                    <strong>N° DE 39</strong><br>
                    Date de version : 22/06/16<br>
                    <strong>Version : 6</strong>
                </td>
            </tr>
        </table>

        <!-- BLOCK 1: INFORMATIONS GÉNÉRALES -->
        <table class="de39-table" style="margin-bottom: 10px;">
            <thead>
                <tr>
                    <th colspan="4" style="background: #004d99; color: white; text-align: left;">INFORMATIONS GÉNÉRALES SALARIÉ</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th style="width: 18%;">Nom :</th>
                    <td style="width: 32%;"><strong>${nom.toUpperCase()}</strong></td>
                    <th style="width: 18%;">Prénom :</th>
                    <td style="width: 32%;"><strong>${prenom}</strong></td>
                </tr>
                <tr>
                    <th>Fonction :</th>
                    <td><strong>${fonction}</strong></td>
                    <th>Affectation :</th>
                    <td>${affectation}</td>
                </tr>
            </tbody>
        </table>

        <!-- BLOCK 2: TYPE DE PERMIS & PERMISSION -->
        <table class="de39-table" style="margin-bottom: 12px;">
            <thead>
                <tr>
                    <th colspan="4" style="background: #004d99; color: white; text-align: left;">TYPE DE PERMIS DE CONDUIRE & HABILITATIONS</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th style="width: 18%;">Type de Permis :</th>
                    <td style="width: 32%;">${permisType}</td>
                    <th style="width: 18%;">Catégorie :</th>
                    <td style="width: 32%;"><strong>${permisCat}</strong></td>
                </tr>
                <tr>
                    <th>Validité (Exp.) :</th>
                    <td>${formatDateFR(permisValidite)}</td>
                    <th>Date d'obtention :</th>
                    <td>${formatDateFR(permisDateObt)}</td>
                </tr>
                <tr>
                    <th>Organisme :</th>
                    <td>${permisOrganisme}</td>
                    <th>Autorisation délivrée le :</th>
                    <td><strong>${formatDateFR(permisDateAuto)}</strong></td>
                </tr>
            </tbody>
        </table>

        <table class="de39-table">
            <thead>
                <tr>
                    <th style="width: 28%;">PROCESSUS / DOMAINES</th>
                    <th>MISSIONS & RESPONSABILITÉS DÉTAILLÉES (DE39 - VERSION 6)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="de39-section-hdr" colspan="2">1. MISSIONS LIÉES AU POSTE DE CHAUFFEUR</td>
                </tr>
                <tr>
                    <td><strong>Rotations chez les clients suivant planning d'enlèvement</strong></td>
                    <td>
                        <ul style="margin-left: 16px;">
                            <li>Assure la collecte des déchets chez les clients fournisseurs de déchets à recycler.</li>
                            <li>Dépose les bennes et contenants vides chez les clients.</li>
                            <li>Effectue les enlèvements des bennes ou contenants suivant les instructions du planning.</li>
                            <li>Surveille l'état des bennes et contenants lors de l'enlèvement.</li>
                            <li>Décharge les bennes ou contenants sur le site en fonction des indications du responsable atelier / dépôt.</li>
                            <li>Signale les problèmes rencontrés chez les clients au service planning.</li>
                            <li>Demande la signature des bons de livraison et BSD par les services compétents des clients.</li>
                            <li>Respecte les protocoles de sécurité en vigueur chez les clients.</li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td><strong>Entretien courant des camions et des bennes</strong></td>
                    <td>
                        <ul style="margin-left: 16px;">
                            <li>Effectue le nettoyage quotidien du véhicule (cabine, pare-brise, carrosserie).</li>
                            <li>Effectue l'entretien et les contrôles courants des véhicules (niveaux d'huile, liquide de refroidissement, pneumatiques).</li>
                            <li>Entretient la propreté des bennes (balayage systématique du fond des bennes après vidage).</li>
                            <li>Indique immédiatement les avaries et dysfonctionnements sur les camions et bennes au service planning.</li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td class="de39-section-hdr" colspan="2">2. MISSIONS LIÉES AUX ASPECTS QUALITÉ SÉCURITÉ ENVIRONNEMENT (SMQSE)</td>
                </tr>
                <tr>
                    <td><strong>Participe au SMQSE de l'Agence Paprec</strong></td>
                    <td>
                        <ul style="margin-left: 16px;">
                            <li>Veille à l'application des modes opératoires et consignes en relation avec le métier de chauffeur.</li>
                            <li>Applique les procédures et consignes du système de management environnement.</li>
                            <li>Communique au correspondant environnement tout dysfonctionnement constaté.</li>
                            <li>Propose toute action d'amélioration utile à l'exploitation.</li>
                            <li>Participe au tri sélectif des déchets de bureau.</li>
                            <li>Respecte les consignes d'hygiène et de sécurité du site.</li>
                            <li>Port obligatoire des Équipements de Protection Individuelle (EPI) requis (Casque, Gilet Haute Visibilité, Chaussures de sécurité S3, Gants de protection).</li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td class="de39-section-hdr" colspan="2">3. CONNAISSANCES REQUISES & HABILITATIONS</td>
                </tr>
                <tr>
                    <td><strong>Connaissances techniques & Habilitations</strong></td>
                    <td>
                        Permis PL / SPL • FIMO / FCO à jour • CACES R490 si grue sur camion • Connaissance du gabarit du camion • Respect scrupuleux des <strong>12 Incontournables Chauffeurs Paprec</strong>.
                    </td>
                </tr>
            </tbody>
        </table>

        <div style="margin-top: 10px; font-size: 11px; line-height: 1.4; padding: 6px; border: 1px solid #cbd5e1; background: #f8fafc;">
            <strong>Engagement du Salarié :</strong> Je soussigné(e) certifie avoir pris connaissance des missions, consignes QSE et responsabilités relatives au poste de Chauffeur (DE39 - V6) et m'engage à les appliquer quotidiennement.
        </div>

        <div class="print-signatures">
            <div class="print-sig-box">
                Signature du Conducteur Salarié<br><br><br>
                Date : ____/____/2026
            </div>
            <div class="print-sig-box" style="text-align: right;">
                Pour la Direction Paprec RH<br>
                <strong>${rhSettings.signataireNom}</strong><br><br>
                Date : ____/____/2026
            </div>
        </div>
    `;

    printCleanContent(htmlContent, `Fiche de Poste DE39 Chauffeur - ${nom}`, false);
}

// ACCUEIL AU POSTE MODAL & CLEAN PRINT GENERATOR
function openAccueilEditorModal() {
    const sel = document.getElementById('acc-editor-emp');
    sel.innerHTML = '';

    employees.forEach(e => {
        const opt = document.createElement('option');
        opt.value = e.id;
        opt.textContent = `${e.nom} ${e.prenom} (${e.role || e.metier})`;
        sel.appendChild(opt);
    });

    if (employees.length > 0) autoFillAccueilEditor(employees[0].id);
    document.getElementById('modal-accueil-editor')?.classList.add('active');
}

function autoFillAccueilEditor(empId) {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;

    const _el_73 = document.getElementById('acc-editor-nom');
    if (_el_73) _el_73.value = `${emp.nom} ${emp.prenom}`;
}

function generateAndPrintAccueilFiche() {
    const nom = document.getElementById('acc-editor-nom')?.value.trim() || 'Salarié';
    const datePoste = document.getElementById('acc-editor-date')?.value;
    const parrain = document.getElementById('acc-editor-parrain')?.value;
    const contrat = document.getElementById('acc-editor-contrat')?.value;
    const epiRemis = document.getElementById('acc-editor-epi')?.value;

    closeModals();

    const htmlContent = `
        <div class="print-header">
            <div class="logo">PAPREC</div>
            <div style="text-align: right;">
                <strong style="color: #004d99;">INTÉGRATION & SÉCURITÉ ONBOARDING</strong><br>
                <span style="font-size: 0.85rem; color: #64748b;">${rhSettings.agenceNom}</span>
            </div>
        </div>

        <div class="print-title">LIVRET & FICHE D'ACCUEIL AU POSTE (ÉMARGEMENT QSE)</div>

        <table class="de39-table">
            <tr>
                <th style="width: 30%;">Nouvel Arrivant :</th>
                <td><strong>${nom.toUpperCase()}</strong></td>
                <th style="width: 20%;">Date de Prise de Poste :</th>
                <td>${formatDateFR(datePoste)}</td>
            </tr>
            <tr>
                <th>Statut / Contrat :</th>
                <td>${contrat}</td>
                <th>Formateur / Parrain Référent :</th>
                <td>${parrain}</td>
            </tr>
        </table>

        <h4 style="color: #004d99; margin: 16px 0 8px 0;">Contrôle et Validation de l'Intégration QSE :</h4>
        <ul style="margin-left: 20px; font-size: 0.9rem; line-height: 1.8;">
            <li>✔️ Remise et présentation du Livret d'Accueil & Règlement d'Intérieur Paprec.</li>
            <li>✔️ Remise et vérification des Équipements de Protection Individuelle (EPI) : <em>${epiRemis}</em>.</li>
            <li>✔️ Présentation du Protocole de Sécurité du site et des règles de circulation.</li>
            <li>✔️ Visite guidée des installations usine, repérage des zones à risques et de l'arrêt d'urgence.</li>
            <li>✔️ Sensibilisation aux consignes d'incendie, d'évacuation et repérage des Sauveteurs Secouristes (SST).</li>
        </ul>

        <div class="print-signatures">
            <div class="print-sig-box">
                Signature du Nouvel Arrivant<br><br><br>
                Date : ____/____/2026
            </div>
            <div class="print-sig-box" style="text-align: right;">
                Pour la Direction Paprec RH<br>
                <strong>${rhSettings.signataireNom}</strong><br><br>
                Date : ____/____/2026
            </div>
        </div>
    `;

    printCleanContent(htmlContent, `Fiche d'Accueil au Poste - ${nom}`, false);
}

// EAE (ENTRETIEN ANNUEL GROUPE PAPREC) MODAL & CLEAN PRINT
function openEIEEditorModal() {
    const sel = document.getElementById('eie-editor-emp');
    sel.innerHTML = '';

    employees.forEach(e => {
        const opt = document.createElement('option');
        opt.value = e.id;
        opt.textContent = `${e.nom} ${e.prenom} (${e.role || e.metier})`;
        sel.appendChild(opt);
    });

    if (employees.length > 0) autoFillEIEEditor(employees[0].id);
    document.getElementById('modal-eie-editor')?.classList.add('active');
}

function autoFillEIEEditor(empId) {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;

    const _el_74 = document.getElementById('eie-editor-nom');
    if (_el_74) _el_74.value = `${emp.nom} ${emp.prenom}`;
}

function generateAndPrintEIE() {
    const nom = document.getElementById('eie-editor-nom')?.value.trim() || 'Salarié';
    const periode = document.getElementById('eie-editor-periode')?.value;
    const q1 = document.getElementById('eie-q1')?.value;
    const q2 = document.getElementById('eie-q2')?.value;
    const pointsForts = document.getElementById('eie-editor-pointsforts')?.value;
    const objectifs = document.getElementById('eie-editor-objectifs')?.value;

    closeModals();

    const htmlContent = `
        <div class="print-header">
            <div class="logo">PAPREC</div>
            <div style="text-align: right;">
                <strong style="color: #004d99;">FORMULAIRE ANNUEL PAPREC GROUPE</strong><br>
                <span style="font-size: 0.85rem; color: #64748b;">Entretien d'Évaluation (EAE Ouvriers / Employés)</span>
            </div>
        </div>

        <div class="print-title">FORMULAIRE D'ENTRETIEN ANNUEL D'ÉVALUATION (EAE)</div>

        <table class="de39-table">
            <tr>
                <th style="width: 30%;">Collaborateur Évalué :</th>
                <td><strong>${nom.toUpperCase()}</strong></td>
                <th style="width: 20%;">Période Évaluée :</th>
                <td>${periode}</td>
            </tr>
            <tr>
                <th>Manager Évaluateur :</th>
                <td colspan="3"><strong>${rhSettings.signataireNom}</strong> (${rhSettings.signataireTitre})</td>
            </tr>
        </table>

        <h4 style="color: #004d99; margin: 16px 0 8px 0;">Grille de Synthèse (A = Supérieur / B = Conforme / C = À améliorer) :</h4>
        <table class="de39-table">
            <tr><th>Critère de Savoir-faire & Savoir-être</th><th style="width:120px; text-align:center;">Évaluation</th></tr>
            <tr><td>Réalise un travail de qualité dans le temps imparti</td><td style="text-align:center;"><strong>${q1}</strong></td></tr>
            <tr><td>Respect des consignes QSE, d'hygiène et de sécurité</td><td style="text-align:center;"><strong>${q2}</strong></td></tr>
        </table>

        <h4 style="color: #004d99; margin: 16px 0 8px 0;">Bilan Général & Appréciations du Manager :</h4>
        <p style="font-size: 0.9rem; line-height: 1.6; padding: 10px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px;">
            ${pointsForts}
        </p>

        <h4 style="color: #004d99; margin: 16px 0 8px 0;">Objectifs Fixés pour la Période À Venir :</h4>
        <p style="font-size: 0.9rem; line-height: 1.6; padding: 10px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px;">
            ${objectifs}
        </p>

        <div class="print-signatures">
            <div class="print-sig-box">
                Signature du Salarié Évalué<br><br><br>
                Date : ____/____/2026
            </div>
            <div class="print-sig-box" style="text-align: right;">
                Signature de la Responsable RH<br>
                <strong>${rhSettings.signataireNom}</strong><br><br>
                Date : ____/____/2026
            </div>
        </div>
    `;

    printCleanContent(htmlContent, `EAE Formulaire Paprec - ${nom}`, false);
}

// EP (ENTRETIEN PROFESSIONNEL LÉGAL 2 ANS) MODAL & CLEAN PRINT
function openEPEditorModal() {
    const sel = document.getElementById('ep-editor-emp');
    sel.innerHTML = '';

    employees.forEach(e => {
        const opt = document.createElement('option');
        opt.value = e.id;
        opt.textContent = `${e.nom} ${e.prenom} (${e.role || e.metier})`;
        sel.appendChild(opt);
    });

    if (employees.length > 0) autoFillEPEditor(employees[0].id);
    document.getElementById('modal-ep-editor')?.classList.add('active');
}

function autoFillEPEditor(empId) {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;

    const _el_75 = document.getElementById('ep-editor-nom');
    if (_el_75) _el_75.value = `${emp.nom} ${emp.prenom}`;
}

function generateAndPrintEP() {
    const nom = document.getElementById('ep-editor-nom')?.value.trim() || 'Salarié';
    const dateEntretien = document.getElementById('ep-editor-date')?.value;
    const souhaits = document.getElementById('ep-editor-souhaits')?.value;
    const formationsPrev = document.getElementById('ep-editor-formations')?.value;

    closeModals();

    const htmlContent = `
        <div class="print-header">
            <div class="logo">PAPREC</div>
            <div style="text-align: right;">
                <strong style="color: #004d99;">OBLIGATION LÉGALE (ART. L. 6315-1)</strong><br>
                <span style="font-size: 0.85rem; color: #64748b;">Entretien Professionnel (EP 2 Ans)</span>
            </div>
        </div>

        <div class="print-title">FICHE D'ENTRETIEN PROFESSIONNEL (EP BIENNAL)</div>

        <table class="de39-table">
            <tr>
                <th style="width: 30%;">Salarié :</th>
                <td><strong>${nom.toUpperCase()}</strong></td>
                <th style="width: 20%;">Date d'Entretien :</th>
                <td>${formatDateFR(dateEntretien)}</td>
            </tr>
            <tr>
                <th>Entretien Réalisé Par :</th>
                <td colspan="3"><strong>${rhSettings.signataireNom}</strong> (${rhSettings.signataireTitre})</td>
            </tr>
        </table>

        <h4 style="color: #004d99; margin: 16px 0 8px 0;">1. Souhaits d'Évolution Professionnelle & Qualification :</h4>
        <p style="font-size: 0.9rem; line-height: 1.6; padding: 10px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px;">
            ${souhaits}
        </p>

        <h4 style="color: #004d99; margin: 16px 0 8px 0;">2. Formations Certifiantes & Parcours Réalisé :</h4>
        <p style="font-size: 0.9rem; line-height: 1.6; padding: 10px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px;">
            ${formationsPrev}
        </p>

        <div class="print-signatures">
            <div class="print-sig-box">
                Signature du Salarié<br><br><br>
                Date : ____/____/2026
            </div>
            <div class="print-sig-box" style="text-align: right;">
                Pour la Direction Paprec RH<br>
                <strong>${rhSettings.signataireNom}</strong><br><br>
                Date : ____/____/2026
            </div>
        </div>
    `;

    printCleanContent(htmlContent, `Entretien Professionnel EP - ${nom}`, false);
}

function openPrintableFichePosteModal(fpId) {
    const fp = fichesPoste.find(f => f.id === fpId);
    if (!fp) return;

    let compListHtml = '';
    (fp.competences || []).forEach(c => {
        compListHtml += `<li>${c}</li>`;
    });

    const htmlContent = `
        <div class="print-header">
            <div class="logo">PAPREC</div>
            <div style="text-align: right;">
                <strong style="color: #004d99;">FICHE DE POSTE QSE</strong><br>
                <span style="font-size: 0.85rem; color: #64748b;">Réf: ${fp.version} - ${rhSettings.agenceNom}</span>
            </div>
        </div>

        <div class="print-title">${fp.titre}</div>

        <table class="de39-table">
            <tr>
                <th style="width: 30%;">Intitulé du Poste :</th>
                <td><strong>${fp.titre}</strong></td>
            </tr>
            <tr>
                <th>Corps de Métier :</th>
                <td>${fp.metier}</td>
            </tr>
            <tr>
                <th>Rattachement :</th>
                <td>${rhSettings.signataireTitre} (${rhSettings.signataireNom})</td>
            </tr>
        </table>

        <h4 style="color: #004d99; margin: 20px 0 10px 0;">Description des Missions & Activités :</h4>
        <p style="line-height: 1.6; font-size: 0.95rem; margin-bottom: 20px;">
            ${fp.description}
        </p>

        <h4 style="color: #004d99; margin: 20px 0 10px 0;">Compétences & Habilitations Requises :</h4>
        <ul style="margin-left: 20px; font-size: 0.95rem; line-height: 1.8;">
            ${compListHtml}
        </ul>

        <div class="print-signatures">
            <div class="print-sig-box">
                Signature du Salarié<br><br><br>
                Date : ____/____/2026
            </div>
            <div class="print-sig-box" style="text-align: right;">
                Pour la Direction Paprec QSE<br>
                <strong>${rhSettings.signataireNom}</strong><br><br>
                Date : ____/____/2026
            </div>
        </div>
    `;

    printCleanContent(htmlContent, `Fiche de Poste - ${fp.titre}`, false);
}

function openPrintableFormModal(formType) {
    if (formType === 'accueil_poste') { openAccueilEditorModal(); return; }
    if (formType === 'entretien_individuel') { openEIEEditorModal(); return; }
    if (formType === 'entretien_professionnel') { openEPEditorModal(); return; }

    const empSelectHtml = employees.map(e => `<option value="${e.id}">${e.nom} ${e.prenom} (${e.role || e.metier})</option>`).join('');
    const docContent = document.getElementById('printable-doc-content');

    if (formType === 'acompte') {
        docContent.innerHTML = `
            <div class="print-header">
                <div class="logo">PAPREC</div>
                <div style="text-align: right;">
                    <strong style="color: #004d99;">FORMULAIRE RH - PAYE (Art. L. 3242-1)</strong><br>
                    <span style="font-size: 0.85rem; color: #64748b;">Demande d'Acompte sur Salaire</span>
                </div>
            </div>

            <div class="print-title">DEMANDE D'ACOMPTE SUR SALAIRE</div>

            <div style="margin-bottom: 20px;">
                <label style="font-weight: 700;">Sélectionner le Collaborateur :</label>
                <select id="print-emp-select" class="form-select" style="width: 100%; margin-top: 6px;" onchange="updatePrintFormEmp(this.value)">
                    ${empSelectHtml}
                </select>
            </div>

            <table class="de39-table">
                <tr>
                    <th style="width: 30%;">Nom & Prénom :</th>
                    <td id="pform-name"><strong>${employees[0].nom} ${employees[0].prenom}</strong></td>
                </tr>
                <tr>
                    <th>Emploi / Poste :</th>
                    <td id="pform-role">${employees[0].role || employees[0].metier}</td>
                </tr>
                <tr>
                    <th>Montant de l'Acompte demandé :</th>
                    <td><input type="text" value="300,00 €" class="form-input" style="font-weight:700;"></td>
                </tr>
                <tr>
                    <th>Date de versement souhaitée :</th>
                    <td><input type="date" value="${new Date().toISOString().split('T')[0]}" class="form-input"></td>
                </tr>
            </table>

            <p style="margin: 20px 0; font-size: 0.9rem; line-height: 1.6;">
                Je soussigné(e), sollicite par la présente un acompte sur mon salaire du mois en cours conformément à l'article L. 3242-1 du Code du travail. J'autorise l'entreprise PAPREC à déduire cette somme lors du traitement de ma paie.
            </p>

            <div class="print-signatures">
                <div class="print-sig-box">
                    Signature du Demandeur<br><br><br>
                    Date : ____/____/2026
                </div>
                <div class="print-sig-box" style="text-align: right;">
                    Validation Responsable RH<br>
                    <strong>${rhSettings.signataireNom}</strong><br><br>
                    Date : ____/____/2026
                </div>
            </div>
        `;
    } else if (formType === '13eme_mois') {
        docContent.innerHTML = `
            <div class="print-header">
                <div class="logo">PAPREC</div>
                <div style="text-align: right;">
                    <strong style="color: #004d99;">ACCORD D'ENTREPRISE</strong><br>
                    <span style="font-size: 0.85rem; color: #64748b;">Avance 13ème Mois</span>
                </div>
            </div>

            <div class="print-title">DEMANDE D'AVANCE 13ÈME MOIS</div>

            <div style="margin-bottom: 20px;">
                <label style="font-weight: 700;">Sélectionner le Collaborateur :</label>
                <select id="print-emp-select" class="form-select" style="width: 100%; margin-top: 6px;" onchange="updatePrintFormEmp(this.value)">
                    ${empSelectHtml}
                </select>
            </div>

            <table class="de39-table">
                <tr>
                    <th style="width: 30%;">Nom & Prénom :</th>
                    <td id="pform-name"><strong>${employees[0].nom} ${employees[0].prenom}</strong></td>
                </tr>
                <tr>
                    <th>Type d'Avance :</th>
                    <td>
                        <select class="form-select">
                            <option>1er Tiers (Versement de Juin)</option>
                            <option>2ème Tiers (Versement de Septembre)</option>
                        </select>
                    </td>
                </tr>
            </table>

            <div class="print-signatures">
                <div class="print-sig-box">
                    Signature du Salarié<br><br><br>
                    Date : ____/____/2026
                </div>
                <div class="print-sig-box" style="text-align: right;">
                    Accord Responsable RH<br>
                    <strong>${rhSettings.signataireNom}</strong><br><br>
                    Date : ____/____/2026
                </div>
            </div>
        `;
    } else {
        docContent.innerHTML = `
            <div class="print-header">
                <div class="logo">PAPREC</div>
                <div style="text-align: right;">
                    <strong style="color: #004d99;">ATTESTATION D'EMPLOI</strong><br>
                    <span style="font-size: 0.85rem; color: #64748b;">${rhSettings.agenceNom}</span>
                </div>
            </div>

            <div class="print-title">ATTESTATION D'EMPLOI ET D'ACTIVITÉ</div>

            <div style="margin-bottom: 20px;">
                <label style="font-weight: 700;">Sélectionner le Collaborateur :</label>
                <select id="print-emp-select" class="form-select" style="width: 100%; margin-top: 6px;" onchange="updatePrintFormEmp(this.value)">
                    ${empSelectHtml}
                </select>
            </div>

            <p style="margin: 24px 0; font-size: 1.05rem; line-height: 1.8;">
                Je soussignée, <strong>${rhSettings.signataireNom}</strong>, agissant en qualité de <strong>${rhSettings.signataireTitre}</strong> de la société <strong>${rhSettings.agenceNom}</strong>, certifie que M./Mme <strong id="pform-name">${employees[0].nom} ${employees[0].prenom}</strong> est employé(e) au sein de notre établissement en qualité de <strong id="pform-role">${employees[0].role || employees[0].metier}</strong> depuis le <strong>${formatDateFR(employees[0].dateEntree)}</strong>.
            </p>

            <div class="print-signatures">
                <div class="print-sig-box" style="margin-left: auto; text-align: right;">
                    Fait à Laroque d'Olmes, le ${new Date().toLocaleDateString('fr-FR')}<br>
                    Pour la Direction RH Paprec<br>
                    <strong>${rhSettings.signataireNom}</strong><br><br><br>
                    Cachet et Signature
                </div>
            </div>
        `;
    }

    document.getElementById('modal-printable-doc')?.classList.add('active');
}

function updatePrintFormEmp(empId) {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;

    const nameEl = document.getElementById('pform-name');
    const roleEl = document.getElementById('pform-role');

    if (nameEl) nameEl.innerHTML = `<strong>${emp.nom} ${emp.prenom}</strong>`;
    if (roleEl) roleEl.textContent = emp.role || emp.metier;
}

function triggerPrintDocClean() {
    const content = document.getElementById('printable-doc-content')?.innerHTML;
    printCleanContent(content, "Document RH Paprec", false);
}

// ================= MODULE 5: FORMATIONS QSE =================

function renderFormationsMatrix() {
    const tbody = document.getElementById('formations-matrix-tbody');
    tbody.innerHTML = '';

    const searchTerm = document.getElementById('search-formations')?.value.toLowerCase().trim();
    const filterFam = document.getElementById('filter-family-formations')?.value;
    const filterStat = document.getElementById('filter-status-formations')?.value;

    const colConduite = document.querySelectorAll('.col-group-conduite');
    const colSecurite = document.querySelectorAll('.col-group-securite');
    const colSante = document.querySelectorAll('.col-group-sante');

    colConduite.forEach(el => el.style.display = (filterFam === 'all' || filterFam === 'conduite') ? '' : 'none');
    colSecurite.forEach(el => el.style.display = (filterFam === 'all' || filterFam === 'securite') ? '' : 'none');
    colSante.forEach(el => el.style.display = (filterFam === 'all' || filterFam === 'sante') ? '' : 'none');

    const filtered = employees.filter(emp => {
        if (searchTerm) {
            const nameMatch = emp.nom.toLowerCase().includes(searchTerm) || emp.prenom.toLowerCase().includes(searchTerm);
            if (!nameMatch) return false;
        }
        if (filterStat === 'danger' && !emp.hasDanger) return false;
        if (filterStat === 'warning' && !emp.hasWarning) return false;
        if (filterStat === 'ok' && (emp.hasDanger || emp.hasWarning)) return false;
        return true;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="19" style="text-align:center; padding:30px; color:#64748b;">Aucun collaborateur ne correspond aux filtres.</td></tr>';
        return;
    }

    filtered.forEach(emp => {
        const tr = document.createElement('tr');

        let statusBadgeHtml = '<span class="cell-pill ok"><span class="pill-date">Conforme</span></span>';
        if (emp.globalStatus === 'danger') {
            statusBadgeHtml = '<span class="cell-pill danger"><span class="pill-date">🔴 Périmé</span></span>';
        } else if (emp.globalStatus === 'warning') {
            statusBadgeHtml = '<span class="cell-pill warning"><span class="pill-date">🟠 Urgent</span></span>';
        }

        let rowHtml = `
            <td class="sticky-col sticky-col-1" onclick="openProfileModal('${emp.id}')" style="cursor:pointer;">
                <strong style="color:var(--primary);"><i class="fa-solid fa-user-circle"></i> ${emp.nom} ${emp.prenom}</strong>
            </td>
            <td class="sticky-col sticky-col-2">
                <span class="badge badge-outline">${emp.categorie || 'Ouvrier'}</span>
            </td>
            <td class="sticky-col sticky-col-3" onclick="openProfileModal('${emp.id}')" style="cursor:pointer;">${statusBadgeHtml}</td>
        `;

        FORMATION_DEFINITIONS.forEach(def => {
            const isConduite = def.family === 'conduite';
            const isSecurite = def.family === 'securite';
            const isSante = def.family === 'sante';

            let showCol = true;
            if (filterFam === 'conduite' && !isConduite) showCol = false;
            if (filterFam === 'securite' && !isSecurite) showCol = false;
            if (filterFam === 'sante' && !isSante) showCol = false;

            if (showCol) {
                const f = (emp.formations || []).find(item => item.id === def.id);

                if (f && (f.expiration || f.date || f.type)) {
                    let cl = 'ok';
                    let dateStr = formatDateFR(f.expiration || f.date);
                    let labelStr = f.type ? f.type : (f.statusInfo ? f.statusInfo.label : 'OK');

                    if (f.statusInfo) cl = f.statusInfo.status;

                    rowHtml += `
                        <td onclick="openFormationInfoModal('${emp.id}', '${def.id}')">
                            <div class="cell-pill ${cl}" title="${f.name}: ${dateStr} (${labelStr})">
                                <span>${dateStr || 'Valide'}</span>
                                <span style="font-size:0.7rem;">${labelStr}</span>
                            </div>
                        </td>
                    `;
                } else {
                    rowHtml += `<td onclick="openFormationInfoModal('${emp.id}', '${def.id}')"><div class="cell-empty">-</div></td>`;
                }
            }
        });

        tr.innerHTML = rowHtml;
        tbody.appendChild(tr);
    });
}

function openFormationInfoModal(empId, formationId) {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;

    const def = FORMATION_DEFINITIONS.find(d => d.id === formationId);
    const formName = def ? def.name : formationId;
    const f = (emp.formations || []).find(item => item.id === formationId);

    activeInfoFormation = { empId, formationId };

    const _el_76 = document.getElementById('info-modal-title');
    if (_el_76) _el_76.textContent = `${formName}`;
    const _el_77 = document.getElementById('info-modal-sub');
    if (_el_77) _el_77.textContent = `Collaborateur: ${emp.nom} ${emp.prenom} (${emp.metier})`;

    const badgeEl = document.getElementById('info-modal-status-badge');
    const countdownEl = document.getElementById('info-modal-days-countdown');
    const datePassedEl = document.getElementById('info-modal-date-passed');
    const dateExpEl = document.getElementById('info-modal-date-exp');
    const durationEl = document.getElementById('info-modal-duration');

    durationEl.textContent = def ? def.desc : 'Non spécifiée';

    if (f && (f.date || f.expiration || f.type)) {
        let passDateStr = f.date;
        let expDateStr = f.expiration;

        if (!passDateStr && expDateStr && def && def.defaultMonths) {
            const expD = new Date(expDateStr);
            if (!isNaN(expD.getTime())) {
                const passD = new Date(expD);
                passD.setMonth(passD.getMonth() - def.defaultMonths);
                passDateStr = passD.toISOString().split('T')[0];
            }
        }

        if (!expDateStr && passDateStr && def && def.defaultMonths) {
            const passD = new Date(passDateStr);
            if (!isNaN(passD.getTime())) {
                const expD = new Date(passD);
                expD.setMonth(expD.getMonth() + def.defaultMonths);
                expDateStr = expD.toISOString().split('T')[0];
            }
        }

        datePassedEl.textContent = passDateStr ? formatDateFR(passDateStr) : 'Non renseignée';
        dateExpEl.textContent = expDateStr ? formatDateFR(expDateStr) : 'Sans limite';

        const s = calcExpirationStatus(expDateStr || f.expiration);
        if (s) {
            badgeEl.className = `cell-pill ${s.status}`;
            if (s.status === 'danger') {
                badgeEl.textContent = '🔴 PÉRIMÉ';
                countdownEl.textContent = `Périmé depuis ${Math.abs(s.days)} jour(s)`;
                countdownEl.style.color = 'var(--danger)';
            } else if (s.status === 'warning') {
                badgeEl.textContent = '🟠 RECYCLAGE PROCHE';
                countdownEl.textContent = `${s.days} jour(s) restant(s)`;
                countdownEl.style.color = 'var(--warning)';
            } else {
                badgeEl.textContent = '🟢 VALIDE & CONFORME';
                countdownEl.textContent = `${s.days} jour(s) restant(s)`;
                countdownEl.style.color = 'var(--secondary)';
            }
        } else {
            badgeEl.className = 'cell-pill ok';
            badgeEl.textContent = '🟢 VALIDE';
            countdownEl.textContent = 'À jour';
            countdownEl.style.color = 'var(--secondary)';
        }
    } else {
        badgeEl.className = 'badge badge-gray';
        badgeEl.textContent = '⚪ NON ENREGISTRÉE';
        countdownEl.textContent = 'Aucune date saisie';
        countdownEl.style.color = 'var(--text-muted)';
        datePassedEl.textContent = '-';
        dateExpEl.textContent = '-';
    }

    document.getElementById('modal-formation-info')?.classList.add('active');
}

function renewFormationToday() {
    if (!activeInfoFormation) return;
    const { empId, formationId } = activeInfoFormation;

    const emp = employees.find(e => e.id === empId);
    if (!emp) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const autoExp = calculateAutoExpiration(formationId, todayStr);

    const def = FORMATION_DEFINITIONS.find(d => d.id === formationId);
    const formName = def ? def.name : formationId;

    if (!emp.formations) emp.formations = [];
    let existing = emp.formations.find(f => f.id === formationId);
    if (existing) {
        existing.date = todayStr;
        existing.expiration = autoExp;
    } else {
        emp.formations.push({
            id: formationId,
            name: formName,
            type: '',
            date: todayStr,
            expiration: autoExp
        });
    }

    processEmployeesFormationsStatus();
    saveEmployeesToStorage();
    closeModals();
    updateStats();
    renderFormationsMatrix();
    renderPersonnel();
}

function sendFormationEmailRelance() {
    if (!activeInfoFormation) return;
    const { empId, formationId } = activeInfoFormation;
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;

    const def = FORMATION_DEFINITIONS.find(d => d.id === formationId);
    const formName = def ? def.name : formationId;
    const f = (emp.formations || []).find(item => item.id === formationId);

    const expDateStr = f && f.expiration ? formatDateFR(f.expiration) : 'Prochainement';
    const recipientEmail = emp.email || 'Emilie.JAYAT@paprec.com';

    const subject = encodeURIComponent(`[PAPREC RH] Relance Échéance Formation - ${formName} (${emp.prenom} ${emp.nom})`);
    const body = encodeURIComponent(
`Bonjour ${emp.prenom},

Sauf erreur de notre part, votre formation / habilitation QSE suivante arrive à échéance :

• Formation / Habilitation : ${formName}
• Salarié : ${emp.prenom} ${emp.nom} (${emp.role || emp.metier})
• Date d'échéance / Recyclage : ${expDateStr}

Merci de prendre contact avec la Responsable RH & QSE (${rhSettings.signataireNom}) afin d'organiser votre session de renouvellement.

Cordialement,
Service RH & QSE ${rhSettings.agenceNom}`
    );

    window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
}

// Export CSV
function exportAllCSV() {
    let csv = '\uFEFF';
    csv += 'Nom;Prénom;Métier;Rôle;Catégorie;Contrat;Date Entrée;Visite Médicale;Téléphone;Email;Solde CP;Solde RTT\n';

    employees.forEach(emp => {
        csv += `"${emp.nom}";"${emp.prenom}";"${emp.metier}";"${emp.role||''}";"${emp.categorie||''}";"${emp.contrat||''}";"${emp.dateEntree||''}";"${emp.visiteMedicale||''}";"${emp.telephone||''}";"${emp.email||''}";"${emp.soldeCP||25}";"${emp.soldeRTT||10}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Paprec_RH_Export_Laroque_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// JSON Database Backup & Restore
function exportFullDatabaseJSON() {
    const data = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        settings: rhSettings,
        employees: employees,
        planning: planningData
    };

    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Paprec_RH_Sauvegarde_Complete_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function triggerImportJSON() {
    document.getElementById('import-json-file-input')?.click();
}

function importFullDatabaseJSON(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
        try {
            const data = JSON.parse(evt.target.result);
            if (data.employees && Array.isArray(data.employees)) {
                employees = data.employees;
                saveEmployeesToStorage();
            }
            if (data.planning) {
                planningData = data.planning;
                savePlanningToStorage();
            }
            if (data.settings) {
                rhSettings = data.settings;
                saveSettingsToStorage();
                updateSettingsDisplay();
            }

            processEmployeesFormationsStatus();
            updateStats();
            renderPersonnel();
            renderConges();
            renderPlanning();
            renderFormationsMatrix();

            alert("Base de données RH restaurée avec succès !");
        } catch (err) {
            alert("Erreur lors de la lecture du fichier de sauvegarde JSON : " + err.message);
        }
    };
    reader.readAsText(file);
    e.target.value = '';
}

// Modals Management
function closeModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
}

// Setup Event Listeners
function setupEventListeners() {
    // Nav Tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            switchTab(tab.dataset.tab);
        });
    });

    // Filters Personnel
    document.getElementById('search-personnel')?.addEventListener('input', renderPersonnel);
    document.getElementById('filter-metier-personnel')?.addEventListener('change', renderPersonnel);
    document.getElementById('filter-contrat-personnel')?.addEventListener('change', renderPersonnel);

    // Filters Conges & View Switch
    document.getElementById('conges-year-select')?.addEventListener('change', renderConges);
    document.getElementById('filter-metier-conges')?.addEventListener('change', renderConges);

    document.getElementById('btn-conges-view-table')?.addEventListener('click', () => {
        document.getElementById('btn-conges-view-table')?.classList.add('active');
        document.getElementById('btn-conges-view-calendar')?.classList.remove('active');
        const _el_c1 = document.getElementById('conges-view-table-container'); if (_el_c1) _el_c1.style.display = 'block';
        const _el_c2 = document.getElementById('conges-view-calendar-container'); if (_el_c2) _el_c2.style.display = 'none';
    });

    document.getElementById('btn-conges-view-calendar')?.addEventListener('click', () => {
        document.getElementById('btn-conges-view-calendar')?.classList.add('active');
        document.getElementById('btn-conges-view-table')?.classList.remove('active');
        const _el_c3 = document.getElementById('conges-view-table-container'); if (_el_c3) _el_c3.style.display = 'none';
        const _el_c4 = document.getElementById('conges-view-calendar-container'); if (_el_c4) _el_c4.style.display = 'block';
        renderCongesCalendar3Months();
    });

    // Filters Planning
    document.getElementById('planning-week-picker')?.addEventListener('change', renderPlanning);
    document.getElementById('filter-metier-planning')?.addEventListener('change', renderPlanning);

    document.getElementById('btn-today-week')?.addEventListener('click', () => {
        const _el_78 = document.getElementById('planning-week-picker');
        if (_el_78) _el_78.value = '2026-W30';
        renderPlanning();
    });

    // Formations filters & card clicks
    document.getElementById('search-formations')?.addEventListener('input', renderFormationsMatrix);
    document.getElementById('filter-family-formations')?.addEventListener('change', renderFormationsMatrix);
    document.getElementById('filter-status-formations')?.addEventListener('change', renderFormationsMatrix);

    document.getElementById('fstat-card-total')?.addEventListener('click', () => {
        const _el_79 = document.getElementById('filter-status-formations');
        if (_el_79) _el_79.value = 'all';
        renderFormationsMatrix();
    });
    document.getElementById('fstat-card-ok')?.addEventListener('click', () => {
        const _el_80 = document.getElementById('filter-status-formations');
        if (_el_80) _el_80.value = 'ok';
        renderFormationsMatrix();
    });
    document.getElementById('fstat-card-warning')?.addEventListener('click', () => {
        const _el_81 = document.getElementById('filter-status-formations');
        if (_el_81) _el_81.value = 'warning';
        renderFormationsMatrix();
    });
    document.getElementById('fstat-card-danger')?.addEventListener('click', () => {
        const _el_82 = document.getElementById('filter-status-formations');
        if (_el_82) _el_82.value = 'danger';
        renderFormationsMatrix();
    });

    // Renewal button
    document.getElementById('btn-renew-today')?.addEventListener('click', renewFormationToday);

    // Buttons Add
    document.getElementById('btn-open-add-emp')?.addEventListener('click', openAddEmpModal);
    document.getElementById('btn-open-add-conge')?.addEventListener('click', openAddCongeModal);
    document.getElementById('btn-export-all')?.addEventListener('click', exportAllCSV);

    // Forms submit
    document.getElementById('form-employee')?.addEventListener('submit', saveEmployeeForm);
    document.getElementById('form-conge')?.addEventListener('submit', saveCongeForm);

    // Close Modal Triggers
    document.querySelectorAll('.btn-close-modal').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModals();
        });
    });
}

// Launch safely on DOM Ready or immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}


// Automatic Email Expiration Alerts (J-30 & Jour J)
function getExpirationAlertsData() {
    const alertsJ30 = [];
    const alertsJourJ = [];
    const now = new Date();
    now.setHours(0,0,0,0);

    employees.forEach(emp => {
        (emp.formations || []).forEach(f => {
            if (f.expiration) {
                const expD = new Date(f.expiration);
                expD.setHours(0,0,0,0);
                if (!isNaN(expD.getTime())) {
                    const diffDays = Math.ceil((expD - now) / (1000 * 60 * 60 * 24));
                    const def = FORMATION_DEFINITIONS.find(d => d.id === f.id);
                    const formName = def ? def.name : (f.name || f.id);

                    if (diffDays > 0 && diffDays <= 30) {
                        alertsJ30.push({ emp, f, formName, diffDays });
                    } else if (diffDays <= 0) {
                        alertsJourJ.push({ emp, f, formName, diffDays });
                    }
                }
            }
        });
    });

    return { alertsJ30, alertsJourJ };
}

function checkAutomaticExpirationAlerts() {
    const { alertsJ30, alertsJourJ } = getExpirationAlertsData();
    const banner = document.getElementById('auto-email-alert-banner');
    const textEl = document.getElementById('auto-alert-text');

    if (!banner || !textEl) return;

    if (alertsJ30.length > 0 || alertsJourJ.length > 0) {
        banner.style.display = 'block';
        textEl.innerHTML = `
            <i class="fa-solid fa-bell-concierge" style="margin-right: 8px; font-size: 1.1rem; color: #ea580c;"></i>
            <strong>ALERTE AUTOMATIQUE ÉCHÉANCES FORMATIONS :</strong> 
            <span style="background: #fef2f2; color: #dc2626; padding: 2px 8px; border-radius: 4px; font-weight:700; margin: 0 4px;">🚨 ${alertsJourJ.length} Jour J (Périmée)</span> et 
            <span style="background: #fffbeb; color: #d97706; padding: 2px 8px; border-radius: 4px; font-weight:700; margin: 0 4px;">🔔 ${alertsJ30.length} à J-30 (30 Jours)</span>.
        `;
    } else {
        banner.style.display = 'none';
    }
}

function openAutoEmailAlertsModal() {
    const { alertsJ30, alertsJourJ } = getExpirationAlertsData();
    const container = document.getElementById('auto-email-alerts-list');
    if (!container) return;

    let html = '';

    if (alertsJourJ.length > 0) {
        html += `
            <div style="margin-bottom: 24px;">
                <h4 style="color: #dc2626; border-bottom: 2px solid #fecaca; padding-bottom: 6px; margin-bottom: 12px;">
                    <i class="fa-solid fa-circle-exclamation"></i> 🚨 Alertes Jour J : Formations Expirées (${alertsJourJ.length})
                </h4>
                <div style="display: flex; flex-direction: column; gap: 10px;">
        `;
        alertsJourJ.forEach(item => {
            const expDateFR = formatDateFR(item.f.expiration);
            const daysText = item.diffDays === 0 ? "Expiré AUJOURD'HUI" : `Périmé depuis ${Math.abs(item.diffDays)} jour(s)`;
            html += `
                <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 12px; display: flex; justify-content: space-between; align-items: center; gap: 12px;">
                    <div>
                        <strong style="color: #991b1b; font-size: 0.95rem;">${item.emp.prenom} ${item.emp.nom}</strong> <span style="font-size: 0.8rem; color: #7f1d1d;">(${item.emp.role || item.emp.metier})</span>
                        <div style="font-size: 0.85rem; color: #b91c1c; margin-top: 2px;">
                            • Formation : <strong>${item.formName}</strong><br>
                            • Expiration : <strong>${expDateFR}</strong> (${daysText})
                        </div>
                    </div>
                    <button class="btn btn-sm" style="background: #dc2626; color: white; border: none; white-space: nowrap;" onclick="sendSingleAlertEmail('${item.emp.id}', '${item.f.id}', 'JOUR_J')">
                        <i class="fa-solid fa-paper-plane"></i> Mail Urgent Jour J
                    </button>
                </div>
            `;
        });
        html += `</div></div>`;
    }

    if (alertsJ30.length > 0) {
        html += `
            <div style="margin-bottom: 20px;">
                <h4 style="color: #d97706; border-bottom: 2px solid #fef3c7; padding-bottom: 6px; margin-bottom: 12px;">
                    <i class="fa-solid fa-clock"></i> 🔔 Alertes J-30 : Échéance à 30 Jours ou Moins (${alertsJ30.length})
                </h4>
                <div style="display: flex; flex-direction: column; gap: 10px;">
        `;
        alertsJ30.forEach(item => {
            const expDateFR = formatDateFR(item.f.expiration);
            html += `
                <div style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 12px; display: flex; justify-content: space-between; align-items: center; gap: 12px;">
                    <div>
                        <strong style="color: #92400e; font-size: 0.95rem;">${item.emp.prenom} ${item.emp.nom}</strong> <span style="font-size: 0.8rem; color: #b45309;">(${item.emp.role || item.emp.metier})</span>
                        <div style="font-size: 0.85rem; color: #b45309; margin-top: 2px;">
                            • Formation : <strong>${item.formName}</strong><br>
                            • Expiration : <strong>${expDateFR}</strong> (${item.diffDays} jour(s) restant(s))
                        </div>
                    </div>
                    <button class="btn btn-sm" style="background: #d97706; color: white; border: none; white-space: nowrap;" onclick="sendSingleAlertEmail('${item.emp.id}', '${item.f.id}', 'J30')">
                        <i class="fa-solid fa-paper-plane"></i> Mail Rappel J-30
                    </button>
                </div>
            `;
        });
        html += `</div></div>`;
    }

    if (alertsJourJ.length === 0 && alertsJ30.length === 0) {
        html = `<div style="text-align: center; padding: 30px; color: var(--secondary); font-weight: 600;">
            <i class="fa-solid fa-circle-check" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
            Toutes les formations QSE sont à jour ! Aucune alerte J-30 ou Jour J détectée.
        </div>`;
    }

    container.innerHTML = html;
    document.getElementById('modal-auto-email-alerts')?.classList.add('active');
}

function sendSingleAlertEmail(empId, formationId, alertType) {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;

    const def = FORMATION_DEFINITIONS.find(d => d.id === formationId);
    const formName = def ? def.name : formationId;
    const f = (emp.formations || []).find(item => item.id === formationId);

    const expDateStr = f && f.expiration ? formatDateFR(f.expiration) : 'Prochainement';
    const recipientEmail = emp.email || 'Emilie.JAYAT@paprec.com';

    let subject = '';
    let body = '';

    if (alertType === 'JOUR_J') {
        subject = encodeURIComponent(`[URGENT JOUR-J PAPREC RH] Échéance Formation Dépassée - ${formName} (${emp.prenom} ${emp.nom})`);
        body = encodeURIComponent(
`Bonjour ${emp.prenom},

🚨 ALERTE URGENTE JOUR-J (FORMATION PÉRIMÉE) 🚨

Votre formation / habilitation QSE suivante est arrivée à échéance au JOUR J :

• Formation / Habilitation : ${formName}
• Salarié concerné : ${emp.prenom} ${emp.nom} (${emp.role || emp.metier})
• Date d'échéance : ${expDateStr}
• Statut : PÉRIMÉE - Recyclage obligatoire immédiat

Merci de contacter IMPÉRATIVEMENT le service RH & QSE (${rhSettings.signataireNom}) afin d'organiser votre session de recyclage en urgence.

Cordialement,
Service RH & QSE ${rhSettings.agenceNom}`
        );
    } else {
        subject = encodeURIComponent(`[RAPPEL J-30 PAPREC RH] Échéance Formation dans 30 jours - ${formName} (${emp.prenom} ${emp.nom})`);
        body = encodeURIComponent(
`Bonjour ${emp.prenom},

🔔 RAPPEL AUTOMATIQUE À 30 JOURS (J-30) 🔔

Votre formation / habilitation QSE suivante arrivera à échéance dans 30 jours :

• Formation / Habilitation : ${formName}
• Salarié concerné : ${emp.prenom} ${emp.nom} (${emp.role || emp.metier})
• Date d'échéance / Recyclage : ${expDateStr}

Afin d'éviter tout retard ou péremption, merci de prendre contact dès maintenant avec la Responsable RH & QSE (${rhSettings.signataireNom}) pour planifier votre session de recyclage.

Cordialement,
Service RH & QSE ${rhSettings.agenceNom}`
        );
    }

    window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
}
















// ========================================================
// ARCHITECTURE PROPRE ATOMIQUE SUPABASE (1 ROW = 1 SALARIÉ)
// SOURCE DE VÉRITÉ UNIQUE : SUPABASE POSTGRESQL (ZERO LOCAL STORAGE)
// ========================================================
const SUPABASE_RH_URL = "https://wilukbpvjfdyxahasmmt.supabase.co";
const SUPABASE_RH_KEY = "sb_publishable_P9MiaaGJqJ2f6zAFvHwXZA_jYHlF830";

let isReloadingEmployees = false;

// Convert Supabase DB Row to Clean Employee Object
function parseDbRowToEmployee(row) {
    if (!row) return null;
    let meta = {};
    if (row.role && row.role.startsWith("{")) {
        try { meta = JSON.parse(row.role); } catch(e) {}
    }
    return {
        id: row.id,
        nom: meta.nom || row.name || "Collaborateur",
        prenom: meta.prenom || "",
        name: `${meta.prenom || ''} ${meta.nom || row.name || ''}`.trim(),
        poste: meta.poste || "Salarié",
        metier: meta.metier || "Exploitation / DALE",
        categorie: meta.categorie || "Ouvrier",
        contrat: meta.contrat || "CDI",
        dateEntree: row.entryDate ? row.entryDate.substring(0,10) : (meta.dateEntree || "2024-01-01"),
        telephone: meta.telephone || "",
        email: meta.email || "",
        adresse: meta.adresse || "",
        tailleEpi: meta.tailleEpi || { veste: "L", pantalon: "42", chaussures: "43" },
        visiteMedicale: meta.visiteMedicale || "2025-10-10",
        statut: meta.statut || "Actif",
        soldeCP: meta.soldeCP !== undefined ? meta.soldeCP : 25,
        soldeRTT: meta.soldeRTT !== undefined ? meta.soldeRTT : 10,
        documents: meta.documents || [],
        formations: meta.formations || [],
        conges: meta.conges || []
    };
}

// Convert Employee Object to Supabase DB Row (Meta in role column)
function formatEmployeeToDbRow(emp) {
    const meta = {
        nom: emp.nom || emp.name || "",
        prenom: emp.prenom || "",
        poste: emp.poste || emp.role || "Salarié",
        metier: emp.metier || "Exploitation / DALE",
        categorie: emp.categorie || "Ouvrier",
        contrat: emp.contrat || "CDI",
        dateEntree: emp.dateEntree || "2024-01-01",
        telephone: emp.telephone || "",
        email: emp.email || "",
        adresse: emp.adresse || "",
        tailleEpi: emp.tailleEpi || { veste: "L", pantalon: "42", chaussures: "43" },
        visiteMedicale: emp.visiteMedicale || "2025-10-10",
        statut: emp.statut || "Actif",
        soldeCP: emp.soldeCP !== undefined ? emp.soldeCP : 25,
        soldeRTT: emp.soldeRTT !== undefined ? emp.soldeRTT : 10,
        documents: emp.documents || [],
        formations: emp.formations || [],
        conges: emp.conges || []
    };

    return {
        id: emp.id,
        name: `${emp.nom || emp.name || ''} ${emp.prenom || ''}`.trim(),
        role: JSON.stringify(meta),
        entryDate: emp.dateEntree || new Date().toISOString()
    };
}

// 1. READ ALL EMPLOYEES (SELECT * FROM employees)
async function reloadEmployees() {
    if (isReloadingEmployees) return;
    isReloadingEmployees = true;

    try {
        const resp = await fetch(`${SUPABASE_RH_URL}/rest/v1/employees?select=*`, {
            headers: {
                'apikey': SUPABASE_RH_KEY,
                'Authorization': `Bearer ${SUPABASE_RH_KEY}`
            }
        });

        if (resp.ok) {
            const rows = await resp.json();
            if (rows && Array.isArray(rows)) {
                // Filter out system payload rows
                const validRows = rows.filter(r => r && r.id && !r.id.startsWith("rh_"));
                const fetchedEmployees = validRows.map(parseDbRowToEmployee).filter(e => e !== null);

                if (fetchedEmployees.length > 0) {
                    employees = fetchedEmployees;
                    processEmployeesFormationsStatus();
                    updateStats();
                    renderPersonnel();
                    renderConges();
                    renderPlanning();
                    renderFormationsMatrix();
                    checkAutomaticExpirationAlerts();

                    updateRhSyncBadge(true, `En Direct de Supabase (${employees.length} salariés)`);
                }
            }
        }
    } catch(e) {
        console.warn("reloadEmployees error:", e);
        updateRhSyncBadge(false, "Reconnexion Supabase...");
    } finally {
        isReloadingEmployees = false;
    }
}

// 2. ATOMIC CREATE / UPDATE (POST UPSERT SINGLE ROW)
async function saveEmployeeAtomically(emp) {
    if (!emp || !emp.id) return;
    const dbRow = formatEmployeeToDbRow(emp);

    try {
        await fetch(`${SUPABASE_RH_URL}/rest/v1/employees`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_RH_KEY,
                'Authorization': `Bearer ${SUPABASE_RH_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates'
            },
            body: JSON.stringify(dbRow)
        });
        reloadEmployees();
    } catch(e) {
        console.warn("saveEmployeeAtomically error:", e);
    }
}

// 3. ATOMIC DELETE (DELETE SINGLE ROW)
async function deleteEmployeeAtomically(empId) {
    if (!empId) return;

    try {
        await fetch(`${SUPABASE_RH_URL}/rest/v1/employees?id=eq.${empId}`, {
            method: 'DELETE',
            headers: {
                'apikey': SUPABASE_RH_KEY,
                'Authorization': `Bearer ${SUPABASE_RH_KEY}`
            }
        });
        reloadEmployees();
    } catch(e) {
        console.warn("deleteEmployeeAtomically error:", e);
    }
}

function initPureCloudEngine() {
    // 1. Initial Fetch from Supabase
    reloadEmployees();

    // 2. Realtime Heartbeat Polling every 2s (Safeguard)
    setInterval(reloadEmployees, 2000);

    // 3. Auto-fetch on tab focus / visibility
    window.addEventListener('focus', reloadEmployees);
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) reloadEmployees();
    });
}

function updateRhSyncBadge(isOnline, message) {
    const badge = document.getElementById('cloud-sync-status-badge');
    if (badge) {
        badge.innerHTML = isOnline 
            ? `<span style="color: #16a34a;"><i class="fa-solid fa-database"></i> ${message}</span>`
            : `<span style="color: #ca8a04;"><i class="fa-solid fa-arrows-rotate fa-spin"></i> ${message}</span>`;
    }
}

// Override handlers to save per row
function saveEmployeesToStorage() {
    if (employees && employees.length > 0) {
        employees.forEach(emp => saveEmployeeAtomically(emp));
    }
}

function savePlanningToStorage() {
    // No-op for employees
}

function saveSettingsToStorage() {
    // No-op
}
