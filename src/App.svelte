<script>
  import CardList from "./Cards.svelte";
  import Card from "./lib/components/Card.svelte";
  import CardHoverTilt from "./lib/components/CardHoverTilt.svelte";
  import { PLAYERS } from "./lib/data/players.js";

  // ?engine=hovertilt → heroes-only test on simey's hover-tilt web component
  const engine = new URLSearchParams(location.search).get("engine");
  const heroes = PLAYERS.slice(0, 4);
</script>

<main>
  <header>
    <h1>GRIND CITY</h1>
    <p class="sub">Memphis roster · chase cards</p>
    <p class="hint">
      {#if engine === "hovertilt"}hover-tilt engine (heroes) — hover a card{:else}Tap a card to take a closer look — on a phone, tilt it.{/if}
    </p>
  </header>

  {#if engine === "hovertilt"}
    <section class="ht-grid">
      {#each heroes as p (p.key)}
        <CardHoverTilt
          name={p.name}
          number={p.num}
          pos={p.pos}
          foil={p.foil}
          grad={p.grad}
          stock={p.stock}
        />
      {/each}
    </section>
  {:else}
    <CardList>
      {#each PLAYERS as p (p.key)}
        <Card
          name={p.name}
          number={p.num}
          pos={p.pos}
          foil={p.foil}
          grad={p.grad}
          stock={p.stock}
        />
      {/each}
    </CardList>
  {/if}

  <footer>
    Holographic effect engine forked from
    <a href="https://github.com/simeydotme/pokemon-cards-css" target="_blank" rel="noreferrer">pokemon-cards-css</a>
    by Simon Goellner · GPL-3.0
  </footer>
</main>

<style>
  :global(html, body) {
    margin: 0;
    background:
      radial-gradient(120% 90% at 50% -10%, #1a2150 0%, #0a0c1c 55%, #05060f 100%);
    background-attachment: fixed;
    color: #fff;
    font-family: "Roboto Condensed", "Roboto", system-ui, sans-serif;
    min-height: 100%;
  }

  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px 120px;
  }

  .ht-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 48px 40px;
    padding: 40px 0;
  }

  header {
    text-align: center;
    padding: 72px 0 24px;
  }

  h1 {
    margin: 0;
    font-style: italic;
    font-weight: 700;
    font-size: clamp(40px, 9vw, 96px);
    letter-spacing: 0.01em;
    background: linear-gradient(180deg, #fff 0%, #aebbe0 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .sub {
    margin: 6px 0 0;
    font-weight: 700;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    font-size: 12px;
    color: #8ea0cf;
  }

  .hint {
    margin: 18px 0 0;
    font-weight: 300;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.55);
  }

  footer {
    text-align: center;
    margin-top: 80px;
    font-size: 12px;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.4);
  }

  footer a {
    color: rgba(255, 255, 255, 0.7);
  }
</style>
