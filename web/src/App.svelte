<script lang="ts">
  import MatchText from "$components/MatchText.svelte";
  import MemoryCard from "$components/MemoryCard.svelte";
  import Sweeper from "$components/Sweeper.svelte";
  import { debugData } from "$utils/debugData";

  import { isEnvBrowser } from "$utils/misc";

  let minigameList = ["mine-sweep", "memory", "terminal"];
  function MinigameStart(type: "mine-sweep" | "memory" | "terminal" | string) {
    if (type == "memory") {
      debugData(
        [
          {
            action: "open-memory-game",
            data: {
              value: true,
            },
          },
        ],
        100
      );
    } else if (type == "mine-sweep") {
      debugData(
        [
          {
            action: "open-minesweep",
            data: {
              value: true,
              money: 5000,
              bomb: 10,
              failbomb: 3,
              position: "center",
            },
          },
        ],
        100
      );
    } else if (type == "terminal") {
      debugData([
        {
          action: "open-terminal",
          data: {
            value: true,
          },
        },
      ]);
    }
  }
</script>

<div class="w-scren h-screen" class:bg-slate-950={isEnvBrowser()}>
  {#if isEnvBrowser()}
    <div class="flex gap-5">
      {#each minigameList as minigame}
        <button
          class="bg-blue-500 p-5"
          on:click={() => {
            MinigameStart(minigame);
          }}
        >
          {minigame}
        </button>
      {/each}
    </div>
  {/if}
  <MatchText />
  <Sweeper />
  <MemoryCard />
</div>
