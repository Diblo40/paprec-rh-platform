// Données initiales complètes Plateforme RH Paprec Laroque d'Olmes
const INITIAL_EMPLOYEES = [
    {
        "id": "emp_1",
        "nom": "BALAZARD",
        "prenom": "TYWAN",
        "metier": "Exploitation / DALE",
        "role": "OUVRIER DALE",
        "categorie": "Ouvrier",
        "contrat": "CDI",
        "dateEntree": "2018-01-15",
        "telephone": "06 10 20 30 40",
        "email": "tywan.balazard@paprec.com",
        "adresse": "Laroque d'Olmes",
        "tailleEpi": {
            "veste": "L",
            "pantalon": "42",
            "chaussures": "43"
        },
        "visiteMedicale": "2025-01-10",
        "statut": "Actif",
        "soldeCP": 25,
        "soldeRTT": 10,
        "documents": [
            {
                "id": "doc_emp_1_1",
                "name": "Contrat_Travail_BALAZARD.pdf",
                "type": "Contrat",
                "date": "2024-01-15",
                "size": "450 KB"
            },
            {
                "id": "doc_emp_1_2",
                "name": "Fiche_Medicale_BALAZARD.pdf",
                "type": "Visite Médicale",
                "date": "2025-01-10",
                "size": "280 KB"
            }
        ],
        "formations": [
            {
                "id": "permis",
                "name": "Permis de conduire",
                "type": "VL",
                "date": "2021-03-13",
                "expiration": null
            },
            {
                "id": "sst",
                "name": "Sauveteur Secouriste (SST)",
                "expiration": "2025-05-17"
            },
            {
                "id": "epi",
                "name": "Formation EPI",
                "date": "2024-09-27",
                "expiration": null
            },
            {
                "id": "caces_grue",
                "name": "R490 Grue Auxiliaire",
                "date": "2023-04-05",
                "expiration": "2033-04-05"
            },
            {
                "id": "caces_chariot",
                "name": "R489 Chariot Élévateur",
                "date": "2022-03-02",
                "expiration": "2032-03-02"
            },
            {
                "id": "autorisation_conduite",
                "name": "Autorisation de Conduite",
                "date": "2023-04-03"
            },
            {
                "id": "visite_medicale",
                "name": "Visite Médicale (SMR)",
                "date": "2023-09-21",
                "expiration": "2025-09-21"
            }
        ],
        "conges": [
            {
                "id": "c_emp_1_1",
                "type": "CP",
                "debut": "2026-08-10",
                "fin": "2026-08-21",
                "statut": "Validé",
                "motif": "Congés d'été"
            }
        ]
    },
    {
        "id": "emp_2",
        "nom": "BAUDEIGNE",
        "prenom": "DEBORAH",
        "metier": "Bureaux / Secrétariat",
        "role": "ASSISTANTE D'EXPLOITATION",
        "categorie": "Intérimaire",
        "contrat": "Intérim",
        "dateEntree": "2019-02-15",
        "telephone": "06 11 21 31 41",
        "email": "deborah.baudeigne@paprec.com",
        "adresse": "Laroque d'Olmes",
        "tailleEpi": {
            "veste": "M",
            "pantalon": "38",
            "chaussures": "38"
        },
        "visiteMedicale": "2025-02-10",
        "statut": "Actif",
        "soldeCP": 0,
        "soldeRTT": 0,
        "documents": [
            {
                "id": "doc_emp_2_1",
                "name": "Contrat_Travail_BAUDEIGNE.pdf",
                "type": "Contrat",
                "date": "2024-01-15",
                "size": "450 KB"
            },
            {
                "id": "doc_emp_2_2",
                "name": "Fiche_Medicale_BAUDEIGNE.pdf",
                "type": "Visite Médicale",
                "date": "2025-01-10",
                "size": "280 KB"
            }
        ],
        "formations": [],
        "conges": []
    },
    {
        "id": "emp_3",
        "nom": "BELLAOUI",
        "prenom": "YASINE",
        "metier": "Exploitation / DALE",
        "role": "OUVRIER DALE",
        "categorie": "Ouvrier",
        "contrat": "CDI",
        "dateEntree": "2020-03-15",
        "telephone": "06 12 22 32 42",
        "email": "yasine.bellaoui@paprec.com",
        "adresse": "Laroque d'Olmes",
        "tailleEpi": {
            "veste": "XL",
            "pantalon": "44",
            "chaussures": "44"
        },
        "visiteMedicale": "2025-03-10",
        "statut": "Actif",
        "soldeCP": 25,
        "soldeRTT": 10,
        "documents": [
            {
                "id": "doc_emp_3_1",
                "name": "Contrat_Travail_BELLAOUI.pdf",
                "type": "Contrat",
                "date": "2024-01-15",
                "size": "450 KB"
            },
            {
                "id": "doc_emp_3_2",
                "name": "Fiche_Medicale_BELLAOUI.pdf",
                "type": "Visite Médicale",
                "date": "2025-01-10",
                "size": "280 KB"
            }
        ],
        "formations": [],
        "conges": [
            {
                "id": "c_emp_3_1",
                "type": "CP",
                "debut": "2026-08-10",
                "fin": "2026-08-21",
                "statut": "Validé",
                "motif": "Congés d'été"
            }
        ]
    },
    {
        "id": "emp_4",
        "nom": "BERNARDH",
        "prenom": "MARIE - AMELIE",
        "metier": "Bureaux / Secrétariat",
        "role": "ASSISTANTE D'EXPLOITATION",
        "categorie": "ETAM",
        "contrat": "CDI",
        "dateEntree": "2021-04-15",
        "telephone": "06 13 23 33 43",
        "email": "marie-amelie.bernardh@paprec.com",
        "adresse": "Laroque d'Olmes",
        "tailleEpi": {
            "veste": "S",
            "pantalon": "36",
            "chaussures": "37"
        },
        "visiteMedicale": "2025-04-10",
        "statut": "Actif",
        "soldeCP": 25,
        "soldeRTT": 10,
        "documents": [
            {
                "id": "doc_emp_4_1",
                "name": "Contrat_Travail_BERNARDH.pdf",
                "type": "Contrat",
                "date": "2024-01-15",
                "size": "450 KB"
            },
            {
                "id": "doc_emp_4_2",
                "name": "Fiche_Medicale_BERNARDH.pdf",
                "type": "Visite Médicale",
                "date": "2025-01-10",
                "size": "280 KB"
            }
        ],
        "formations": [],
        "conges": []
    },
    {
        "id": "emp_5",
        "nom": "CAMPEDEL",
        "prenom": "PHILIPPE",
        "metier": "Chauffeurs",
        "role": "CHAUFFEUR",
        "categorie": "Ouvrier",
        "contrat": "CDI",
        "dateEntree": "2022-05-15",
        "telephone": "06 14 24 34 44",
        "email": "philippe.campedel@paprec.com",
        "adresse": "Laroque d'Olmes",
        "tailleEpi": {
            "veste": "M",
            "pantalon": "40",
            "chaussures": "41"
        },
        "visiteMedicale": "2025-05-10",
        "statut": "Actif",
        "soldeCP": 25,
        "soldeRTT": 10,
        "documents": [
            {
                "id": "doc_emp_5_1",
                "name": "Contrat_Travail_CAMPEDEL.pdf",
                "type": "Contrat",
                "date": "2024-01-15",
                "size": "450 KB"
            },
            {
                "id": "doc_emp_5_2",
                "name": "Fiche_Medicale_CAMPEDEL.pdf",
                "type": "Visite Médicale",
                "date": "2025-01-10",
                "size": "280 KB"
            }
        ],
        "formations": [
            {
                "id": "permis",
                "name": "Permis de conduire",
                "type": "VL/SPL",
                "date": "1991-01-14",
                "expiration": "2026-12-08"
            },
            {
                "id": "fimo",
                "name": "FIMO / FCO",
                "date": null,
                "expiration": "2028-08-25"
            },
            {
                "id": "sst",
                "name": "Sauveteur Secouriste (SST)",
                "expiration": "2025-05-17"
            },
            {
                "id": "amiante",
                "name": "Risques Amiante",
                "date": "2023-07-26",
                "expiration": "2028-07-26"
            },
            {
                "id": "caces_grue",
                "name": "R490 Grue Auxiliaire",
                "date": "2022-06-13",
                "expiration": "2032-06-13"
            },
            {
                "id": "autorisation_conduite",
                "name": "Autorisation de Conduite",
                "date": "2023-04-03"
            },
            {
                "id": "visite_medicale",
                "name": "Visite Médicale (SMR)",
                "date": "2023-05-04",
                "expiration": "2025-05-04"
            }
        ],
        "conges": [
            {
                "id": "c_emp_5_1",
                "type": "CP",
                "debut": "2026-08-10",
                "fin": "2026-08-21",
                "statut": "Validé",
                "motif": "Congés d'été"
            }
        ]
    },
    {
        "id": "emp_6",
        "nom": "CLERET",
        "prenom": "JULIEN",
        "metier": "Exploitation / Tri",
        "role": "RIPPEUR",
        "categorie": "Intérimaire",
        "contrat": "Intérim",
        "dateEntree": "2023-06-15",
        "telephone": "06 15 25 35 45",
        "email": "julien.cleret@paprec.com",
        "adresse": "Laroque d'Olmes",
        "tailleEpi": {
            "veste": "L",
            "pantalon": "42",
            "chaussures": "43"
        },
        "visiteMedicale": "2025-06-10",
        "statut": "Actif",
        "soldeCP": 0,
        "soldeRTT": 0,
        "documents": [
            {
                "id": "doc_emp_6_1",
                "name": "Contrat_Travail_CLERET.pdf",
                "type": "Contrat",
                "date": "2024-01-15",
                "size": "450 KB"
            },
            {
                "id": "doc_emp_6_2",
                "name": "Fiche_Medicale_CLERET.pdf",
                "type": "Visite Médicale",
                "date": "2025-01-10",
                "size": "280 KB"
            }
        ],
        "formations": [],
        "conges": []
    },
    {
        "id": "emp_7",
        "nom": "FABRICE",
        "prenom": "VERGE",
        "metier": "Chauffeurs",
        "role": "CHAUFFEUR",
        "categorie": "Intérimaire",
        "contrat": "Intérim",
        "dateEntree": "2018-07-15",
        "telephone": "06 16 26 36 46",
        "email": "verge.fabrice@paprec.com",
        "adresse": "Laroque d'Olmes",
        "tailleEpi": {
            "veste": "M",
            "pantalon": "38",
            "chaussures": "38"
        },
        "visiteMedicale": "2025-07-10",
        "statut": "Actif",
        "soldeCP": 0,
        "soldeRTT": 0,
        "documents": [
            {
                "id": "doc_emp_7_1",
                "name": "Contrat_Travail_FABRICE.pdf",
                "type": "Contrat",
                "date": "2024-01-15",
                "size": "450 KB"
            },
            {
                "id": "doc_emp_7_2",
                "name": "Fiche_Medicale_FABRICE.pdf",
                "type": "Visite Médicale",
                "date": "2025-01-10",
                "size": "280 KB"
            }
        ],
        "formations": [],
        "conges": [
            {
                "id": "c_emp_7_1",
                "type": "CP",
                "debut": "2026-08-10",
                "fin": "2026-08-21",
                "statut": "Validé",
                "motif": "Congés d'été"
            }
        ]
    },
    {
        "id": "emp_8",
        "nom": "JAYAT",
        "prenom": "EMILIE",
        "metier": "Bureaux / Secrétariat",
        "role": "RESPONSABLE D'EXPLOITATION",
        "categorie": "ETAM",
        "contrat": "CDI",
        "dateEntree": "2019-08-15",
        "telephone": "06 17 27 37 47",
        "email": "emilie.jayat@paprec.com",
        "adresse": "Laroque d'Olmes",
        "tailleEpi": {
            "veste": "XL",
            "pantalon": "44",
            "chaussures": "44"
        },
        "visiteMedicale": "2025-08-10",
        "statut": "Actif",
        "soldeCP": 25,
        "soldeRTT": 10,
        "documents": [
            {
                "id": "doc_emp_8_1",
                "name": "Contrat_Travail_JAYAT.pdf",
                "type": "Contrat",
                "date": "2024-01-15",
                "size": "450 KB"
            },
            {
                "id": "doc_emp_8_2",
                "name": "Fiche_Medicale_JAYAT.pdf",
                "type": "Visite Médicale",
                "date": "2025-01-10",
                "size": "280 KB"
            }
        ],
        "formations": [
            {
                "id": "permis",
                "name": "Permis de conduire",
                "type": "VL",
                "date": "2005-07-17",
                "expiration": null
            },
            {
                "id": "sst",
                "name": "Sauveteur Secouriste (SST)",
                "expiration": "2025-05-17"
            },
            {
                "id": "epi",
                "name": "Formation EPI",
                "date": "2022-09-23",
                "expiration": "2027-09-23"
            },
            {
                "id": "habilitation_elec",
                "name": "Habilitation Électrique",
                "date": "2021-09-22",
                "expiration": "2026-09-22"
            },
            {
                "id": "chimiques",
                "name": "Risques Chimiques",
                "date": "2023-12-22",
                "expiration": "2028-02-06"
            },
            {
                "id": "autorisation_conduite",
                "name": "Autorisation de Conduite",
                "date": "2024-01-22"
            },
            {
                "id": "visite_medicale",
                "name": "Visite Médicale (SMR)",
                "date": "2023-01-05",
                "expiration": "2025-01-05"
            }
        ],
        "conges": []
    },
    {
        "id": "emp_9",
        "nom": "LEROUX",
        "prenom": "CHRISTIAN",
        "metier": "Chauffeurs",
        "role": "CHAUFFEUR",
        "categorie": "Ouvrier",
        "contrat": "CDI",
        "dateEntree": "2020-09-15",
        "telephone": "06 18 28 38 48",
        "email": "christian.leroux@paprec.com",
        "adresse": "Laroque d'Olmes",
        "tailleEpi": {
            "veste": "S",
            "pantalon": "36",
            "chaussures": "37"
        },
        "visiteMedicale": "2025-09-10",
        "statut": "Actif",
        "soldeCP": 25,
        "soldeRTT": 10,
        "documents": [
            {
                "id": "doc_emp_9_1",
                "name": "Contrat_Travail_LEROUX.pdf",
                "type": "Contrat",
                "date": "2024-01-15",
                "size": "450 KB"
            },
            {
                "id": "doc_emp_9_2",
                "name": "Fiche_Medicale_LEROUX.pdf",
                "type": "Visite Médicale",
                "date": "2025-01-10",
                "size": "280 KB"
            }
        ],
        "formations": [
            {
                "id": "permis",
                "name": "Permis de conduire",
                "type": "VL/PL",
                "date": "1989-11-09",
                "expiration": "2029-09-13"
            },
            {
                "id": "fimo",
                "name": "FIMO / FCO",
                "date": null,
                "expiration": "2025-10-01"
            },
            {
                "id": "sst",
                "name": "Sauveteur Secouriste (SST)",
                "expiration": "2025-05-17"
            },
            {
                "id": "chimiques",
                "name": "Risques Chimiques",
                "date": "2023-02-10",
                "expiration": "2028-02-10"
            },
            {
                "id": "caces_grue",
                "name": "R490 Grue Auxiliaire",
                "date": "2018-10-04",
                "expiration": "2028-10-04"
            },
            {
                "id": "caces_chariot",
                "name": "R489 Chariot Élévateur",
                "date": "2018-10-04",
                "expiration": "2028-10-04"
            },
            {
                "id": "autorisation_conduite",
                "name": "Autorisation de Conduite",
                "date": "2023-04-03"
            },
            {
                "id": "visite_medicale",
                "name": "Visite Médicale (SMR)",
                "date": "2023-08-30",
                "expiration": "2025-08-30"
            }
        ],
        "conges": [
            {
                "id": "c_emp_9_1",
                "type": "CP",
                "debut": "2026-08-10",
                "fin": "2026-08-21",
                "statut": "Validé",
                "motif": "Congés d'été"
            }
        ]
    },
    {
        "id": "emp_10",
        "nom": "MARECHAL",
        "prenom": "LAURENT",
        "metier": "Exploitation / DALE",
        "role": "RESPONSABLE DALE",
        "categorie": "ETAM",
        "contrat": "CDI",
        "dateEntree": "2021-01-15",
        "telephone": "06 19 29 39 49",
        "email": "laurent.marechal@paprec.com",
        "adresse": "Laroque d'Olmes",
        "tailleEpi": {
            "veste": "M",
            "pantalon": "40",
            "chaussures": "41"
        },
        "visiteMedicale": "2025-01-10",
        "statut": "Actif",
        "soldeCP": 25,
        "soldeRTT": 10,
        "documents": [
            {
                "id": "doc_emp_10_1",
                "name": "Contrat_Travail_MARECHAL.pdf",
                "type": "Contrat",
                "date": "2024-01-15",
                "size": "450 KB"
            },
            {
                "id": "doc_emp_10_2",
                "name": "Fiche_Medicale_MARECHAL.pdf",
                "type": "Visite Médicale",
                "date": "2025-01-10",
                "size": "280 KB"
            }
        ],
        "formations": [],
        "conges": []
    },
    {
        "id": "emp_11",
        "nom": "MARTY",
        "prenom": "DIDIER",
        "metier": "Chauffeurs",
        "role": "CHAUFFEUR",
        "categorie": "Intérimaire",
        "contrat": "Intérim",
        "dateEntree": "2022-02-15",
        "telephone": "06 20 30 40 50",
        "email": "didier.marty@paprec.com",
        "adresse": "Laroque d'Olmes",
        "tailleEpi": {
            "veste": "L",
            "pantalon": "42",
            "chaussures": "43"
        },
        "visiteMedicale": "2025-02-10",
        "statut": "Actif",
        "soldeCP": 0,
        "soldeRTT": 0,
        "documents": [
            {
                "id": "doc_emp_11_1",
                "name": "Contrat_Travail_MARTY.pdf",
                "type": "Contrat",
                "date": "2024-01-15",
                "size": "450 KB"
            },
            {
                "id": "doc_emp_11_2",
                "name": "Fiche_Medicale_MARTY.pdf",
                "type": "Visite Médicale",
                "date": "2025-01-10",
                "size": "280 KB"
            }
        ],
        "formations": [],
        "conges": [
            {
                "id": "c_emp_11_1",
                "type": "CP",
                "debut": "2026-08-10",
                "fin": "2026-08-21",
                "statut": "Validé",
                "motif": "Congés d'été"
            }
        ]
    },
    {
        "id": "emp_12",
        "nom": "PIERRE",
        "prenom": "JEAN-FRANCOIS",
        "metier": "Chauffeurs",
        "role": "CHAUFFEUR",
        "categorie": "Ouvrier",
        "contrat": "CDI",
        "dateEntree": "2023-03-15",
        "telephone": "06 21 31 41 51",
        "email": "jean-francois.pierre@paprec.com",
        "adresse": "Laroque d'Olmes",
        "tailleEpi": {
            "veste": "M",
            "pantalon": "38",
            "chaussures": "38"
        },
        "visiteMedicale": "2025-03-10",
        "statut": "Actif",
        "soldeCP": 25,
        "soldeRTT": 10,
        "documents": [
            {
                "id": "doc_emp_12_1",
                "name": "Contrat_Travail_PIERRE.pdf",
                "type": "Contrat",
                "date": "2024-01-15",
                "size": "450 KB"
            },
            {
                "id": "doc_emp_12_2",
                "name": "Fiche_Medicale_PIERRE.pdf",
                "type": "Visite Médicale",
                "date": "2025-01-10",
                "size": "280 KB"
            }
        ],
        "formations": [],
        "conges": []
    },
    {
        "id": "emp_13",
        "nom": "RAUZY",
        "prenom": "REMY",
        "metier": "Chauffeurs",
        "role": "CHAUFFEUR",
        "categorie": "Ouvrier",
        "contrat": "CDI",
        "dateEntree": "2018-04-15",
        "telephone": "06 22 32 42 52",
        "email": "remy.rauzy@paprec.com",
        "adresse": "Laroque d'Olmes",
        "tailleEpi": {
            "veste": "XL",
            "pantalon": "44",
            "chaussures": "44"
        },
        "visiteMedicale": "2025-04-10",
        "statut": "Actif",
        "soldeCP": 25,
        "soldeRTT": 10,
        "documents": [
            {
                "id": "doc_emp_13_1",
                "name": "Contrat_Travail_RAUZY.pdf",
                "type": "Contrat",
                "date": "2024-01-15",
                "size": "450 KB"
            },
            {
                "id": "doc_emp_13_2",
                "name": "Fiche_Medicale_RAUZY.pdf",
                "type": "Visite Médicale",
                "date": "2025-01-10",
                "size": "280 KB"
            }
        ],
        "formations": [],
        "conges": [
            {
                "id": "c_emp_13_1",
                "type": "CP",
                "debut": "2026-08-10",
                "fin": "2026-08-21",
                "statut": "Validé",
                "motif": "Congés d'été"
            }
        ]
    },
    {
        "id": "emp_14",
        "nom": "VALENTIN",
        "prenom": "VERGE",
        "metier": "Chauffeurs",
        "role": "CHAFFEUR",
        "categorie": "Intérimaire",
        "contrat": "Intérim",
        "dateEntree": "2019-05-15",
        "telephone": "06 23 33 43 53",
        "email": "verge.valentin@paprec.com",
        "adresse": "Laroque d'Olmes",
        "tailleEpi": {
            "veste": "S",
            "pantalon": "36",
            "chaussures": "37"
        },
        "visiteMedicale": "2025-05-10",
        "statut": "Actif",
        "soldeCP": 0,
        "soldeRTT": 0,
        "documents": [
            {
                "id": "doc_emp_14_1",
                "name": "Contrat_Travail_VALENTIN.pdf",
                "type": "Contrat",
                "date": "2024-01-15",
                "size": "450 KB"
            },
            {
                "id": "doc_emp_14_2",
                "name": "Fiche_Medicale_VALENTIN.pdf",
                "type": "Visite Médicale",
                "date": "2025-01-10",
                "size": "280 KB"
            }
        ],
        "formations": [],
        "conges": []
    },
    {
        "id": "emp_15",
        "nom": "VIDAL",
        "prenom": "THOMAS",
        "metier": "Exploitation / DALE",
        "role": "OUVRIER DALE",
        "categorie": "Intérimaire",
        "contrat": "Intérim",
        "dateEntree": "2020-06-15",
        "telephone": "06 24 34 44 54",
        "email": "thomas.vidal@paprec.com",
        "adresse": "Laroque d'Olmes",
        "tailleEpi": {
            "veste": "M",
            "pantalon": "40",
            "chaussures": "41"
        },
        "visiteMedicale": "2025-06-10",
        "statut": "Actif",
        "soldeCP": 0,
        "soldeRTT": 0,
        "documents": [
            {
                "id": "doc_emp_15_1",
                "name": "Contrat_Travail_VIDAL.pdf",
                "type": "Contrat",
                "date": "2024-01-15",
                "size": "450 KB"
            },
            {
                "id": "doc_emp_15_2",
                "name": "Fiche_Medicale_VIDAL.pdf",
                "type": "Visite Médicale",
                "date": "2025-01-10",
                "size": "280 KB"
            }
        ],
        "formations": [],
        "conges": [
            {
                "id": "c_emp_15_1",
                "type": "CP",
                "debut": "2026-08-10",
                "fin": "2026-08-21",
                "statut": "Validé",
                "motif": "Congés d'été"
            }
        ]
    }
];
const INITIAL_PLANNING = {
    "2026-W30": [
        {
            "empId": "emp_1",
            "lundi": "Conduite Pelle / DALE",
            "mardi": "Conduite Pelle / DALE",
            "mercredi": "Conduite Pelle / DALE",
            "jeudi": "Conduite Pelle / DALE",
            "vendredi": "Conduite Pelle / DALE",
            "samedi": "Repos",
            "dimanche": "Repos"
        },
        {
            "empId": "emp_2",
            "lundi": "Bureaux (08h-17h)",
            "mardi": "Bureaux (08h-17h)",
            "mercredi": "Bureaux (08h-17h)",
            "jeudi": "Bureaux (08h-17h)",
            "vendredi": "Bureaux (08h-17h)",
            "samedi": "Repos",
            "dimanche": "Repos"
        },
        {
            "empId": "emp_3",
            "lundi": "Conduite Pelle / DALE",
            "mardi": "Conduite Pelle / DALE",
            "mercredi": "Conduite Pelle / DALE",
            "jeudi": "Conduite Pelle / DALE",
            "vendredi": "Conduite Pelle / DALE",
            "samedi": "Repos",
            "dimanche": "Repos"
        },
        {
            "empId": "emp_4",
            "lundi": "Bureaux (08h-17h)",
            "mardi": "Bureaux (08h-17h)",
            "mercredi": "Bureaux (08h-17h)",
            "jeudi": "Bureaux (08h-17h)",
            "vendredi": "Bureaux (08h-17h)",
            "samedi": "Repos",
            "dimanche": "Repos"
        },
        {
            "empId": "emp_5",
            "lundi": "Tournée Collecte",
            "mardi": "Tournée Collecte",
            "mercredi": "Tournée Collecte",
            "jeudi": "Tournée Collecte",
            "vendredi": "Tournée Collecte",
            "samedi": "Repos",
            "dimanche": "Repos"
        },
        {
            "empId": "emp_6",
            "lundi": "Rippeur Collecte",
            "mardi": "Rippeur Collecte",
            "mercredi": "Rippeur Collecte",
            "jeudi": "Rippeur Collecte",
            "vendredi": "Rippeur Collecte",
            "samedi": "Repos",
            "dimanche": "Repos"
        },
        {
            "empId": "emp_7",
            "lundi": "Tournée Collecte",
            "mardi": "Tournée Collecte",
            "mercredi": "Tournée Collecte",
            "jeudi": "Tournée Collecte",
            "vendredi": "Tournée Collecte",
            "samedi": "Repos",
            "dimanche": "Repos"
        },
        {
            "empId": "emp_8",
            "lundi": "Bureaux (08h-17h)",
            "mardi": "Bureaux (08h-17h)",
            "mercredi": "Bureaux (08h-17h)",
            "jeudi": "Bureaux (08h-17h)",
            "vendredi": "Bureaux (08h-17h)",
            "samedi": "Repos",
            "dimanche": "Repos"
        },
        {
            "empId": "emp_9",
            "lundi": "Tournée Ampliroll",
            "mardi": "Tournée Ampliroll",
            "mercredi": "Tournée Ampliroll",
            "jeudi": "Tournée Ampliroll",
            "vendredi": "Tournée Ampliroll",
            "samedi": "Repos",
            "dimanche": "Repos"
        },
        {
            "empId": "emp_10",
            "lundi": "Bureaux (08h-17h)",
            "mardi": "Bureaux (08h-17h)",
            "mercredi": "Bureaux (08h-17h)",
            "jeudi": "Bureaux (08h-17h)",
            "vendredi": "Bureaux (08h-17h)",
            "samedi": "Repos",
            "dimanche": "Repos"
        },
        {
            "empId": "emp_11",
            "lundi": "Tournée Collecte",
            "mardi": "Tournée Collecte",
            "mercredi": "Tournée Collecte",
            "jeudi": "Tournée Collecte",
            "vendredi": "Tournée Collecte",
            "samedi": "Repos",
            "dimanche": "Repos"
        },
        {
            "empId": "emp_12",
            "lundi": "Tournée Collecte",
            "mardi": "Tournée Collecte",
            "mercredi": "Tournée Collecte",
            "jeudi": "Tournée Collecte",
            "vendredi": "Tournée Collecte",
            "samedi": "Repos",
            "dimanche": "Repos"
        },
        {
            "empId": "emp_13",
            "lundi": "Tournée Collecte",
            "mardi": "Tournée Collecte",
            "mercredi": "Tournée Collecte",
            "jeudi": "Tournée Collecte",
            "vendredi": "Tournée Collecte",
            "samedi": "Repos",
            "dimanche": "Repos"
        },
        {
            "empId": "emp_14",
            "lundi": "Tri & Quai Transfert",
            "mardi": "Tri & Quai Transfert",
            "mercredi": "Tri & Quai Transfert",
            "jeudi": "Tri & Quai Transfert",
            "vendredi": "Tri & Quai Transfert",
            "samedi": "Repos",
            "dimanche": "Repos"
        },
        {
            "empId": "emp_15",
            "lundi": "Conduite Pelle / DALE",
            "mardi": "Conduite Pelle / DALE",
            "mercredi": "Conduite Pelle / DALE",
            "jeudi": "Conduite Pelle / DALE",
            "vendredi": "Conduite Pelle / DALE",
            "samedi": "Repos",
            "dimanche": "Repos"
        }
    ]
};
const INITIAL_FICHES_POSTE = [
    {
        "id": "fp_1",
        "titre": "Chauffeur PL / SPL",
        "metier": "Chauffeurs",
        "version": "V6 (DE39)",
        "description": "Conduite des véhicules poids lourds pour l'enlèvement et la livraison des bennes et conteneurs sur les sites clients et centres de traitement.",
        "competences": [
            "Permis C/CE à jour",
            "FIMO/FCO",
            "Carte Conducteur",
            "Respect du RSE et consignes QSE"
        ]
    },
    {
        "id": "fp_2",
        "titre": "Agent de Bascule & Accueil",
        "metier": "Bascule & Accueil",
        "version": "V4",
        "description": "Accueil des chauffeurs et apporteurs, pesage des camions entrée/sortie, saisie des bons de pesée et contrôle des déclarations de chargement.",
        "competences": [
            "Logiciel de pesée",
            "Sens du service client",
            "Protocole de sécurité site"
        ]
    },
    {
        "id": "fp_3",
        "titre": "Responsable & Operateur DALE",
        "metier": "Exploitation / DALE",
        "version": "V5",
        "description": "Gestion de la plateforme DALE, broyage et conditionnement des matières, tri haute performance et alimentation des quais.",
        "competences": [
            "CACES R482 Engins",
            "SST & Sécurité",
            "Gestion des flux de matières"
        ]
    },
    {
        "id": "fp_4",
        "titre": "Rippeur & Agent de Collecte",
        "metier": "Exploitation / Tri",
        "version": "V3",
        "description": "Collecte des bacs et conteneurs d'ordures et recyclables sur la voie publique et auprès des entreprises clientes.",
        "competences": [
            "EPI & Gestes et postures",
            "Sécurité routière",
            "Esprit d'équipe"
        ]
    },
    {
        "id": "fp_5",
        "titre": "Responsable d'Exploitation / Admin",
        "metier": "Bureaux / Secrétariat",
        "version": "V6",
        "description": "Supervision des opérations quotidiennes de l'agence, gestion administrative du personnel, suivi QSE et relation clients.",
        "competences": [
            "Gestion RH & Planning",
            "Réglementation transport & déchet",
            "Logiciels de gestion Paprec"
        ]
    }
];
const FORMATION_DEFINITIONS = [
    {
        "id": "permis",
        "name": "Permis VL/PL",
        "family": "conduite",
        "defaultMonths": 60,
        "desc": "5 ans (Permis C/CE / Visite médicale)"
    },
    {
        "id": "fimo",
        "name": "FIMO / FCO",
        "family": "conduite",
        "defaultMonths": 60,
        "desc": "5 ans (Recyclage FCO obligatoire)"
    },
    {
        "id": "carte_conducteur",
        "name": "Carte Cond.",
        "family": "conduite",
        "defaultMonths": 60,
        "desc": "5 ans"
    },
    {
        "id": "adr",
        "name": "ADR",
        "family": "conduite",
        "defaultMonths": 60,
        "desc": "5 ans (Recyclage marchandises dangereuses)"
    },
    {
        "id": "caces_grue",
        "name": "R490 Grue Auxiliaire",
        "family": "conduite",
        "defaultMonths": 60,
        "desc": "5 ans (R490 Grue auxiliaire)"
    },
    {
        "id": "caces_chariot",
        "name": "R489 Chariot Élévateur",
        "family": "conduite",
        "defaultMonths": 60,
        "desc": "5 ans (R489 Chariots élévateurs)"
    },
    {
        "id": "caces_pelle",
        "name": "R482.B1 Pelle",
        "family": "conduite",
        "defaultMonths": 120,
        "desc": "10 ans (R482.B1 Pelle de chantier)"
    },
    {
        "id": "caces_chargeuse",
        "name": "R482.C1 Chargeuse",
        "family": "conduite",
        "defaultMonths": 120,
        "desc": "10 ans (R482.C1 Chargeuse de chantier)"
    },
    {
        "id": "autorisation_conduite",
        "name": "Autorisation Cond.",
        "family": "conduite",
        "defaultMonths": 60,
        "desc": "5 ans (Interne Paprec)"
    },
    {
        "id": "sst",
        "name": "SST",
        "family": "securite",
        "defaultMonths": 24,
        "desc": "2 ans (MAC SST)"
    },
    {
        "id": "incendie",
        "name": "Incendie / EPI",
        "family": "securite",
        "defaultMonths": 24,
        "desc": "2 ans (Manipulation extincteurs & évacuation)"
    },
    {
        "id": "epi",
        "name": "Formation EPI",
        "family": "securite",
        "defaultMonths": 24,
        "desc": "2 ans"
    },
    {
        "id": "habilitation_elec",
        "name": "Hab. Élec. (NF C 18-510)",
        "family": "securite",
        "defaultMonths": 36,
        "desc": "3 ans (Norme NF C 18-510)"
    },
    {
        "id": "amiante",
        "name": "Amiante SS4",
        "family": "securite",
        "defaultMonths": 36,
        "desc": "3 ans (Recyclage SS4)"
    },
    {
        "id": "chimiques",
        "name": "Risq. Chimiques N1/N2",
        "family": "securite",
        "defaultMonths": 36,
        "desc": "3 ans (Niveau 1 / N2)"
    },
    {
        "id": "visite_medicale",
        "name": "Visite Médicale (SMR)",
        "family": "sante",
        "defaultMonths": 24,
        "desc": "2 ans (Suivi Médical Renforcé - SMR)"
    }
];
