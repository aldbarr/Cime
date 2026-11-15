# Cime — budget suisse

Application web pour gérer son budget personnel et familial en Suisse : budget perso et commun, comptes et virements, fortune (dont objets de valeur), trésorerie sur 12 mois, salaire brut → net, estimation fiscale par commune, 3a multiples, assurances et LAMal, simulateur d'achat immobilier, marchés, objectifs et coach IA. Interface en français, anglais et allemand, thème clair et sombre.

Tout tient dans une seule page HTML, sans framework ni dépendance.

## Structure

```
src/
  shell.html   structure de la page et styles
  geo.js       communes, NPA et charge fiscale de référence par commune
  i18n.js      textes FR / EN / DE
  app.js       logique de l'application
build.js       assemble src/ en dist/index.html
netlify/functions/coach.mjs   coach IA (appel à l'API Claude côté serveur)
netlify.toml   configuration Netlify
```

## En local

```bash
npm run build          # crée dist/index.html
open dist/index.html   # l'app fonctionne directement dans le navigateur
```

Pour tester aussi le coach IA en local : `npx netlify-cli dev` (avec la variable `ANTHROPIC_API_KEY` dans un fichier `.env`).

## Mise en ligne sur Netlify

1. Crée un dépôt GitHub **privé** (voir « Données » plus bas) et pousse ce dossier :
   ```bash
   git remote add origin git@github.com:<ton-compte>/cime.git
   git push -u origin main
   ```
2. Sur Netlify : **Add new site → Import an existing project → GitHub**, choisis le dépôt. Les réglages sont lus dans `netlify.toml` (build : `npm run build`, dossier publié : `dist`).
3. Optionnel, pour le coach IA : **Site configuration → Environment variables**
   - `ANTHROPIC_API_KEY` : ta clé API Anthropic
   - `CLAUDE_MODEL` : le modèle à utiliser (voir la liste à jour sur docs.claude.com ; valeur par défaut dans `coach.mjs`)
4. Déploie. Chaque `git push` sur `main` redéploie automatiquement.

Sans clé API, toute l'application fonctionne ; seul le coach IA affiche un message de configuration.

Alternative sans GitHub : `npm run build` puis glisse le dossier `dist` sur https://app.netlify.com/drop (sans coach IA, car les fonctions ne sont pas déployées ainsi).

## Où sont les données

- Les données de l'utilisateur restent **dans son navigateur** (localStorage). Rien n'est envoyé à un serveur, sauf le résumé chiffré transmis au coach IA quand on clique sur « Challenge-moi ».
- **Historique** : les 40 dernières modifications sont gardées dans le navigateur. Boutons ↶ / ↷ (ou Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z) et menu « Historique » pour revenir avant n'importe quel changement. Une restauration est elle-même annulable.
- **Sauvegarde** : menu « Données » → « Télécharger (.json) » et « Restaurer depuis un fichier ». À faire régulièrement : vider le cache du navigateur efface les données.
- Pas de synchronisation entre appareils pour l'instant. Pour l'ajouter : un stockage serveur (Netlify Blobs, Supabase…) avec une authentification (Netlify Identity, Auth0…).

## Données de référence à mettre à jour

| Donnée | Où | Date |
|---|---|---|
| Taux hypothécaires, indices boursiers | `MARKET` dans `src/app.js` | 13.11.2026 |
| Charge fiscale par commune | `src/geo.js` | dernière année disponible |
| Plafonds 3a, cotisations AVS/AC/LPP | constantes en haut de `src/app.js` | 2026 |
| Frais d'achat immobilier par canton | `FEES` dans `src/app.js` | fourchettes indicatives |

⚠️ `src/geo.js` a été extrait de la base de données interne de Popety (données d'origine AFC). Garde le dépôt privé et vérifie avec Popety avant de rendre le code ou le site public.

## Avertissement

Cime fournit des estimations indicatives, pas un conseil financier, fiscal ou juridique. Le calculateur fiscal de l'AFC, ta banque, ta caisse de pension et ton assureur font foi.
