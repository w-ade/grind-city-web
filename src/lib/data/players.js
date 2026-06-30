/* Grind City roster — chase-card data. Full Memphis roster (ESPN, 2026-06-30,
   post-Ja-trade). `foil` selects a Prizm refractor colorway (prizm.css); `grad`
   is the art-window gradient, `stock` the card-stock frame color.

   Four HERO cards get distinct refractors; everyone else is on Grizzlies navy
   for now (tune as we go). Note: GG took gold (so he reads distinct from the
   navy bench), Edey moved to bench navy — both trivially swappable.

   Rookies without an assigned number yet (Boozer, Lopez, Saunders) carry an
   empty num; the card hides the giant number and the "· #" suffix for them. */

// shared bench look — dark Grizzlies navy refractor
const NAVY = {
  grad: ['#0e1330', '#2c3f6e', '#5D76A9'],
  stock: '#12173E',
  foil: 'navy',
};

export const PLAYERS = [
  // ── Hero cards ──────────────────────────────────────────────
  {
    key: 'boozer', name: 'Cameron Boozer', pos: 'Forward', num: '',
    grad: ['#220A45', '#4A1E94', '#7C3AED'], stock: '#1E0E40', foil: 'amethyst',
  },
  {
    key: 'karim', name: 'Karim Lopez', pos: 'Forward', num: '',
    grad: ['#0E5E58', '#00B2A9', '#3FD3C6'], stock: '#8E1A28', foil: 'teal',
  },
  {
    key: 'scotty', name: 'Scotty Pippen Jr.', pos: 'Guard', num: '1',
    grad: ['#06351F', '#0E7A47', '#19A35E'], stock: '#0A4E2E', foil: 'verde',
  },
  {
    key: 'gg', name: 'GG Jackson', pos: 'Forward', num: '45',
    grad: ['#FFD86B', '#FDB927', '#FFCB30'], stock: '#C4901E', foil: 'gold',
  },

  // ── Bench (Grizzlies navy for now) ──────────────────────────
  { key: 'aldama',   name: 'Santi Aldama',            pos: 'Forward', num: '7',  ...NAVY },
  { key: 'bal',      name: 'Adama Bal',               pos: 'Guard',   num: '72', ...NAVY },
  { key: 'kcp',      name: 'Kentavious Caldwell-Pope', pos: 'Guard',  num: '3',  ...NAVY },
  { key: 'clayton',  name: 'Walter Clayton Jr.',      pos: 'Guard',   num: '4',  ...NAVY },
  { key: 'coward',   name: 'Cedric Coward',           pos: 'Forward', num: '23', ...NAVY },
  { key: 'edey',     name: 'Zach Edey',               pos: 'Center',  num: '14', ...NAVY },
  { key: 'gibson',   name: 'Taj Gibson',              pos: 'Forward', num: '67', ...NAVY },
  { key: 'grant',    name: 'Jerami Grant',            pos: 'Forward', num: '9',  ...NAVY },
  { key: 'hendricks', name: 'Taylor Hendricks',       pos: 'Forward', num: '22', ...NAVY },
  { key: 'jerome',   name: 'Ty Jerome',               pos: 'Guard',   num: '2',  ...NAVY },
  { key: 'mashack',  name: 'Jahmai Mashack',          pos: 'Guard',   num: '21', ...NAVY },
  { key: 'murray',   name: 'Kris Murray',             pos: 'Forward', num: '24', ...NAVY },
  { key: 'okani',    name: 'Toby Okani',              pos: 'Forward', num: '5',  ...NAVY },
  { key: 'prosper',  name: 'Olivier-Maxence Prosper', pos: 'Forward', num: '18', ...NAVY },
  { key: 'rupert',   name: 'Rayan Rupert',            pos: 'Guard',   num: '21', ...NAVY },
  { key: 'saunders', name: 'Richie Saunders',         pos: 'Guard',   num: '',   ...NAVY },
];
