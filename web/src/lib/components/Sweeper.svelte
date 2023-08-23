<script lang="ts">
  import { sweepData, sweepStore } from "$store/sweeper";

  import { fetchNui } from "$utils/fetchNui";
  import { isEnvBrowser } from "$utils/misc";
  import { useNuiEvent } from "$utils/useNuiEvent";
  import { onDestroy, onMount } from "svelte";

  import { backOut } from "svelte/easing";
  import { fade, scale } from "svelte/transition";

  let bomb = 0;

  let moneyGet = 0;

  function GetMaxMoneyPerItem() {
    return Math.floor($sweepData.money / (36 - $sweepData.bomb));
  }

  function RandomID() {
    return crypto.randomUUID();
  }

  function GenerateSweep() {
    // Generate bomb items
    for (let i = 0; i < $sweepData.bomb; i++) {
      $sweepStore.push({
        id: RandomID(),
        isbomb: true,
        clicked: false,
        forceshow: false,
      });
    }

    // Generate non-bomb items with money
    for (let i = 0; i < 36 - $sweepData.bomb; i++) {
      const remainingMoney =
        $sweepData.money -
        $sweepStore.reduce((sum, item) => sum + (item.money || 0), 0);
      const money =
        i === 35 - $sweepData.bomb
          ? remainingMoney
          : Math.min(GetMaxMoneyPerItem(), remainingMoney);

      $sweepStore.push({
        id: RandomID(),
        isbomb: false,
        money: money,
        clicked: false,
        forceshow: false,
      });
    }

    // Shuffle the array
    sweepStore.update((x) => {
      return shuffleArray(x);
    });
  }

  // Function to shuffle an array using Fisher-Yates algorithm
  function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function showAll() {
    sweepStore.update((x) => {
      x.forEach((y) => {
        y.forceshow = true;
        y.clicked = true;
      });
      return x;
    });
  }
  // Check bomb
  function checkBomb() {
    if (bomb >= $sweepData.failbomb) {
      showAll();
      setTimeout(SendData, 1000);
    }
  }

  function initData(ndata) {
    sweepStore.set([]);
    const newData = {
      value: true,
      money: 3000,
      failbomb: 3,
      bomb: 12,
      position: "left",
      ...ndata,
    };

    if (ndata.hasOwnProperty("value")) {
      newData.value = ndata.value;
    }

    if (ndata.hasOwnProperty("money")) {
      newData.money = ndata.money || newData.money;
    }

    if (ndata.hasOwnProperty("failbomb")) {
      newData.failbomb = ndata.failbomb || newData.failbomb;
    }

    if (ndata.hasOwnProperty("bomb")) {
      newData.bomb = ndata.bomb || newData.bomb;
    }

    if (ndata.hasOwnProperty("position")) {
      newData.position = ndata.position || newData.position;
    }
    sweepData.set(newData);
    GenerateSweep();
  }
  useNuiEvent("open-minesweep", initData);

  function reset() {
    sweepStore.set([]);
    sweepData.set({
      value: false,
      money: 0,
      bomb: 0,
      failbomb: 0,
      position: "center",
    });
    bomb = 0;
    moneyGet = 0;
  }
  function SendData() {
    fetchNui("minesweep-cashout", moneyGet)
      .then(reset)
      .catch(() => {
        if (!isEnvBrowser()) return;
        reset();
      });
  }

  $: bomb, checkBomb();

  function KeyPressed(event: KeyboardEvent) {
    if (!$sweepData.value) return;
    if (event.key === "Escape") {
      fetchNui("exit").then(reset);
    }
  }
  onMount(() => {
    window.addEventListener("keydown", KeyPressed);
  });
  onDestroy(() => {
    window.removeEventListener("keydown", KeyPressed);
  });
</script>

{#if $sweepData.value}
  <div
    in:scale={{ easing: backOut }}
    out:fade={{ duration: 100 }}
    class:pos-left={$sweepData.position == "left"}
    class:pos-right={$sweepData.position == "right"}
    class:pos-center={$sweepData.position == "center"}
    class="w-80 text-white h-[43vh] bg-slate-800 px-2 py-5 rounded fixed top-1/2 transform -translate-y-1/2 shadow-md shadow-blue-300/50"
  >
    <div class="flex flex-col text-center">
      <h1 class="font-bold text-xl">You get</h1>
      <p class="font-semibold text-lg text-green-300">{moneyGet}</p>
    </div>
    <div class="flex justify-center mt-5">
      <div class="kotak-kotak">
        {#each $sweepStore as { isbomb, money, clicked, forceshow, id } (id)}
          <button
            type="button"
            class="kotak"
            class:error={isbomb && clicked}
            class:ismoney={clicked && money}
            class:force-show={forceshow}
            class:disabled={bomb >= $sweepData.failbomb}
            on:click={() => {
              if (clicked) return;
              if (bomb >= $sweepData.failbomb) return;
              clicked = true;
              if (money) {
                moneyGet += money;
              } else if (isbomb) {
                bomb += 1;
                moneyGet -= Math.round((moneyGet * 30) / 100);
              }
            }}
          >
            {#if clicked}
              <span transition:scale={{ duration: 150, easing: backOut }}>
                {#if isbomb}
                  <i class="fa-solid fa-bomb text-red-300" />
                {:else if money}
                  <i class="fa-solid fa-sack-dollar text-green-100" />
                {/if}
              </span>
            {/if}
          </button>
        {/each}
      </div>
    </div>
    <div class="text-center px-5 mt-4">
      <button
        class="bg-green-500 font-semibold p-1 w-full rounded"
        class:disabled={bomb >= $sweepData.failbomb}
        disabled={bomb >= $sweepData.failbomb}
        on:click={SendData}
      >
        Cash Out
      </button>
    </div>
  </div>
{/if}

<style lang="postcss">
  .pos-left {
    @apply left-5;
  }
  .pos-center {
    @apply left-1/2 -translate-x-1/2;
  }
  .pos-right {
    @apply right-5;
  }
  button.disabled {
    @apply bg-green-700 cursor-not-allowed;
  }
  .kotak.ismoney.force-show {
    @apply bg-green-400/50;
    @apply text-green-300/50;
  }
  .kotak.error.force-show {
    @apply bg-red-900/50;
    @apply text-red-300/50;
  }
  .kotak.ismoney {
    @apply bg-green-500;
  }
  .kotak.error {
    @apply bg-red-900;
  }
  .kotak.disabled {
    @apply cursor-not-allowed;
  }
  .kotak {
    @apply transition-all ease-in-out duration-75;
    @apply w-11 h-11 bg-slate-700 border border-slate-600;
  }
  .kotak-kotak {
    @apply grid gap-0 grid-cols-6  border border-slate-500;
    @apply bg-slate-900 w-[16.5rem] h-[16.5rem] rounded-sm overflow-hidden;
  }
</style>
