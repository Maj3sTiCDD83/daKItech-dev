# 🤖 neXagent

> **KI-gestützter Telefonassistent und Live-Sprach-Automatisierung für KMU**

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white)
![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)

---

## 🎯 Mission

neXagent ist eine moderne SaaS-Plattform, die kleinen und mittelständischen Unternehmen (KMU) aus dem Handwerk, dem Gesundheitswesen und der Immobilienbranche ermöglicht, 24/7-Telefonagenten und Geschäftsprozesse durch modernste Multimodal-KI (Google Gemini Live API) zu automatisieren.

---

## ✨ Kernfunktionen

| Feature | Beschreibung |
| :--- | :--- |
| 📞 **KI-Telefonagent** | Latenzfreie Sprachinteraktion über WebSockets und die Gemini Live API |
| ⚡ **High-Performance Audio** | Ruckelfreies Audio-Processing durch dedizierte **AudioWorklets** (Off-Main-Thread) |
| 🧠 **Echtzeit-Dashboard** | Verwaltung von KI-Rollen (Handwerker, Praxis, etc.), System-Prompts & Stimmen |
| 🔊 **Voice Preview (TTS)** | On-the-fly Sprachbeispiele generieren für Agenten-Konfigurationen |
| 🔒 **DSGVO Compliance** | Saubere Datenhaltung und One-Click Account-Löschung via Firebase |

---

## 🏗️ Architektur

```text
nexagent/
├── src/                  # Hauptquellcode
│   ├── api/              # Google KI Sprach- und Textaufrufe (Gemini API)
│   ├── services/         # Firebase Backend-Zustand & Auth
│   ├── utils/            # Infrastruktur & Error Handling (ApiLogger)
│   └── main.ts           # DOM-Controller & App-Initialisierung
├── public/               # Statische Assets
├── index.html            # MVP Dashboard & Entry Point
├── package.json          # Projektabhängigkeiten & Scripts
└── .env.example          # Umgebungsvariablen-Vorlage
```

---

## 🚀 Schnellstart

### Voraussetzungen

*   **Node.js** >= 18.x
*   **Google Cloud Projekt** mit aktivierter Gemini API
*   **Firebase Projekt** (Firestore & Authentication)

### Installation

```bash
# Repository klonen
git clone https://github.com/dein-repo/nexagent.git
cd nexagent

# Abhängigkeiten installieren
npm install

# Umgebungsvariablen konfigurieren
cp .env.example .env

# Entwicklungsserver starten
npm run dev
```

---

## 📚 Dokumentation

| Datei | Inhalt |
| :--- | :--- |
| `README.md` | Projektübersicht & Schnellstart (dieses Dokument) |
| `.env.example` | Vorlage für alle benötigten System- & API-Keys |
| `package.json` | Abhängigkeiten, Build-Scripte und Projekt Metadaten |

---

## 🎯 Zielgruppen

*   **Handwerksbetriebe:** Anrufannahme, Terminvergabe, Notdienst-Management (z.B. Rohrbruch-Priorisierung)
*   **Immobilienmakler:** Lead-Qualifizierung, Besichtigungstermine abstimmen
*   **Dienstleister & Praxen:** Kundensupport, FAQ-Automatisierung, Rezeptanfragen

---

## 🔒 Lizenz

Dieses Projekt ist proprietäre Software. Alle Rechte vorbehalten. Siehe [LICENSE](#) für Details.

<br>
<p align="left">
  <small>© 2026 daKI.tech Agent.ur | KI-gestützte Automatisierung für KMU</small>
</p>
