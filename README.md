# Angular Native Federation Micro Frontends

This workspace contains three Angular 17 applications configured with
`@angular-architects/native-federation`:

- `host-shell` (host app, local)
- `remote-azure` (remote micro app, deployable to Azure, also runs standalone)
- `local-micro` (remote micro app running locally)

## App URLs (local)

- Host shell: `http://localhost:4200`
- Remote Azure app (standalone): `http://localhost:4201`
- Local micro app (standalone): `http://localhost:4202`

## Run locally

Install dependencies:

```bash
npm install
```

Run all three apps together:

```bash
npm run start:all
```

If you see an error like "Port 420x is already in use", use:

```bash
npm run start:all:clean
```

Run apps individually:

```bash
npm run start:host
npm run start:remote-azure
npm run start:local-micro
```

## Build

```bash
npm run build:host
npm run build:remote-azure
npm run build:local-micro
```

## Federation wiring

Host manifest file:

- `projects/host-shell/src/assets/federation.manifest.json`

Current local mappings:

- `remoteAzure` -> `http://localhost:4201/remoteEntry.json`
- `localMicro` -> `http://localhost:4202/remoteEntry.json`

Host routes loading remotes:

- `projects/host-shell/src/app/app.routes.ts`

## Deploy `remote-azure` to Azure Static Web Apps

- Build remote app:

```bash
npm run build:remote-azure
```

- Deploy contents of `dist/remote-azure/browser` to Azure Static Web Apps.

- After deployment, copy the public URL for `remoteEntry.json`.
Example:

```text
https://<your-static-web-app>.azurestaticapps.net/remoteEntry.json
```

- Update host manifest (`projects/host-shell/src/assets/federation.manifest.json`)
for `remoteAzure` to point to the Azure URL instead of localhost.

- Restart host app.

## CI/CD

### remote-azure → Azure Static Web Apps

Workflow: `.github/workflows/deploy-remote-azure.yml`

Required GitHub repository secret:

| Secret | Where to get it |
|---|---|
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | Azure Portal → Static Web App → Manage deployment token |

Steps to create the Azure Static Web App:
1. Go to Azure Portal → Create resource → Static Web App.
2. Choose **Free** tier, select your GitHub repo.
3. Set **App location** = `/`, **Output location** = `dist/remote-azure/browser`.
4. Copy the **Deployment token** and add it as the secret above.

After deploy, copy the URL and update `remoteAzure` in the host manifest:
`projects/host-shell/src/assets/federation.manifest.json`

---

### host-shell & local-micro → Netlify

Workflow: `.github/workflows/deploy-netlify.yml`

Required GitHub repository secrets:

| Secret | Where to get it |
|---|---|
| `NETLIFY_AUTH_TOKEN` | Netlify → User settings → Applications → Personal access tokens |
| `NETLIFY_SITE_ID_HOST` | Netlify → host-shell site → Site configuration → Site ID |
| `NETLIFY_SITE_ID_LOCAL_MICRO` | Netlify → local-micro site → Site configuration → Site ID |

Steps:
1. Create two blank Netlify sites (Sites → Add new site → Deploy manually).
2. Add the three secrets above to GitHub (Settings → Secrets → Actions).
3. Push to `main` — the workflow deploys both apps automatically.

---

## Notes

- Each remote app is independently browsable and also consumable by the host shell.
- This workspace currently uses Angular 17 + native federation `17.1.8` for compatibility.
