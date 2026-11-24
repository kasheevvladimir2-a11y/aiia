# AiIA — Phase 4.3 Remediation Plan 001

## Document control

- **Repository:** `kasheevvladimir2-a11y/aiia`
- **Branch:** `dax-aiia-masterhub-v0.1`
- **Evidence baseline:** `642125ef1d4852db0be0ec9d9d889560d930c2d5`
- **Plan status:** **PROPOSED — NOT IMPLEMENTED**
- **Human Administrator / Final Authority:** Vladimir Kasheev
- **Source of findings:** Phase 4.2 consolidated findings F-01 through F-12, preserved in `docs/audit/INDEPENDENT_REPOSITORY_VERIFICATION_001.md`.

This is a planning document only. It does not authorize or report code changes, API requests, deployment, or other remediation. Priorities are provisional recommendations. No P0 is assigned because evidence does not establish an immediate critical risk. No canonical application, backend proxy, PWA, or offline requirement is selected or assumed.

## Priority definitions

- **P0:** Immediate critical risk, only where evidence supports it. None assigned.
- **P1:** High-priority architectural/security decision or exposure reduction.
- **P2:** Important engineering/quality work after decisions and requirements.
- **P3:** Optional or requirement-dependent work.

All recommendations and actions below are **PROPOSED**. Current statuses describe evidence, not completion.

## A. Architecture

### F-01 — Duplicate chat implementations

1. **Current evidence status:** **VERIFIED** source; runtime/deployment **UNKNOWN**. `index.html` and `app.js` each contain separate chat implementations.
2. **Recommended remediation:** **PROPOSED** — compare intended behavior and document the target architecture; consolidate or retire an implementation only after human approval.
3. **Priority:** **P1** — duplicate implementations with differing configuration create ambiguity and divergence risk.
4. **Dependencies:** Human decision on intended product/source; deployment context; compatibility and data/history requirements.
5. **Required human decision:** **Yes.** Choose whether to retain one implementation, merge features, or maintain both with distinct purposes. This plan chooses none.
6. **Acceptance criteria:** A reviewed architecture record identifies each retained entry point and responsibility; no unapproved implementation is removed; model/key behavior and source ownership are documented.
7. **Verification method:** Read-only source review and, only if authorized later, browser tests of the approved entry points.
8. **Risks/unresolved questions:** Which file is active? Are the implementations historical alternatives? Should user history/config migrate?

### F-02 — HTML content in `app.js`

1. **Current evidence status:** **VERIFIED** structural mismatch; browser/runtime failure **UNKNOWN**.
2. **Recommended remediation:** **PROPOSED** — determine intended artifact role; rename/restructure only if the Human Administrator approves and deployment references are understood.
3. **Priority:** **P2** — structural clarity and tooling compatibility matter, but failure is not proven.
4. **Dependencies:** F-01/F-06 entry-point decision; hosting/script references; impact assessment for existing links.
5. **Required human decision:** **Yes**, if renaming, deleting or restructuring the artifact.
6. **Acceptance criteria:** Filename, file type and usage agree; references are consistent; validation method is documented.
7. **Verification method:** Inspect references and run appropriate syntax/browser checks only after authorization.
8. **Risks/unresolved questions:** Is it opened as an HTML page, included as a script, or unused? Do external URLs depend on this path?

### F-06 — Canonical entry point unknown

1. **Current evidence status:** **UNKNOWN**; repository has two application-like documents and no configuration selecting one.
2. **Recommended remediation:** **PROPOSED** — record an explicit canonical entry-point decision and deployment path before refactoring.
3. **Priority:** **P1** — foundational for safe architecture, tests and deployment decisions.
4. **Dependencies:** Human product decision; deployment/hosting evidence; F-01 comparison.
5. **Required human decision:** **Yes.** The plan does not choose `index.html`, `app.js`, or another target.
6. **Acceptance criteria:** Approved architecture identifies entry point(s), served paths, asset ownership and intended status of each existing file.
7. **Verification method:** Review approved decision against repository references and authorized hosting configuration.
8. **Risks/unresolved questions:** Is any version deployed? Is there an external deployment configuration not in this repository?

### F-11 — Stylesheet relationship unclear

1. **Current evidence status:** **PARTIALLY VERIFIED**; `style.css` is present, while both HTML documents contain embedded CSS; integration is not established.
2. **Recommended remediation:** **PROPOSED** — document stylesheet ownership and either retain a verified consumer relationship or mark its intended status in an approved architecture.
3. **Priority:** **P2** — prevents styling drift and supports maintainability after the entry point is known.
4. **Dependencies:** F-01/F-06 decision; responsive design requirements.
5. **Required human decision:** Required if removing, merging or assigning ownership where intent is ambiguous.
6. **Acceptance criteria:** Every retained stylesheet has an identified consumer; duplicate rules/ownership are intentional and documented.
7. **Verification method:** Inspect HTML references and run visual checks on approved supported browsers if authorized.
8. **Risks/unresolved questions:** Is `style.css` unused, intended for `app.js`, or a future external stylesheet?

## B. Security

### F-03 — Browser `localStorage` API-key storage

1. **Current evidence status:** **VERIFIED** in both source implementations; actual use, deployment and exposure **UNKNOWN**. Severity remains **MEDIUM provisional**, not a confirmed compromise.
2. **Recommended remediation:** **PROPOSED** — assess key ownership, user expectations and deployment threat model; consider an approved server-side secret-handling design if shared credentials or risk require it. No backend proxy is assumed.
3. **Priority:** **P1** — client-side storage is accessible to same-origin scripts and the browser profile; material impact depends on deployment and key restrictions.
4. **Dependencies:** Threat model; public/private deployment decision; credential policy; availability of approved backend if needed.
5. **Required human decision:** **Yes.** Approve acceptable credential model and whether backend mediation is required.
6. **Acceptance criteria:** Approved design states who supplies keys, where they are stored, exposure assumptions, restrictions, revocation process and user-facing disclosure; no credential is committed or exposed in test evidence.
7. **Verification method:** Source/config review and approved credential-handling tests without displaying secrets; no penetration test implied.
8. **Risks/unresolved questions:** Is the site public? Are credentials user-owned or shared? Are keys origin/API restricted? Is same-origin script trust adequate?

### F-04 — API key in `app.js` URL query string

1. **Current evidence status:** **VERIFIED** source; actual request/log exposure **UNKNOWN**. Severity **MEDIUM provisional**.
2. **Recommended remediation:** **PROPOSED** — if this path remains, avoid URL query-string secrets using an approved authentication mechanism; review browser/proxy/analytics logs and referrer handling.
3. **Priority:** **P1** — query strings may be captured by URL-oriented telemetry/logging; deployment context is unknown.
4. **Dependencies:** F-01/F-06 decision; credential design from F-03; API-provider supported authentication and any backend decision.
5. **Required human decision:** **Yes** before choosing implementation/authentication architecture.
6. **Acceptance criteria:** Approved retained request path carries no API secret in URL; applicable logs are reviewed; test artifacts contain no credential values.
7. **Verification method:** Static source inspection and controlled request/log review only after authorization; never print credentials.
8. **Risks/unresolved questions:** Is this implementation used? What intermediary logs exist? Are historical URLs retained?

### F-05 — Header-based client-side key handling in `index.html`

1. **Current evidence status:** **VERIFIED** source; API call **NOT RUN**. Header use does not protect a key from browser-side scripts/user. Severity **MEDIUM provisional** in context of client-side key handling.
2. **Recommended remediation:** **PROPOSED** — align the request with the human-approved credential model; do not treat header placement alone as secret protection.
3. **Priority:** **P1** — credential exposure/abuse decision should precede production use.
4. **Dependencies:** F-03 decision; canonical entry point; API access and CORS requirements.
5. **Required human decision:** **Yes** on client-provided versus server-managed keys and on any API testing authorization.
6. **Acceptance criteria:** Credential ownership/storage/transmission model approved; key is not embedded in source; any direct browser key use is explicitly accepted and documented with restrictions.
7. **Verification method:** Static inspection; authorized API check only with non-production/approved credentials and secret-safe handling.
8. **Risks/unresolved questions:** Is a shared key used? Can users inspect their own key in this application? Do provider restrictions mitigate abuse?

## C. Quality and deployment

### F-07 — Gemini API functionality not tested

1. **Current evidence status:** Request code **VERIFIED** in source; API behavior **NOT RUN**.
2. **Recommended remediation:** **PROPOSED** — define manual or automated tests for authorized API configuration, response parsing, timeout, failure status and empty response paths.
3. **Priority:** **P2** — necessary before claiming runtime functionality; no successful/failed live call is known.
4. **Dependencies:** Human test authorization; safe test credential; approved model/API; canonical entry point and test criteria.
5. **Required human decision:** **Yes** for use of API credentials, test scope and any external API call.
6. **Acceptance criteria:** Test plan/results identify environment and cases; secrets are redacted; success claims match captured results.
7. **Verification method:** Approved isolated API/browser tests; no API request is authorized by this plan.
8. **Risks/unresolved questions:** Model availability, account permissions, CORS, quotas, privacy and logging.

### F-08 — PWA capability not established

1. **Current evidence status:** **PARTIALLY VERIFIED** mobile metadata/responsive source; manifest/service worker absent from baseline tree; install/offline behavior **NOT RUN**.
2. **Recommended remediation:** **PROPOSED** — first decide whether installability/offline behavior is a requirement. Add PWA assets only if approved.
3. **Priority:** **P3** — optional and requirement-dependent; absence is not a defect if PWA is not required.
4. **Dependencies:** Product requirement; target browsers/devices; hosting over secure context; offline/data requirements.
5. **Required human decision:** **Yes.** Approve or reject PWA/offline scope.
6. **Acceptance criteria:** If approved, requirements cover supported devices, installability, caching, updates and data/privacy behavior; tests meet those requirements. If not approved, do not claim PWA support.
7. **Verification method:** Manifest/service-worker inspection plus authorized browser/device install/offline tests.
8. **Risks/unresolved questions:** Is offline chat expected? How are cached content, API keys and updates handled?

### F-09 — Repository-local tests and CI absent

1. **Current evidence status:** **VERIFIED** absence in complete baseline tree; test execution **NOT RUN**.
2. **Recommended remediation:** **PROPOSED** — define critical behavior and validation scope, then consider adding automated tests and CI.
3. **Priority:** **P2** — important for repeatable quality once architecture is chosen.
4. **Dependencies:** Canonical entry point; testable boundaries; approved CI permissions and secret policy.
5. **Required human decision:** Approval of test scope and CI use/permissions.
6. **Acceptance criteria:** Documented commands run reproducibly; checks cover agreed behavior; CI does not contain real secrets; results are retained.
7. **Verification method:** Run agreed tests and inspect workflow results; none were run for this plan.
8. **Risks/unresolved questions:** What browsers/environments and behaviors are acceptance-critical? Are external checks already in use?

### F-10 — Deployment configuration absent

1. **Current evidence status:** **VERIFIED** absence in complete baseline tree; live deployment **UNKNOWN**.
2. **Recommended remediation:** **PROPOSED** — identify whether deployment is intended and document hosting, build/serve steps, environments, rollback and secrets before adding configuration.
3. **Priority:** **P2** if deployment is required; otherwise **P3**. Requirement is unknown.
4. **Dependencies:** Human deployment decision; canonical entry point; hosting account/permissions; security and credential architecture.
5. **Required human decision:** **Yes** on whether/where deployment is intended.
6. **Acceptance criteria:** If approved, deployment target and version are traceable; deployment and rollback checks are documented; no secrets are committed. If not required, no deployment claim is made.
7. **Verification method:** Inspect approved deployment configuration and verify live behavior only with explicit authorization.
8. **Risks/unresolved questions:** Is a manual/external Pages deployment already configured? Which environments and data are in scope?

### F-12 — Dependencies/build metadata absent

1. **Current evidence status:** **VERIFIED** absence in complete baseline tree; no declared package dependencies found.
2. **Recommended remediation:** **PROPOSED** — retain no-build static setup if intentional, or add minimal tooling metadata only when a defined tool/dependency is required.
3. **Priority:** **P3** — repository uses browser-native source and no build step is currently evidenced; added tooling may be unnecessary.
4. **Dependencies:** Architecture and deployment requirements; decision on external libraries/build process.
5. **Required human decision:** Approval before adding frameworks, packages or build systems.
6. **Acceptance criteria:** The repository either documents reproducible no-build operation or records exact dependencies, pinned versions, build/check commands and maintenance owner.
7. **Verification method:** Fresh-checkout run/build and dependency review after any approved changes.
8. **Risks/unresolved questions:** Is a build intended? Are package dependencies used externally but omitted from repository?

## D. Sequencing and decision gates

1. **PROPOSED first gate:** Human decisions for F-01/F-06 (architecture), F-03/F-05 (credential model), and F-08/F-10 (PWA/deployment requirements).
2. **PROPOSED next:** Resolve file-role/style ownership (F-02/F-11) without breaking any identified hosting path.
3. **PROPOSED after architecture/requirements:** Define tests, API verification, CI and build/deployment needs (F-07/F-09/F-10/F-12).
4. No remediation action is complete or authorized by this plan. No P0 finding is identified. Phase 5 is not started.

---

**Plan status:** PROPOSED — pending Human Administrator decisions and authorization. No code, configuration, tests, credentials or deployment changes are made by this document.
