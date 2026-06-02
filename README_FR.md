# agent-skills

🇬🇧 *English version: [README.md](./README.md)*

Une petite collection de *skills* (compétences) pour les agents de codage IA,
maintenus sous forme de dossiers autonomes et indépendants. Chaque skill est un
fichier `SKILL.md` (plus d'éventuels fichiers complémentaires) décrivant une
capacité spécialisée que l'agent peut utiliser.

Compatible avec tout agent qui lit des dossiers de skills — [Claude Code](https://claude.com/claude-code),
le [Claude Agent SDK](https://docs.claude.com/en/api/agent-sdk/overview), et
les autres clients qui adoptent la même convention. Dépose un skill à l'endroit
où ton agent va le chercher (par exemple `.claude/skills/` pour Claude Code) et
il devient disponible.

## Skills dans ce repo

### [`skills/interactive-course/`](./skills/interactive-course/)

Un moteur sans build pour des **crash courses interactifs haut de gamme sur
n'importe quel sujet** — programmation, design, science, business, langues,
histoire, musique, cuisine, finance, tout ce qui se transmet. Les auteurs
écrivent le contenu sous forme d'objets JavaScript (blocs typés : explication,
analogie, code, quiz, diagramme, …) et la couche partagée rend des cours
accessibles, thématisés et responsives avec navigation latérale, suivi de
progression par scroll-spy, code coloré, QCM, thème clair/sombre et i18n.
Aucune étape de build. Aucune dépendance JS. Déployable sur GitHub Pages ou
Vercel.

**Démo en direct :** [un exemple "Git Basics"](./skills/interactive-course/courses/example-course/)
(servir `skills/interactive-course/` en HTTP — voir plus bas).

### [`skills/commit/`](./skills/commit/)

Rédige des **messages de commit Git de qualité** qui respectent les
Conventional Commits et expliquent le *pourquoi* d'un changement. Le skill lit
le diff réel (`git status`, `git diff --staged`, `git log`) pour comprendre à
la fois ce qui a changé et le style de commit du projet, puis impose des
**commits atomiques** — en séparant les modifications sans rapport en commits
distincts et ciblés, avec des sujets à l'impératif et des corps qui mettent la
motivation en avant. Par défaut, il propose seulement le(s) message(s) ; il ne
lance `git commit` que si tu le demandes explicitement.

## Installer un skill

Choisis un dossier de skill sous `skills/` et copie-le dans le répertoire où
ton agent lit ses skills. Pour Claude Code, c'est `.claude/skills/` dans le
projet ou `~/.claude/skills/` au niveau global ; pour les autres clients,
consulte leur documentation.

```bash
# Par projet (Claude Code)
mkdir -p mon-projet/.claude/skills
cp -R skills/interactive-course mon-projet/.claude/skills/
cp -R skills/commit             mon-projet/.claude/skills/

# Ou globalement pour ton utilisateur (Claude Code)
mkdir -p ~/.claude/skills
cp -R skills/interactive-course ~/.claude/skills/
cp -R skills/commit             ~/.claude/skills/
```

Ensuite, demande à l'agent quelque chose pour quoi le skill est prévu — par
exemple *"crée un crash course interactif sur X"* ou *"écris un message de
commit pour ces changements"* — et le skill correspondant s'active.

## Lancer la démo en local

Les modules ES ne fonctionnent pas en `file://`, donc la démo a besoin d'un
petit serveur HTTP.

**Avec Python** — depuis la racine du repo :

```bash
cd skills/interactive-course
python3 -m http.server 8000
# ouvre http://localhost:8000/
```

**Avec VS Code** — installe l'extension [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer),
ouvre `skills/interactive-course/index.html`, puis clique sur **Go Live** dans
la barre de statut (ou clic droit sur le fichier → *Open with Live Server*).
Live Server démarre sur `http://127.0.0.1:5500/` et recharge automatiquement
à chaque sauvegarde.

La page catalogue est `skills/interactive-course/index.html`. Le cours
d'exemple se trouve dans `skills/interactive-course/courses/example-course/`.

## Arborescence du repo

```text
skills/                            ← racine du repo
├── README.md
├── README_FR.md
├── LICENSE
├── .gitignore
└── skills/                        ← tous les skills vivent ici
    ├── commit/                    ← skill de messages de commit (un seul SKILL.md)
    └── interactive-course/        ← skill d'auteur de cours, autonome
        ├── SKILL.md               ← ce que l'agent lit
        ├── references/            ← documentation détaillée référencée depuis SKILL.md
        ├── shared/                ← le moteur de rendu (CSS, JS, strings)
        ├── courses/
        │   ├── _template/         ← squelette à copier pour créer un cours
        │   └── example-course/    ← démo "Git Basics"
        └── index.html             ← page catalogue de la démo
```

`skills/interactive-course/` est entièrement autonome : SKILL.md indique à
l'agent de copier `shared/` et `courses/_template/` dans le projet du
consommateur lors de la création du premier cours, pour que les imports
relatifs `../../shared/...` du template se résolvent depuis
`<projet>/courses/<slug>/`.

## Licence

MIT © 2026 Franck Djacoto. Voir [LICENSE](./LICENSE).
