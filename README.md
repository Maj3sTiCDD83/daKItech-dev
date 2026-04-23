# neXagent – KI-Telefonassistent MVP 🚀

neXagent ist eine moderne, hochperformante Webanwendung (Dashboard & Voice-Engine), die es Unternehmen ermöglicht, einen maßgeschneiderten KI-Telefonassistenten zu konfigurieren und zu betreiben. Das System basiert auf der **Google Gemini Live API** (Multimodal) für echte, latenzfreie Sprachinteraktionen und integriert Firebase für das User-Routing.

## ✨ Kernfunktionen

-   **Gemini Live Voice Integration:** Latenzfreie Kommunikation über WebSockets mithilfe des `@google/genai` SDKs. Echtzeit-Modellierung (`gemini-3.1-flash-live-preview`).
-   **High-Performance Audio Engine:** Nutzung von **AudioWorklets** (anstelle des veralteten `ScriptProcessorNode`), um das Mikrofon-Processing vom Browser-Hauptthread zu entkoppeln (verhindert UI-Ruckeln bei hoher Last). Integrierte VAD (Voice Activity Detection).
-   **Echtzeit-Dashboard & Agenten-Management:** Verwalten von KI-Parametern (System-Prompts, Rollen wie "Handwerker" oder "Arztpraxis", Stimmenauswahl). 
-   **Voice Preview (TTS):** Generierung von Sprachbeispielen on-the-fly über die `gemini-3.1-flash-tts-preview` API.
-   **Security & Data Privacy:** Modulare DSGVO-Compliance (One-Click Account- und Datenlöschung) sowie gehärtete Firebase-Authentifizierung.
-   **Erweitertes Logging:** Ein eigens geschriebener `ApiLogger` überwacht zirkulär gesicherte API-Aufrufe (inkl. Download-Funktion für Audits).

## 🛠️ Technologie-Stack

-   **Frontend-Framework:** HTML5, modernisiert durch **Vite** (Tree-shaking fähig)
-   **Styling:** Tailwind CSS (Utility-First)
-   **Sprache:** TypeScript (isoliert in Modulen)
-   **Backend as a Service (BaaS):** Firebase (Auth & Firestore)
-   **KI-Infrastruktur:** Google GenAI SDK (`@google/genai`)

## 📂 Architektur (Modulare Struktur)

Das System ist in logische Bausteine unterteilt, um maximale Skalierungsfähigkeit und einen bevorstehenden React-Rollout vorzubereiten:

```text
/src/
 ├── main.ts                # (DOM-Controller: Bindet HTML & Module zusammen)
 │
 ├── api/
 │    └── geminiApi.ts      # (Backend-Schnittstelle: Google KI Sprach- und Textaufrufe)
 │
 ├── services/
 │    └── firebase.ts       # (Backend-Zustand: Auth- & Datenbank-Konfiguration)
 │
 └── utils/
      └── logger.ts         # (Infrastruktur: Error Handling & Debug-Output)
```

## 🚀 Setup & Installation (Für Entwickler)

### Voraussetzungen
1. **Node.js** (v18 oder höher empfohlen)
2. **Google Cloud / AI Studio Account** (für den Gemini API Key)
3. **Firebase Projekt** (für Auth & Firestore)

### 1. Repository klonen & Abhängigkeiten installieren
```bash
git clone https://github.com/dein-repo/nexagent.git
cd nexagent
npm install
```

### 2. Umgebungsvariablen (.env)
Erstelle eine `.env` Datei im Root-Verzeichnis und füge deinen Gemini-Key hinzu:
```env
GEMINI_API_KEY=dein_geheimer_gemini_api_key_hier
```
*(Die Firebase-Parameter sind aktuell direkt im Code verankert, können aber ebenfalls via Environment-Variables entkoppelt werden).*

### 3. Entwicklungsserver starten
Der Vite-Entwicklungsserver kümmert sich um lokales HMR (Hot Module Replacement, wenn aktiviert) und serviert das Projekt.
```bash
npm run dev
```

### 4. Build für Produktion
Erstellt optimierte, minifizierte statische Dateien im `/dist` Ordner, in denen ungenutzer Code dank Tree Shaking automatisch entfernt wird.
```bash
npm run build
```

## 🔒 Datenschutz & Compliance
Dieses MVP ist als Vorstufe konzipiert. Firebase sammelt nur absolut essenzielle Authentifizierungsdaten. Das Projekt implementiert eine kaskadierende Kontolöschung, die beim Entfernen eines User-Accounts alle Firestore-Einträge dieses Users löscht, bevor der Auth-Record entfernt wird.

## 👥 Kontakt & Support
*NeXagent - Entwickelt für die nahtlose Automatisierung der DACH-Wirtschaft.*
