# Eden demo — photography sources

This is a non-commissioned concept website.

## A. Atmospheric / concept imagery

The hero, aperitivo and lead atmosphere compositions use high-resolution Unsplash photography as editorial atmosphere references. These images do **not** necessarily depict Eden Francavilla.

Current Unsplash source identifiers used in `index.html`:

- Hero background — `photo-1776774970642-771d22a42958`
- Hero editorial cocktail image — `photo-1773798795857-15c230fd2e43`
- Aperitivo section — `photo-1707069517655-544ad76c8771`
- Lead atmosphere image — `photo-1768948166220-4de4adeeb3ff`

The implementation requests responsive derivatives from `images.unsplash.com` with `srcset`/`sizes` where useful.

## B. Eden-linked imagery

- Coffeeland listing for Eden Francavilla al Mare — public venue/review imagery is retained in the atmosphere gallery and as selected fallbacks.

## C. Documented event imagery

- Food News Italia, coverage of the Mercato del Pane Francavilla opening (25 July 2025) — the current demo uses selected images from that coverage in the mixology/aperitivo storytelling because the source documents cocktails created for the event by Eden Francavilla.

## D. Fallback imagery

Selected remote atmospheric images expose a `data-fallback` in `index.html` so Eden-linked Coffeeland imagery can be used as a backup if the primary source fails.

## Production note

For a commissioned production site, replace third-party concept and review imagery with approved owner-supplied original photography and confirm all usage rights before launch.
