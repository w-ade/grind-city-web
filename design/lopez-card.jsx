/*
  Grind City — Karim Lopez chase card → Photoshop layers
  Run in Photoshop: File ▸ Scripts ▸ Browse… ▸ pick this file.

  Builds a 1500 × 2089 (300dpi, true card ratio 0.718) layered document that
  matches the current web card 1:1, so you can take it further by hand:

    01 · Frame            stock color (#8E1A28) full-bleed border
    02 · Art (gradient)   teal gradient art window, inset 35px
    03 · Foil — build here EMPTY group, blend = Color Dodge (paint the holo here)
    04 · KARIM LOPEZ      eyebrow text (top-left)
    05 · Karim Lopez      name text (bottom-left)
    06 · Forward          position text

  Corners are square for reliability — round to ~70px if you want the card edge.
  Fonts default to Helvetica so the script never fails on a missing face; swap to
  Roboto Condensed (or whatever) once it's open.
*/

#target photoshop

(function () {
  var W = 1500, H = 2089, RES = 300;
  var INSET = 35;                    // stock border thickness (7px * 5)

  // colors
  var STOCK = [142, 26, 40];          // #8E1A28
  var GRAD = [[14, 94, 88], [0, 178, 169], [63, 211, 198]]; // #0E5E58 / #00B2A9 / #3FD3C6
  var GRAD_LOC = [0, 52, 100];

  var ruler = app.preferences.rulerUnits;
  var typeU = app.preferences.typeUnits;
  app.preferences.rulerUnits = Units.PIXELS;
  app.preferences.typeUnits = TypeUnits.PIXELS;

  var doc = app.documents.add(W, H, RES, "Karim Lopez — Grind City",
    NewDocumentMode.RGB, DocumentFill.TRANSPARENT);

  function solidColor(rgb) {
    var c = new SolidColor();
    c.rgb.red = rgb[0]; c.rgb.green = rgb[1]; c.rgb.blue = rgb[2];
    return c;
  }

  function rectFill(name, rgb, x, y, w, h) {
    var layer = doc.artLayers.add();
    layer.name = name;
    doc.selection.select([[x, y], [x + w, y], [x + w, y + h], [x, y + h]]);
    doc.selection.fill(solidColor(rgb));
    doc.selection.deselect();
    return layer;
  }

  // 01 · Frame — full stock-color background
  rectFill("01 · Frame  (#8E1A28)", STOCK, 0, 0, W, H);

  // 02 · Art window — solid fallback, then a linear gradient on top of it
  var artX = INSET, artY = INSET, artW = W - INSET * 2, artH = H - INSET * 2;
  var art = rectFill("02 · Art (gradient)", GRAD[1], artX, artY, artW, artH);

  try {
    doc.selection.select([[artX, artY], [artX + artW, artY], [artX + artW, artY + artH], [artX, artY + artH]]);
    var cId = charIDToTypeID;
    var grad = new ActionDescriptor();
    var grd = new ActionDescriptor();
    grd.putEnumerated(cId("GrdF"), cId("GrdF"), cId("CstS"));
    grd.putDouble(cId("Intr"), 4096);
    var clrs = new ActionList();
    for (var i = 0; i < GRAD.length; i++) {
      var stop = new ActionDescriptor();
      var rgb = new ActionDescriptor();
      rgb.putDouble(cId("Rd  "), GRAD[i][0]);
      rgb.putDouble(cId("Grn "), GRAD[i][1]);
      rgb.putDouble(cId("Bl  "), GRAD[i][2]);
      stop.putObject(cId("Clr "), cId("RGBC"), rgb);
      stop.putEnumerated(cId("Type"), cId("Clry"), cId("UsrS"));
      stop.putInteger(cId("Lctn"), Math.round(GRAD_LOC[i] / 100 * 4096));
      stop.putInteger(cId("Mdpn"), 50);
      clrs.putObject(cId("Clrt"), stop);
    }
    grd.putList(cId("Clrs"), clrs);
    var trns = new ActionList();
    for (var t = 0; t < 2; t++) {
      var ts = new ActionDescriptor();
      ts.putUnitDouble(cId("Opct"), cId("#Prc"), 100);
      ts.putInteger(cId("Lctn"), t === 0 ? 0 : 4096);
      ts.putInteger(cId("Mdpn"), 50);
      trns.putObject(cId("TrnS"), ts);
    }
    grd.putList(cId("Trns"), trns);
    grad.putUnitDouble(cId("Angl"), cId("#Ang"), -45);   // top-left → bottom-right
    grad.putEnumerated(cId("Type"), cId("GrdT"), cId("Lnr "));
    grad.putObject(cId("Grad"), cId("Grdn"), grd);
    executeAction(cId("Grdn"), grad, DialogModes.NO);
    doc.selection.deselect();
  } catch (e) {
    // gradient is best-effort; solid mid-teal remains if it fails
  }

  // 03 · Foil — empty group set to Color Dodge for the holo
  var foil = doc.layerSets.add();
  foil.name = "03 · Foil — build here  (Color Dodge)";
  foil.blendMode = BlendMode.COLORDODGE;

  // text helper
  function text(name, str, x, baselineY, size, rgb, bold, tracking, opacity) {
    var L = doc.artLayers.add();
    L.kind = LayerKind.TEXT;
    L.name = name;
    var ti = L.textItem;
    ti.kind = TextType.POINTTEXT;
    ti.contents = str;
    ti.size = size;
    try { ti.font = bold ? "Helvetica-Bold" : "Helvetica"; } catch (e) {}
    ti.color = solidColor(rgb);
    if (tracking) ti.tracking = tracking;
    ti.position = [x, baselineY];
    if (opacity !== undefined) L.opacity = opacity;
    return L;
  }

  var WHITE = [255, 255, 255];
  text("04 · KARIM LOPEZ", "KARIM LOPEZ", 120, 190, 46, WHITE, true, 220, 62);
  text("05 · Karim Lopez", "Karim Lopez", 120, 1905, 100, WHITE, true, 0, 100);
  text("06 · Forward", "Forward", 120, 1968, 50, WHITE, false, 40, 82);

  // guides on the art-window inset
  doc.guides.add(Direction.VERTICAL, UnitValue(INSET, "px"));
  doc.guides.add(Direction.VERTICAL, UnitValue(W - INSET, "px"));
  doc.guides.add(Direction.HORIZONTAL, UnitValue(INSET, "px"));
  doc.guides.add(Direction.HORIZONTAL, UnitValue(H - INSET, "px"));

  app.preferences.rulerUnits = ruler;
  app.preferences.typeUnits = typeU;

  app.refresh();
})();
