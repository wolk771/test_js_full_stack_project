# Fullstack App: Architektur & Deployment (netcup)

Dieses Projekt dient als robuster Grundgerüst-Prototyp für eine Fullstack-Anwendung mit Fokus auf Modularität und Automatisierung in einer Shared-Hosting-Umgebung.

## 🏗️ Architektur (Variante B)
Das Projekt folgt einer klaren Trennung (Separation of Concerns):
- **Backend:** Express mit TypeScript. Logik ist in `controllers/` gekapselt.
- **Frontend:** React (Vite), das als statisches Bundle im `public/`-Ordner des Backends liegt.
- **Interfaces:** Zentral definierte Verträge für API-Antworten in `src/interfaces/`.

## ⚙️ Build-Prozess (Warum lokal?)
Um Fehlern auf dem Webhosting vorzubeugen, führen wir Builds lokal durch:
1. **TypeScript-Kompilierung:** `npx tsc` wandelt den Code in `dist/` um.
2. **Frontend-Build:** `npm run build` innerhalb des Frontend-Ordners aktualisiert das `public/`-Verzeichnis.
3. **Sicherheit:** Der Server erhält nur lauffähige JavaScript-Dateien. Dies umgeht Rechteprobleme bei `npm install` im Plesk-Git-Workflow.

## 🔄 Deployment & Kommunikation
- **Git-Webhook:** Überträgt Änderungen automatisch nach dem Merge in `main`.
- **Auto-Restart:** Die Datei `tmp/restart.txt` dient als Trigger für das Node.js-Modul in Plesk. Eine Änderung an dieser Datei löst einen Neustart der App aus.
- **API-Struktur:** Alle Antworten folgen dem `ApiResponse`-Interface `{ status, message, data }`.
