# Homework 6 QA

## Scope

Session persistence, favourite tracks, protected route, logout, refresh and one-time retry after 401, playback list behaviour, and interface checks at 375, 768, 1440, and 1920 px.

## Real API checks

On 2026-11-15, a disposable account was registered against the deployed API. Token issuance, empty favourites retrieval, adding track 8, and removing track 8 succeeded. A request with an invalid access token returned 401; refresh returned a new access token, and the protected request succeeded with it. No token values were recorded.

## Automated checks

`tests/homework-6.spec.mjs` covers anonymous route protection, favourite removal, rollback after a 500 response, refresh and one retry after 401, failed refresh, and logout. The full Playwright suite also covers the existing audio player and navigation. Browser tests use deterministic API fixtures; they are separate from the real API checks above.

The 1920 px Figma QA Bridge compares the main page against the existing reference. The Playwright desktop Figma anchor test also sets a 1920×1080 viewport.

## Final results

- `npx tsc --noEmit`: PASS.
- `npm run lint`: PASS, no warnings.
- `npm run build`: PASS.
- `npm run qa`: 91 passed, 0 failed, 8 skipped (375, 768, 1440 px).
- `npm run qa:visual`: PASS at 1920×1080 px (run `run-tZNY90`). The bridge checks page loading, assets, console, network and overflow; its report says manual review is required for visual differences because it does not calculate a pixel diff.
- Browser routes, console, network and geometry: PASS at all three Playwright viewport widths. The desktop Figma anchor check additionally ran at 1920×1080 px.

The 8 skips are intentional: the desktop-only Figma anchor test skips on mobile/tablet (2), and the real remote MP3 tests are configured to skip on all three projects (6). Audio controls were exercised by the remaining automated tests using deterministic media fixtures. Browser API scenarios use deterministic responses; the deployed API was checked separately as described above.
