<script>
  // A hero card built on simey's hover-tilt web component (tilt + glare),
  // with our Prizm foil layered onto the `tilt` shadow part and driven by the
  // component's exposed --hover-tilt-* vars. Same face as Card.svelte.
  export let name = "";
  export let number = "";
  export let pos = "";
  export let foil = "";
  export let grad = ["#0e1330", "#2c3f6e", "#5D76A9"];
  export let stock = "#12173E";
</script>

<hover-tilt
  class="ht-card"
  data-foil={foil}
  scale-factor="1.07"
  tilt-factor="1"
  glare-intensity="0.5"
  glare-mask-mode="luminance"
  blend-mode="hard-light"
  shadow
>
  <div
    class="cc-art"
    style="--g1:{grad[0]}; --g2:{grad[1]}; --g3:{grad[2]}; --stock:{stock};"
  >
    <span class="cc-eyebrow">{name.toUpperCase()}</span>
    {#if number}<span class="cc-num">{number}</span>{/if}
    <span class="cc-foot">
      <span class="cc-foot__name">{name}</span>
      <span class="cc-foot__sub">{pos}{number ? ` · #${number}` : ""}</span>
    </span>
  </div>
</hover-tilt>

<style>
  .ht-card {
    display: block;
    width: 300px;
  }

  .cc-art {
    position: relative;
    container-type: inline-size;
    width: 300px;
    height: 418px;
    border-radius: 14px;
    overflow: hidden;
    background: linear-gradient(135deg, var(--g1) 0%, var(--g2) 52%, var(--g3) 100%);
    box-shadow:
      inset 0 0 0 7px var(--stock),
      inset 0 0 0 8px rgba(255, 255, 255, 0.14);
    color: #fff;
    font-family: "Roboto Condensed", "Roboto", system-ui, sans-serif;
  }

  .cc-eyebrow {
    position: absolute; top: 6.5%; left: 8%;
    font-weight: 700; font-size: 3.1cqw; letter-spacing: 0.22em;
    color: rgba(255, 255, 255, 0.62);
  }
  .cc-num {
    position: absolute; top: 1%; right: 7%;
    font-style: italic; font-weight: 700; font-size: 33cqw; line-height: 1;
    color: rgba(255, 255, 255, 0.16); letter-spacing: -0.04em;
  }
  .cc-foot {
    position: absolute; left: 8%; right: 8%; bottom: 7%;
    display: flex; flex-direction: column; gap: 0.15em;
  }
  .cc-foot__name { font-weight: 700; font-size: 6.6cqw; line-height: 1.02; }
  .cc-foot__sub {
    font-weight: 300; font-size: 3.3cqw; letter-spacing: 0.04em;
    color: rgba(255, 255, 255, 0.82);
  }

  /* Prism foil on the hover-tilt `tilt` part — driven by the web component's
     own --hover-tilt-x/y/opacity vars (custom props inherit into shadow DOM). */
  :global(.ht-card::part(tilt))::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-image:
      linear-gradient(-30deg,
        var(--p1), var(--p2), var(--p3), var(--p4), var(--p5), var(--p6), var(--p7),
        var(--p1), var(--p2), var(--p3), var(--p4), var(--p5), var(--p6), var(--p7),
        var(--p1)),
      var(--hover-tilt-default-gradient, none);
    background-size: 300% 300%, cover;
    background-position:
      calc(50% + var(--hover-tilt-x, 0) * 45%) calc(50% + var(--hover-tilt-y, 0) * 45%),
      center;
    background-blend-mode: color-dodge;
    mix-blend-mode: color-dodge;
    filter: contrast(1.9) saturate(1.05) brightness(0.9);
    opacity: calc(var(--hover-tilt-opacity, 0) * 0.85);
    will-change: background-position, opacity;
  }

  /* palettes (custom props on the host inherit through the shadow boundary) */
  :global(.ht-card[data-foil="navy"]) {
    --p1: hsl(222,45%,42%); --p2: hsl(212,55%,56%); --p3: hsl(202,62%,74%);
    --p4: hsl(46,72%,64%);  --p5: hsl(210,42%,50%); --p6: hsl(230,42%,46%); --p7: hsl(250,36%,44%);
  }
  :global(.ht-card[data-foil="teal"]) {
    --p1: hsl(176,70%,42%); --p2: hsl(166,58%,56%); --p3: hsl(40,56%,62%);
    --p4: hsl(28,52%,54%);  --p5: hsl(176,66%,46%); --p6: hsl(190,56%,56%); --p7: hsl(350,56%,50%);
  }
  :global(.ht-card[data-foil="gold"]) {
    --p1: hsl(42,70%,44%); --p2: hsl(50,95%,66%); --p3: hsl(54,100%,90%);
    --p4: hsl(34,75%,48%); --p5: hsl(48,95%,72%); --p6: hsl(38,58%,38%); --p7: hsl(52,100%,84%);
  }
  :global(.ht-card[data-foil="verde"]) {
    --p1: hsl(150,66%,40%); --p2: hsl(140,56%,52%); --p3: hsl(118,52%,56%);
    --p4: hsl(95,56%,56%);  --p5: hsl(160,60%,44%); --p6: hsl(172,52%,46%); --p7: hsl(142,56%,42%);
  }
  :global(.ht-card[data-foil="amethyst"]) {
    --p1: hsl(270,62%,46%); --p2: hsl(288,62%,56%); --p3: hsl(318,66%,60%);
    --p4: hsl(340,72%,62%); --p5: hsl(270,62%,52%); --p6: hsl(255,56%,50%); --p7: hsl(280,62%,54%);
  }
</style>
