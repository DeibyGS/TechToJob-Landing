# API — TechToJob-Landing

Version: 1.0.0
Last updated: 2026-09-16

**Status: not applicable for v1.**

This project has no API surface of its own — it's a fully static landing
page (see `docs/ARCHITECTURE.md`). The only external network call the app
makes is a client-side `POST` from the newsletter form to Formspree's hosted
endpoint, fully documented inline in
`src/components/forms/NewsletterForm.tsx` — a single `fetch` call doesn't
warrant a standalone API contract doc.

This file is kept as a placeholder (per the project's full doc structure,
see `~/.sdd/templates/README.md`) rather than omitted, so the structure is
visible from day one. It gets filled in if this project ever grows a real
backend/API — see the "Evolution path" section of `docs/ARCHITECTURE.md`.
