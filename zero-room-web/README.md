# zero-room-web

Phase 0 canonicalized UI shell with 4 screens:

1. Zero Room: Wake
2. Zero Room: System Status
3. Session Shell: Orientation
4. Session Anchor: Input

## Run

```bash
cd apps/zero-room-web
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173`.

For live data (import/map/entourage), also run the API service on `127.0.0.1:8000`.

UI rationale and phase-0 decisions: `docs/ui-phase-0-notes.md`.
