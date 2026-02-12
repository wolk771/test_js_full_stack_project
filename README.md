# Fullstack Web-App: Architektur-Prototyp (netcup/Plesk)

Dieses Projekt wurde als **intensives Lern- und Testprojekt** konzipiert, um die Grenzen von Node.js-Fullstack-Anwendungen in klassischen Shared-Hosting-Umgebungen (wie netcup/Plesk) zu erforschen.

## 🎯 Projektziel & Motivation
Das Ziel war es, innerhalb kürzester Zeit von Null auf ein professionelles Architektur-Niveau zu gelangen. 
**Besonderer Fokus lag auf dem autodidaktischen Erlernen von:**
- **React & Express:** Aufbau einer entkoppelten Fullstack-Struktur mit TypeScript.
- **Infrastruktur-Herausforderungen:** Implementierung von automatisierten Prozessen (Git-Webhooks, Auto-Restart) in Umgebungen mit eingeschränkten Root-Rechten.
- **Datenbank-Evolution:** Einsatz von Knex.js für einen code-gesteuerten Datenbank-Workflow (Migrationen/Seeds) anstelle manueller DB-Pflege.

## 💡 Meilensteine & Lerninhalte
Während der Entwicklung wurden gezielt Lösungen für komplexe Probleme erarbeitet:
- **Build-Pipeline:** Da Shared-Hosting oft keine Ressourcen für schwere Build-Prozesse bietet, wurde ein "Local Build - Remote Deploy" Workflow etabliert.
- **Umgebungssynchronität:** Verwendung von Podman/Docker (MySQL 8.4 LTS) lokal, um eine exakte Spiegelung der Produktionsumgebung (netcup) zu gewährleisten.
- **Sicherheits-Architektur:** Implementierung eines robusten RBAC-Systems (Role Based Access Control) mit Passwort-Hashing (Bcrypt) und automatischer Integritätsprüfung beim Systemstart.

## 🏗️ Architektur (Variante B)
Das Projekt folgt dem Prinzip der **Separation of Concerns**:
- **Backend:** Express mit TypeScript. Logik ist strikt in `src/controllers/` gekapselt.
- **Frontend:** React (Vite). Das kompilierte Bundle wird im `public/`-Ordner des Backends ausgeliefert.
- **Datenbank:** Knex.js als Query Builder & Migrations-Tool.
- **Interfaces:** Zentraler Vertrag für API-Antworten in `src/interfaces/ApiResponse.ts`.

## ⚙️ Build-Prozess & Pipeline
Um Rechteprobleme und Ressourcenengpässe auf dem Webhosting zu vermeiden, gilt: **Local Build - Remote Deploy**.

1. **TypeScript (Backend):** `npx tsc` wandelt den Code von `src/` nach `dist/` um.
2. **Vite (Frontend):** `npm run build` im Frontend-Ordner aktualisiert das `public/`-Verzeichnis des Backends.
3. **Knex-Workflow:** Migrationen werden als `.ts` in `src/migrations/` erstellt, aber als `.js` aus `dist/migrations/` ausgeführt.

## 🔄 Deployment & Automatisierung (Plesk)
- **Git-Webhook:** Überträgt Änderungen automatisch nach dem Merge in `main`.
- **Auto-Restart:** Die Datei `tmp/restart.txt` triggert das Node.js-Modul in Plesk. Eine Änderung an dieser Datei löst einen sofortigen Neustart der App aus.
- **Schema-Sync:** Beim App-Start führt das Backend automatisch `db.migrate.latest()` aus. Code und Datenbank bleiben so immer synchron.

---

## 🧪 Lokale Simulation & Testing (Production)
Um die Praxistauglichkeit zu beweisen, wird die **kompilierte JavaScript-Version** lokal unter Produktionsbedingungen getestet:

### 1. Infrastruktur (Podman/Docker)
Stelle sicher, dass die Datenbank (MySQL 8.4 LTS) läuft:
 ``` 
 bash
  podman-compose up -d
 ``` 
### 2. **Kompilierung:**
Wandelt den TypeScript-Code in lauffähiges JavaScript um:
 ``` 
 bash
  npx tsc
 ``` 
### 3. App im Produktions-Modus starten
Damit Knex die Pfade der production-Umgebung nutzt (JS-Migrationen aus dist/ statt TS aus src/):
- **Windows (PowerShell)**:
`$env:NODE_ENV="production"; node dist/app.js`
- **Linux / Mac / GitBash** :
`NODE_ENV=production node dist/app.js`
> **⚠️ Wichtiger Hinweis für die Entwicklung:**
> Wenn `NODE_ENV` auf `production` gesetzt ist, erstellt `npx knex migrate:make` Dateien fälschlicherweise im `dist`-Ordner. 
> Um neue Migrationen im `src`-Ordner zu erstellen, muss die Umgebungsvariable vorher zurückgesetzt werden:
> - **Windows (PowerShell):** `$env:NODE_ENV=""`
> - **Linux / Mac / GitBash:** `unset NODE_ENV`


---

## 💡 Wichtige Erkenntnisse (Lessons Learned)
*   **Pfad-Management:** Die `knexfile.js` liegt in der Wurzel, damit sowohl das CLI (`npx knex`) als auch die App (`dist/app.js`) darauf zugreifen können. Absolute Pfade in der Config werden mit `path.join(__dirname, ...)` abgesichert, um Umgebungsfehler zu vermeiden.
*   **MySQL Versionen:** Für Konsistenz zwischen Local-Dev und Plesk wird lokal **MySQL 8.4 LTS** verwendet. Dies vermeidet Inkompatibilitäten mit den neueren Innovation-Releases (9.x) und harmoniert perfekt mit dem netcup-Standard (8.0.x).
*   **TypeScript Root-Control:** In der `tsconfig.json` ist `rootDir: "./src"` gesetzt. Dies erzwingt eine flache Struktur im `dist/`-Ordner und verhindert eine ungewollte Verschachtelung wie `dist/src/app.js`.
*   **Plesk-Git-Workflow:** Da `npm`-Befehle innerhalb der Plesk-Git-Aktionen oft Pfad-Probleme verursachen, wird die Automatisierung dort auf `touch tmp/restart.txt` beschränkt. Alle Builds (TSC/Vite) werden lokal finalisiert und als Artefakte übertragen. Bei der Installation neuer Packages muss dies manuell im Plesk (NPM-Installation Button) ausgeführt werden.

