<script>
  import { spring } from "svelte/motion";
  import { onMount } from "svelte";
  import { activeCard } from "../stores/activeCard.js";
  import { orientation, resetBaseOrientation } from "../stores/orientation.js";
  import { clamp, round, adjust } from "../helpers/Math.js";

  // roster-card data
  export let name = "";
  export let number = "";        // jersey number
  export let pos = "";           // position
  export let foil = "";          // Prizm refractor colorway (see prizm.css)
  export let rarity = "common";  // legacy; kept harmless
  export let types = "";         // optional glow accent
  export let grad = ["#0e1330", "#2c3f6e", "#5D76A9"]; // art-window gradient
  export let stock = "#12173E";  // card-stock frame color

  // context/environment props
  export let showcase = false;

  const randomSeed = {
    x: Math.random(),
    y: Math.random()
  }

  const cosmosPosition = {
    x: Math.floor( randomSeed.x * 734 ),
    y: Math.floor( randomSeed.y * 1280 )
  };

  let thisCard;
  let repositionTimer;
  let rafId = null;
  let pendingSpringUpdate = null;

  let active = false;
  let interacting = false;
  let firstPop = true;
  let loading = false;
  let isVisible = document.visibilityState === "visible";

  const springInteractSettings = { stiffness: 0.066, damping: 0.25 };
  const springPopoverSettings = { stiffness: 0.033, damping: 0.45 };
  let springRotate = spring({ x: 0, y: 0 }, springInteractSettings);
  let springGlare = spring({ x: 50, y: 50, o: 0 }, springInteractSettings);
  let springBackground = spring({ x: 50, y: 50 }, springInteractSettings);
  let springRotateDelta = spring({ x: 0, y: 0 }, springPopoverSettings);
  let springTranslate = spring({ x: 0, y: 0 }, springPopoverSettings);
  let springScale = spring(1, springPopoverSettings);

  let showcaseInterval;
  let showcaseTimerStart;
  let showcaseTimerEnd;
  let showcaseRunning = showcase;

  const endShowcase = () => {
    if (showcaseRunning) {
      clearTimeout(showcaseTimerEnd);
      clearTimeout(showcaseTimerStart);
      clearInterval(showcaseInterval);
      showcaseRunning = false;
    }
  };

  const interact = (e) => {

    endShowcase();

    if (!isVisible) {
      return (interacting = false);
    }

    // prevent other background cards being interacted with
    if ($activeCard && $activeCard !== thisCard) {
      return (interacting = false);
    }

    interacting = true;

    if (e.type === "touchmove") {
      e.clientX = e.touches[0].clientX;
      e.clientY = e.touches[0].clientY;
    }

    const $el = e.target;
    const rect = $el.getBoundingClientRect(); // get element's current size/position
    const absolute = {
      x: e.clientX - rect.left, // get mouse position from left
      y: e.clientY - rect.top, // get mouse position from right
    };
    const percent = {
      x: clamp(round((100 / rect.width) * absolute.x)),
      y: clamp(round((100 / rect.height) * absolute.y)),
    };
    const center = {
      x: percent.x - 50,
      y: percent.y - 50,
    };

    // Store the latest interaction data
    pendingSpringUpdate = {
      background: {
        x: adjust(percent.x, 0, 100, 37, 63),
        y: adjust(percent.y, 0, 100, 33, 67),
      },
      rotate: {
        x: round(-(center.x / 3.5)),
        y: round(center.y / 3.5),
      },
      glare: {
        x: round(percent.x),
        y: round(percent.y),
        o: 1,
      }
    };

    // Schedule spring update for next frame if not already scheduled
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        if (pendingSpringUpdate) {
          updateSprings(
            pendingSpringUpdate.background,
            pendingSpringUpdate.rotate,
            pendingSpringUpdate.glare
          );
          pendingSpringUpdate = null;
        }
        rafId = null;
      });
    }
  };

  const interactEnd = (e, delay = 500) => {
    // Cancel any pending animation frame
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    pendingSpringUpdate = null;

    setTimeout(function () {
      const snapStiff = 0.01;
      const snapDamp = 0.06;
      interacting = false;

      springRotate.stiffness = snapStiff;
      springRotate.damping = snapDamp;
      springRotate.set({ x: 0, y: 0 }, { soft: 1 });

      springGlare.stiffness = snapStiff;
      springGlare.damping = snapDamp;
      springGlare.set({ x: 50, y: 50, o: 0 }, { soft: 1 });

      springBackground.stiffness = snapStiff;
      springBackground.damping = snapDamp;
      springBackground.set({ x: 50, y: 50 }, { soft: 1 });
    }, delay);
  };

  const activate = (e) => {
    if ($activeCard && $activeCard === thisCard) {
      $activeCard = undefined;
    } else {
      $activeCard = thisCard;
      resetBaseOrientation();
    }
  };

  const deactivate = (e) => {
    interactEnd();
    $activeCard = undefined;
  };

  const reposition = (e) => {
    clearTimeout(repositionTimer);
    repositionTimer = setTimeout(() => {
      if ($activeCard && $activeCard === thisCard) {
        setCenter();
      }
    }, 300);
  };

  const setCenter = () => {
    const rect = thisCard.getBoundingClientRect(); // get element's size/position
    const view = document.documentElement; // get window/viewport size

    const delta = {
      x: round(view.clientWidth / 2 - rect.x - rect.width / 2),
      y: round(view.clientHeight / 2 - rect.y - rect.height / 2),
    };
    springTranslate.set({
      x: delta.x,
      y: delta.y,
    });
  };

  const popover = () => {
    const rect = thisCard.getBoundingClientRect(); // get element's size/position
    let delay = 100;
    let scaleW = (window.innerWidth / rect.width) * 0.9;
    let scaleH = (window.innerHeight / rect.height) * 0.9;
    let scaleF = 1.75;
    setCenter();
    if (firstPop) {
      delay = 1000;
      springRotateDelta.set({
        x: 360,
        y: 0,
      });
    }
    firstPop = false;
    springScale.set(Math.min(scaleW, scaleH, scaleF));
    interactEnd(null, delay);
  };

  const retreat = () => {
    springScale.set(1, { soft: true });
    springTranslate.set({ x: 0, y: 0 }, { soft: true });
    springRotateDelta.set({ x: 0, y: 0 }, { soft: true });
    interactEnd(null, 100);
  };

  const reset = () => {
    interactEnd(null, 0);
    springScale.set(1, { hard: true });
    springTranslate.set({ x: 0, y: 0 }, { hard: true });
    springRotateDelta.set({ x: 0, y: 0 }, { hard: true });
    springRotate.set({ x: 0, y: 0 }, { hard: true });
  };

  $: {
    if ($activeCard && $activeCard === thisCard) {
      popover();
      active = true;
    } else {
      retreat();
      active = false;
    }
  }

  const staticStyles = `
    --seedx: ${randomSeed.x};
    --seedy: ${randomSeed.y};
    --cosmosbg: ${cosmosPosition.x}px ${cosmosPosition.y}px;
  `;
  $: dynamicStyles = `
    --pointer-x: ${$springGlare.x}%;
    --pointer-y: ${$springGlare.y}%;
    --pointer-from-center: ${
      clamp( Math.sqrt(
        ($springGlare.y - 50) * ($springGlare.y - 50) +
        ($springGlare.x - 50) * ($springGlare.x - 50)
      ) / 50, 0, 1) };
    --pointer-from-top: ${$springGlare.y / 100};
    --pointer-from-left: ${$springGlare.x / 100};
    --card-opacity: ${$springGlare.o};
    --rotate-x: ${$springRotate.x + $springRotateDelta.x}deg;
    --rotate-y: ${$springRotate.y + $springRotateDelta.y}deg;
    --background-x: ${$springBackground.x}%;
    --background-y: ${$springBackground.y}%;
    --card-scale: ${$springScale};
    --translate-x: ${$springTranslate.x}px;
    --translate-y: ${$springTranslate.y}px;
	`;

  $: {
    rarity = rarity.toLowerCase();
    if (Array.isArray(types)) {
      types = types.join(" ").toLowerCase();
    }
  }

  const orientate = (e) => {

    const x = e.relative.gamma;
    const y = e.relative.beta;
    const limit = { x: 16, y: 18 };

    const degrees = {
      x: clamp(x, -limit.x, limit.x),
      y: clamp(y, -limit.y, limit.y)
    };

    updateSprings({
      x: adjust(degrees.x, -limit.x, limit.x, 37, 63),
      y: adjust(degrees.y, -limit.y, limit.y, 33, 67),
    },{
      x: round(degrees.x * -1),
      y: round(degrees.y),
    },{
      x: adjust(degrees.x, -limit.x, limit.x, 0, 100),
      y: adjust(degrees.y, -limit.y, limit.y, 0, 100),
      o: 1,
    });

  };

  const updateSprings = ( background, rotate, glare ) => {

    springBackground.stiffness = springInteractSettings.stiffness;
    springBackground.damping = springInteractSettings.damping;
    springRotate.stiffness = springInteractSettings.stiffness;
    springRotate.damping = springInteractSettings.damping;
    springGlare.stiffness = springInteractSettings.stiffness;
    springGlare.damping = springInteractSettings.damping;

    springBackground.set(background);
    springRotate.set(rotate);
    springGlare.set(glare);

  }

  $: {
    if ($activeCard && $activeCard === thisCard) {
      interacting = true;
      orientate($orientation);
    }
  }

  document.addEventListener("visibilitychange", (e) => {
    isVisible = document.visibilityState === "visible";
    endShowcase();
    reset();
  });

  onMount(() => {

    // screenshot/debug aid: ?foil freezes a lit foil pose so the holo is
    // visible in static captures (it's otherwise driven by live pointer/gyro).
    if (typeof location !== "undefined" && location.search.includes("foil")) {
      interacting = true;
      springRotate.set({ x: -13, y: 9 }, { hard: true });
      springGlare.set({ x: 32, y: 26, o: 1 }, { hard: true });
      springBackground.set({ x: 41, y: 34 }, { hard: true });
      return;
    }

    // run a cute little animation on load for the showcase card
    if (showcase && isVisible) {
      const s = 0.02;
      const d = 0.5;
      let r = 0;
      showcaseTimerStart = setTimeout(() => {
        interacting = true;
        active = true;
        springRotate.stiffness = s;
        springRotate.damping = d;
        springGlare.stiffness = s;
        springGlare.damping = d;
        springBackground.stiffness = s;
        springBackground.damping = d;
        if (isVisible) {
          showcaseInterval = setInterval(function () {
            r += 0.05;
            springRotate.set({ x: Math.sin(r) * 25, y: Math.cos(r) * 25 });
            springGlare.set({
              x: 55 + Math.sin(r) * 55,
              y: 55 + Math.cos(r) * 55,
              o: 0.8,
            });
            springBackground.set({
              x: 20 + Math.sin(r) * 20,
              y: 20 + Math.cos(r) * 20,
            });
          }, 20);
          showcaseTimerEnd = setTimeout(() => {
            clearInterval(showcaseInterval);
            interactEnd(null, 0);
          }, 4000);
        } else {
          interacting = false;
          active = false;
          return;
        }
      }, 2000);
    }
  });
</script>

<svelte:window on:scroll={reposition} />

<div
  class="card {types} / interactive / "
  class:active
  class:interacting
  class:loading
  data-rarity={rarity}
  data-foil={foil}
  style={dynamicStyles}
  bind:this={thisCard}
>
  <div class="card__translater">
    <button
      class="card__rotator"
      on:click={activate}
      on:pointermove={interact}
      on:mouseout={interactEnd}
      on:blur={deactivate}
      aria-label="Expand the {name} chase card."
      tabindex="0"
    >
      <div class="card__back">
        <div class="cc-back">
          <span class="cc-back__word">GRIND</span>
          <span class="cc-back__word">CITY</span>
        </div>
      </div>

      <div class="card__front" style={staticStyles}>
        <div
          class="cc-art"
          style="--g1:{grad[0]}; --g2:{grad[1]}; --g3:{grad[2]}; --stock:{stock};"
        >
          <span class="cc-eyebrow">{name.toUpperCase()}</span>
          {#if number}
            <span class="cc-num">{number}</span>
          {/if}
          <span class="cc-foot">
            <span class="cc-foot__name">{name}</span>
            <span class="cc-foot__sub">{pos}{number ? ` · #${number}` : ""}</span>
          </span>
        </div>
        <div class="card__shine"></div>
        <div class="card__glare"></div>
      </div>
    </button>
  </div>
</div>

<style>
  /* The card face — full-bleed team gradient, a navy card-stock frame, a giant
     faint jersey number, the name eyebrow up top and the credit line at the
     foot. Simey's .card__shine / .card__glare composite the foil over all of
     this. Nested face content is freed from the engine's layer rule by the
     `.card__front > *` tweak in cards/base.css. */

  .cc-art {
    position: relative;
    container-type: inline-size;
    overflow: hidden;
    background:
      linear-gradient(135deg, var(--g1) 0%, var(--g2) 52%, var(--g3) 100%);
    box-shadow:
      inset 0 0 0 7px var(--stock),
      inset 0 0 0 8px rgba(255, 255, 255, 0.14);
    color: #fff;
    font-family: "Roboto Condensed", "Roboto", system-ui, sans-serif;
  }

  /* the children below are nested inside .cc-art, so the engine's layer rule
     does not touch them; we position them freely. */
  .cc-eyebrow {
    position: absolute;
    top: 6.5%;
    left: 8%;
    font-weight: 700;
    font-size: 3.1cqw;
    letter-spacing: 0.22em;
    color: rgba(255, 255, 255, 0.62);
  }

  .cc-num {
    position: absolute;
    top: 1%;
    right: 7%;
    font-style: italic;
    font-weight: 700;
    font-size: 33cqw;
    line-height: 1;
    color: rgba(255, 255, 255, 0.16);
    letter-spacing: -0.04em;
  }

  .cc-foot {
    position: absolute;
    left: 8%;
    right: 8%;
    bottom: 7%;
    display: flex;
    flex-direction: column;
    gap: 0.15em;
  }

  .cc-foot__name {
    font-weight: 700;
    font-size: 6.6cqw;
    line-height: 1.02;
    letter-spacing: -0.01em;
  }

  .cc-foot__sub {
    font-weight: 300;
    font-size: 3.3cqw;
    letter-spacing: 0.04em;
    color: rgba(255, 255, 255, 0.82);
  }

  /* card back */
  .cc-back {
    container-type: inline-size;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.05em;
    background:
      radial-gradient(120% 100% at 50% 0%, #1b2356 0%, #0a0e26 70%);
    color: rgba(255, 255, 255, 0.9);
    font-family: "Roboto Condensed", sans-serif;
    box-shadow: inset 0 0 0 7px #12173e;
  }
  .cc-back__word {
    font-weight: 700;
    font-style: italic;
    font-size: 13cqw;
    line-height: 0.92;
    letter-spacing: 0.02em;
  }
</style>
