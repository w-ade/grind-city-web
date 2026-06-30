# Grind City

Memphis Grizzlies roster as holographic chase cards. The full roster as a tap-to-expand
deck — hover (or tilt your phone) and the foil refracts. Four hero cards get distinct
Prizm refractors; the rest of the roster rides Grizzlies navy.

**Live:** _(deploying)_

## Lineage / credit

The holographic effect engine is **forked from
[simeydotme/pokemon-cards-css](https://github.com/simeydotme/pokemon-cards-css)** by
Simon Goellner — the gold standard for CSS holographic cards. This project keeps his
spring/pointer/gyro plumbing and the layered shine/glare compositing, and replaces the
card face and foils:

- the pokemon card image → a full-bleed team-gradient face (jersey number, name, stock frame)
- the per-rarity pokemon foils → full-bleed **Prizm refractors** keyed to Grizzlies eras
  (`src/lib/components` + `public/css/cards/prizm.css`)
- the pokemon TCG data layer → the live Memphis roster (`src/lib/data/players.js`)

Because the original is **GPL-3.0**, this project is **GPL-3.0** too (see `LICENSE`).

## Develop

```bash
npm install
npm run dev      # http://localhost:5173  (--host exposes a LAN URL for phone testing)
npm run build    # → dist/
```

`?foil=1` freezes every card in a lit pose (handy for judging foils without hovering).

## Roster

Pulled from ESPN (2026-06-30). Four heroes — Cameron Boozer (amethyst), Karim Lopez
(verde), Scotty Pippen Jr. (teal), GG Jackson (gold) — the bench on navy. Edit
`src/lib/data/players.js` to retune colorways or numbers.
