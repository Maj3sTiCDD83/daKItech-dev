# 📋 Projektdokumentation — daKI.tech Agent.ur

> **Version:** 0.0.0 | **Stand:** Mai 2026 | **Autor:** Maj3sTiCDD83

---

## Inhaltsverzeichnis

1. [Projektübersicht](#1-projektübersicht)
2. [Systemarchitektur](#2-systemarchitektur)
3. [Technologie-Stack](#3-technologie-stack)
4. [Verzeichnisstruktur](#4-verzeichnisstruktur)
5. [Module & Komponenten](#5-module--komponenten)
6. [API-Referenz](#6-api-referenz)
7. [Umgebungsvariablen](#7-umgebungsvariablen)
8. [Installation & Einrichtung](#8-installation--einrichtung)
9. [Entwicklungs-Workflow](#9-entwicklungs-workflow)
10. [Datenbank & Sicherheit](#10-datenbank--sicherheit)
11. [Zielgruppen & Anwendungsfälle](#11-zielgruppen--anwendungsfälle)
12. [Lizenz & Rechtliches](#12-lizenz--rechtliches)

---

## 1. Projektübersicht

**daKI.tech Agent.ur** ist eine moderne SaaS-Plattform (Software as a Service), die kleinen und mittelständischen Unternehmen (KMU) aus dem Handwerk, dem Gesundheitswesen und der Immobilienbranche ermöglicht, 24/7-Telefonagenten und Geschäftsprozesse durch modernste Multimodal-KI zu automatisieren.

### Kernziele

| Ziel | Beschreibung |
|---|---|
| **24/7-Erreichbarkeit** | KI-gestützte Telefon-Automatisierung ohne Ausfallzeiten |
| **KMU-fokussiert** | Speziell für Handwerk, Praxen & Immobilienmakler optimiert |
| **DSGVO-konform** | Datenhaltung in Deutschland, One-Click Account-Löschung |
| **Niedrige Latenz** | Echtzeit-Sprachverarbeitung über WebSockets & AudioWorklets |

---

## 2. Systemarchitektur

```
+-----------------------------------------------------+
|                   Browser / Client                  |
|  +--------------+        +-----------------------+  |
|  |  React SPA   |        |    AudioWorklet        |  |
|  |  (App.tsx)   |        |  (Off-Main-Thread)     |  |
|  +------+-------+        +----------+------------+  |
+---------+--------------------------+----------------+
          | HTTP/REST                | WebSocket
          v                         v
+-----------------------------------------------------+
|               Express Backend (server.ts)           |
|               Port 3000                             |
|  +--------------------+  +------------------------+ |
|  |   Vite Dev Server  |  |   API Routes (/api/*)  | |
|  |   (Middleware)     |  |   Health Check         | |
|  +--------------------+  +------------------------+ |
+------------------+----------------------------------+
                   |
        +----------+----------+
        v                     v
+--------------+    +----------------------+
|  Google      |    |  Firebase            |
|  Gemini API  |    |  +----------------+  |
|  (TTS/LLM)   |    |  |  Firestore DB  |  |
+--------------+    |  +----------------+  |
                    |  |  Auth (Google) |  |
                    |  +----------------+  |
                    +----------------------+
```

### Datenfluss (KI-Telefonat)

1. Benutzer startet Gespräch im Dashboard
2. Mikrofon-Audio wird im `AudioWorklet` verarbeitet (Off-Main-Thread)
3. PCM-Audiodaten werden per WebSocket an Gemini Live API gesendet
4. Gemini generiert Sprachantwort in Echtzeit
5. Antwort-Audio wird über `AudioContext` wiedergegeben
6. Gesprächsprotokoll wird in Firestore gespeichert

---

## 3. Technologie-Stack

### Frontend

| Technologie | Version | Zweck |
|---|---|---|
| React | 19.0.0 | UI-Framework |
| TypeScript | 5.8.2 | Typsicherheit |
| Vite | 6.2.0 | Build-Tool & Dev-Server |
| Tailwind CSS | 4.1.14 | Utility-First Styling |
| Lucide React | 0.546.0 | Icon-Bibliothek |
| Motion | 12.23.24 | Animationen |

### Backend

| Technologie | Version | Zweck |
|---|---|---|
| Node.js | >= 18.x | Laufzeitumgebung |
| Express | 4.21.2 | HTTP-Server |
| TypeScript (tsx) | 4.21.0 | TS-Ausfuehrung ohne Kompilierung |
| dotenv | 17.2.3 | Umgebungsvariablen |

### Cloud-Dienste

| Dienst | SDK-Version | Zweck |
|---|---|---|
| Google Gemini API | @google/genai 1.29.0 | KI-Sprachverarbeitung (TTS/LLM) |
| Firebase Auth | firebase ^12.12.1 | Google OAuth Authentifizierung |
| Cloud Firestore | firebase ^12.12.1 | NoSQL-Datenbank |

---

## 4. Verzeichnisstruktur

```
daKItech-dev/
+-- src/                          # Haupt-Quellcode
|   +-- api/
|   |   +-- geminiApi.ts          # Google Gemini API Client & TTS
|   +-- services/
|   |   +-- firebase.ts           # Firebase Auth & Firestore
|   +-- utils/
|   |   +-- logger.ts             # ApiLogger - Infrastruktur & Error Handling
|   +-- App.tsx                   # Root-Komponente, View-Routing
|   +-- main.tsx                  # React App Entry Point
|   +-- main.ts                   # DOM-Controller & App-Initialisierung
|   +-- index.css                 # Globale Styles
+-- public/                       # Statische Assets
+-- index.html                    # HTML Entry Point
+-- server.ts                     # Express Backend-Server
+-- package.json                  # Dependencies & NPM-Scripts
+-- tsconfig.json                 # TypeScript-Konfiguration
+-- vite.config.ts                # Vite Build-Konfiguration
+-- firebase-applet-config.json   # Firebase Projekt-Konfiguration
+-- firestore.rules               # Firestore Sicherheitsregeln
+-- metadata.json                 # Projekt-Metadaten
+-- .env.example                  # Vorlage fuer Umgebungsvariablen
+-- .gitignore                    # Git-Ausschluesse
+-- README.md                     # Projektuebersicht
+-- DOCUMENTATION.md              # Dieses Dokument
```

---

## 5. Module & Komponenten

### 5.1 `src/App.tsx` - Root-Komponente

Verwaltet das Top-Level-Routing der Anwendung mittels React `useState`. Es gibt zwei Hauptansichten:

| View | Komponente | Beschreibung |
|---|---|---|
| `landing` | `LandingPage` | Marketing-Seite mit Features & Preisen |
| `dashboard` | `Dashboard` | KI-Agent-Verwaltung & Gespraechs-Dashboard |

**Untergeordnete Komponenten:**
- `FeatureCard` - Darstellung von Produktfeatures
- `PricingCard` - Preisplaene-Anzeige
- `NavItem` - Navigationselement
- `StatCard` - Kennzahlen-Anzeige im Dashboard
- `CallRow` - Einzelner Anruf-Eintrag in der Uebersicht

**State-basiertes Routing:**
```tsx
const [view, setView] = useState<'landing' | 'dashboard'>('landing');
// Login:  setView('dashboard')
// Logout: setView('landing')
```

### 5.2 `src/api/geminiApi.ts` - KI-API-Client

Singleton-Client fuer die Google Gemini API. Stellt folgende Funktionen bereit:

#### `getAiClient(): Promise<GoogleGenAI>`

Gibt einen initialisierten `GoogleGenAI`-Client zurueck (Singleton-Pattern). Wirft einen Fehler, wenn `GEMINI_API_KEY` nicht gesetzt ist.

```typescript
const client = await getAiClient();
```

#### `generateVoicePreview(voiceName, onPlayStart?, onPlayEnd?): Promise<void>`

Generiert eine TTS-Sprachvorschau fuer eine gegebene KI-Stimme und spielt sie direkt ueber den `AudioContext` ab.

| Parameter | Typ | Beschreibung |
|---|---|---|
| `voiceName` | `string` | Name der zu verwendenden Gemini-Stimme |
| `onPlayStart` | `() => void` (optional) | Callback wenn Wiedergabe startet |
| `onPlayEnd` | `() => void` (optional) | Callback wenn Wiedergabe endet |

### 5.3 `src/services/firebase.ts` - Firebase-Service

Initialisiert Firebase und exportiert Auth- und Firestore-Instanzen.

**Exportierte Instanzen:**
- `auth` - Firebase Authentication Instanz
- `db` - Firestore Datenbankinstanz

**Exportierte Auth-Funktionen:**
- `signInWithPopup` - Google OAuth Login
- `GoogleAuthProvider` - Auth-Provider
- `signOut` - Abmeldung
- `onAuthStateChanged` - Auth-Status-Listener

**Exportierte Firestore-Funktionen:**
- `collection`, `addDoc`, `getDocs` - Datenzugriff
- `query`, `where`, `onSnapshot` - Abfragen & Echtzeit-Listener
- `doc`, `updateDoc`, `deleteDoc` - Dokument-Operationen
- `serverTimestamp` - Server-seitiger Zeitstempel

### 5.4 `src/utils/logger.ts` - ApiLogger

Infrastruktur-Modul fuer strukturiertes Error Handling und API-Logging.

### 5.5 `server.ts` - Express Backend

Der Backend-Server kombiniert Express API-Routen mit einem Vite Dev-Server als Middleware.

**Konfiguration:**
- Port: `3000`
- Host: `0.0.0.0` (alle Netzwerkinterfaces)

**API-Endpunkte:**

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/api/health` | Health-Check: gibt `{ status: "ok" }` zurueck |

---

## 6. API-Referenz

### REST API (Express)

#### `GET /api/health`

Prueft den Betriebsstatus des Backends.

**Response (200 OK):**
```json
{
  "status": "ok",
  "message": "neXagent Backend is running"
}
```

### Google Gemini Live API

Die Plattform nutzt die Gemini Live API fuer Echtzeit-Sprachverarbeitung:

- **Protokoll:** WebSocket (bidirektional)
- **Eingabe:** PCM-Audiodaten (Mikrofon)
- **Ausgabe:** Sprachsynthese (TTS) + Texttranskription
- **SDK:** `@google/genai` v1.29.0

---

## 7. Umgebungsvariablen

Kopiere `.env.example` nach `.env` und befuelle alle Werte:

```bash
cp .env.example .env
```

| Variable | Pflichtfeld | Beschreibung |
|---|---|---|
| `GEMINI_API_KEY` | Ja | Google Gemini API-Schluessel fuer KI-Funktionen |
| `APP_URL` | Ja | Die URL der Anwendung (fuer OAuth-Callbacks) |

**Wichtig:** Die `.env`-Datei darf **niemals** in das Repository eingecheckt werden (bereits in `.gitignore` eingetragen).

---

## 8. Installation & Einrichtung

### Voraussetzungen

- **Node.js** >= 18.x
- **Google Cloud Projekt** mit aktivierter Gemini API
- **Firebase Projekt** mit Firestore & Authentication

### Schritt-fuer-Schritt-Anleitung

```bash
# 1. Repository klonen
git clone https://github.com/Maj3sTiCDD83/daKItech-dev.git
cd daKItech-dev

# 2. Abhaengigkeiten installieren
npm install

# 3. Umgebungsvariablen konfigurieren
cp .env.example .env
# Oeffne .env und trage deine API-Keys ein

# 4. Entwicklungsserver starten
npm run dev
```

Die Anwendung ist dann unter `http://localhost:3000` erreichbar.

### Firebase einrichten

1. Firebase-Projekt unter console.firebase.google.com erstellen
2. **Authentication** aktivieren - Google als Provider hinzufuegen
3. **Firestore** im Native-Modus aktivieren
4. Firestore-Regeln aus `firestore.rules` uebernehmen

### Google Gemini API einrichten

1. Google Cloud Console oeffnen
2. Gemini API aktivieren
3. API-Key erstellen und in `.env` als `GEMINI_API_KEY` eintragen

---

## 9. Entwicklungs-Workflow

### Verfuegbare NPM-Scripts

| Script | Befehl | Beschreibung |
|---|---|---|
| `npm run dev` | `tsx server.ts` | Entwicklungsserver mit Hot-Reload |
| `npm start` | `node server.ts` | Produktionsserver starten |
| `npm run build` | `vite build` | Produktions-Build erstellen |
| `npm run preview` | `vite preview` | Build-Vorschau lokal ansehen |
| `npm run clean` | `rm -rf dist` | Build-Verzeichnis loeschen |
| `npm run lint` | `tsc --noEmit` | TypeScript-Typueberpruefung |

### Entwicklungsumgebung

Im Entwicklungsmodus (`NODE_ENV !== 'production'`) wird Vite als Middleware in Express eingebunden. Dies ermoeglicht:
- **Hot Module Replacement (HMR)** fuer sofortige UI-Updates
- **TypeScript-Transpilierung** on-the-fly
- **Source Maps** fuer einfaches Debugging

---

## 10. Datenbank & Sicherheit

### Firestore-Datenstruktur

```
Firestore
+-- [Firestore DB ID: ai-studio-...]
    +-- (Collections werden dynamisch angelegt)
```

### Sicherheitsregeln

Die Firestore-Sicherheitsregeln sind in `firestore.rules` definiert und muessen vor dem Deployment in Firebase deployt werden:

```bash
firebase deploy --only firestore:rules
```

### DSGVO-Compliance

| Massnahme | Umsetzung |
|---|---|
| Datenlokation | Firebase EU-Region (falls konfiguriert) |
| One-Click Loeschung | Account-Loeschung inkl. aller Nutzerdaten |
| Keine Drittanbieter-Tracking | Kein Analytics ohne Einwilligung |
| Sichere API-Keys | Keys nur serverseitig, nie im Client-Bundle |

### Authentifizierung

- **Methode:** Google OAuth 2.0 via Firebase Auth
- **Flow:** Popup-basierter Sign-in (`signInWithPopup`)
- **Session-Verwaltung:** Firebase Auth Token (automatische Erneuerung)

---

## 11. Zielgruppen & Anwendungsfälle

### Handwerksbetriebe

- Automatische Anrufannahme ausserhalb der Geschaeftszeiten
- Terminvergabe und Kalenderintegration
- Notdienst-Priorisierung (z. B. Rohrbruch vs. allgemeine Anfrage)
- Weiterleitung dringender Fälle an Bereitschaft

### Immobilienmakler

- Lead-Qualifizierung eingehender Interessenten-Anrufe
- Automatische Terminabstimmung fuer Besichtigungen
- Objektinformationen auf Anfrage

### Dienstleister & Praxen

- 24/7-Kundensupport fuer haeufige Fragen (FAQ-Automatisierung)
- Rezeptanfragen und Terminvergabe in Arztpraxen
- Entlastung des Empfangspersonals

---

## 12. Lizenz & Rechtliches

Dieses Projekt ist **proprietaere Software**. Alle Rechte vorbehalten.

- Unbefugtes Kopieren, Verteilen oder Modifizieren ist untersagt
- Kommerzielle Nutzung nur mit ausdruecklicher schriftlicher Genehmigung
- Fuer Lizenzanfragen: Kontakt ueber das GitHub-Profil

---

(c) 2026 daKI.tech Agent.ur | KI-gestuetzte Automatisierung fuer KMU
