<script lang="ts">
  import { Initializing, MemoryCard } from "$store/memorycard";
  import { fetchNui } from "$utils/fetchNui";
  import { delay, isEnvBrowser } from "$utils/misc";
  import { useNuiEvent } from "$utils/useNuiEvent";
  import { onDestroy, onMount } from "svelte";
  import { flip } from "svelte/animate";
  import { backOut, sineOut } from "svelte/easing";
  import { fade, fly, scale } from "svelte/transition";

  interface Card {
    id: number;
    icon: string;
    isMatched: boolean;
    isFlipped: boolean;
  }

  let data = {
    value: false,
    timer: undefined,
  };

  useNuiEvent("open-memory-game", initMemoryGame);

  let firstselected;
  let secondselected;

  function generateMemoryCardData(iconNames: string[]): Card[] {
    const totalCards = iconNames.length * 2;
    const shuffledIcons = shuffleArray(iconNames);
    const cardData: Card[] = [];

    for (let id = 1; id <= totalCards; id++) {
      const iconIndex = Math.floor((id - 1) / 2); // Each icon appears twice
      const icon = shuffledIcons[iconIndex];

      cardData.push({
        id,
        icon,
        isMatched: false,
        isFlipped: true,
      });
    }

    return cardData;
  }

  function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  const iconNames = [
    "fa-solid fa-sack-dollar",
    "fa-solid fa-virus",
    "fa-solid fa-envelope",
    "fa-solid fa-hat-cowboy",
    "fa-solid fa-box",
    "fa-solid fa-shield-halved",
    "fa-solid fa-camera",
    "fa-solid fa-folder",
    "fa-solid fa-wifi",
    "fa-solid fa-bath",
    "fa-solid fa-gamepad",
    "fa-brands fa-github",
    "fa-solid fa-ghost",
    "fa-solid fa-lemon",
    "fa-solid fa-fingerprint",
    "fa-solid fa-wave-square",
  ];
  MemoryCard.set(generateMemoryCardData(iconNames));

  let allmatch = false;

  function HideAll() {
    MemoryCard.update((x) => {
      x.forEach((y) => {
        y.isFlipped = false;
      });
      return x;
    });

    Initializing.set(false);
  }

  async function IsMatched() {
    if (!firstselected || !secondselected) return;

    const firstDat = findCardDataById(firstselected);
    const secondDat = findCardDataById(secondselected);
    const match = firstDat.icon === secondDat.icon;

    updateCardData(firstselected, match);
    updateCardData(secondselected, match);

    if (!match) {
      await delay(700);
      resetCardData([firstselected, secondselected]);
    }

    resetSelectedCards();
  }

  function findCardDataById(id) {
    return $MemoryCard.find((x) => x.id === id);
  }

  function updateCardData(id, isMatched) {
    const card = findCardDataById(id);
    if (card) {
      card.isMatched = isMatched;
      if (!isMatched) {
        setTimeout(() => {
          card.isFlipped = false;
        }, 700);
      }
    }
  }

  function resetCardData(ids) {
    MemoryCard.update((x) => {
      x.forEach((y) => {
        if (ids.includes(y.id)) {
          y.isFlipped = false;
        }
      });
      return x;
    });
  }

  function resetMinigame() {
    data.value = false;
    data.timer = undefined;
    allmatch = false;
    MemoryCard.set([]);
  }

  function resetSelectedCards() {
    firstselected = undefined;
    secondselected = undefined;
  }

  function CheckAllMatch() {
    const l = $MemoryCard?.length;
    if (!l) return;
    let d = 0;
    $MemoryCard.forEach((x) => {
      if (x.isMatched) {
        d += 1;
      }
    });
    if (l <= d) {
      allmatch = true;
      fetchNui("memory-game", true)
        .then(resetMinigame)
        .catch(() => {
          if (isEnvBrowser()) resetMinigame();
        });
    }
  }

  function initMemoryGame(d) {
    Initializing.set(true);
    data = d;
    MemoryCard.set(generateMemoryCardData(iconNames));
    setTimeout(() => {
      MemoryCard.update((x) => {
        return shuffleArray(x);
      });
      setTimeout(HideAll, 3000);
    }, 5000);
  }

  function KeyPress(event: KeyboardEvent) {
    if (!data.value) return;
    if (event.key == "Escape") {
      fetchNui("memory-exit", false)
        .then(resetMinigame)
        .catch(() => {
          if (!isEnvBrowser()) return;
          resetMinigame();
        });
    }
  }
  onMount(() => {
    window.addEventListener("keydown", KeyPress);
  });
  onDestroy(() => {
    window.removeEventListener("keydown", KeyPress);
  });
  $: [firstselected, secondselected], IsMatched();
  $: $MemoryCard, CheckAllMatch();
</script>

{#if data.value}
  <div class="memory-card" in:fly={{ y: 100 }} out:fade={{ duration: 100 }}>
    {#if $Initializing}
      <div
        transition:fade
        class="absolute z-10 left-0 top-0 w-full h-full bg-black/30 cursor-progress grid place-items-center"
      >
        <div class="w-12 h-12 grid place-items-center animate-spin">
          <i class="fa-solid fa-circle-notch fa-2xl" />
        </div>
      </div>
    {/if}
    <div class="text-center">
      <h1 class="text-2xl font-bold">Memory Game</h1>
      <div class="game-wrapper grid grid-cols-8 mt-5">
        {#each $MemoryCard as { icon, id, isFlipped, isMatched } (id)}
          <div animate:flip={{ duration: 600, easing: sineOut }}>
            <button
              class="card"
              type="button"
              class:disabled={allmatch || $Initializing}
              disabled={allmatch || $Initializing}
              on:click={() => {
                if (isMatched) return;
                if (firstselected && firstselected == id) {
                  isFlipped = false;
                  firstselected = undefined;
                } else if (!firstselected) {
                  firstselected = id;
                  isFlipped = !isFlipped;
                } else if (!secondselected) {
                  secondselected = id;
                  isFlipped = !isFlipped;
                }
              }}
            >
              {#if isFlipped || isMatched}
                <i class="{icon} text-4xl" in:fade={{ duration: 100 }} />
              {:else}
                <p class="text-4xl font-semibold" in:fade={{ duration: 100 }}>
                  ?
                </p>
              {/if}
            </button>
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if}

<style lang="postcss">
  .card {
    @apply w-36 h-44 bg-slate-700 border border-slate-600;
  }
  .card.disabled {
    @apply cursor-progress;
  }
  .game-wrapper {
    @apply w-full h-max bg-slate-600;
  }
  .memory-card {
    @apply text-white overflow-hidden;
    @apply w-max max-w-7xl h-[80vh] bg-slate-800 rounded;
    @apply fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2;
    @apply shadow-md shadow-blue-300/50 p-3;
  }
</style>
