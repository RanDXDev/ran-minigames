<script lang="ts">
  import { TerminalSetting } from "$store/matchTerminal";
  import { debugData } from "$utils/debugData";
  import { useNuiEvent } from "$utils/useNuiEvent";
  import randomname from "$utils/randomGeek.json";
  import { onDestroy, onMount } from "svelte";
  import { fetchNui } from "$utils/fetchNui";
  import { isEnvBrowser } from "$utils/misc";

  /**
   * TODO: WILL REWRITE IT SOON SO MESSY A
   */

  let Terminal: DataObject[] = [];

  function generateRandomGeekName(): string {
    const randomIndex: number = Math.floor(Math.random() * randomname.length);
    return randomname[randomIndex];
  }

  function generateRandomHTMLContent(): string {
    const tags: string[] = ["<p>", "<h1>", "<h2>", "<div>", "<span>"];
    const geekNames: string[] = [
      "BE",
      "XET",
      "RED",
      "ALGO",
      "SYN",
      "CLI",
      "OS",
      "VCS",
      "IDE",
      "ART",
      "HACK",
      "EGG",
      "KER",
      "VR",
      "AR",
      "BTC",
      "FIRE",
      "ENC",
      "RAM",
      "OC",
      "404",
      "LIN",
      "GUI",
      "MB",
      "NERD",
    ];
    let content: string = "";

    for (let i = 0; i < 13; i++) {
      const randomIndex: number = Math.floor(Math.random() * tags.length);
      const randomTag: string = tags[randomIndex];

      let randomTagContent: string = "";
      for (let j = 0; j < 3; j++) {
        const randomGeekIndex: number = Math.floor(
          Math.random() * geekNames.length
        );
        randomTagContent += geekNames[randomGeekIndex] + ", ";
      }

      content += `${randomTag}${randomTagContent}</p>`;
    }

    return content;
  }

  interface DataObject {
    title: string[];
    content: string;
    needed?: { id: number };
    solved?: boolean;
  }

  function generateData(): DataObject[] {
    const data: DataObject[] = [];

    for (let i = 0; i < 60; i++) {
      const title: string[] = [
        generateRandomGeekName(),
        generateRandomGeekName(),
      ];
      const content: string = generateRandomHTMLContent();
      const id: number = i + 1;

      const obj: DataObject = {
        title,
        content,
        needed: { id: -1 },
      };

      if (id <= 3) {
        obj.needed = { id };
        obj.solved = false;
      }

      data.push(obj);
    }

    return data;
  }

  function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  let data1: DataObject[] = [];
  let selected1 = 0;
  let solved1 = false;
  let data2: DataObject[] = [];
  let selected2 = 0;
  let solved2 = false;
  let data3: DataObject[] = [];
  let selected3 = 0;
  let solved3 = false;
  let allsolved = false;
  let dataNeed: DataObject;

  function GetData(id: number): DataObject[] {
    const leData = Terminal;
    const leShuffled = shuffleArray(leData);
    const leObj = leShuffled.find((x) => x.needed.id == id && !x.solved);
    const leFinale = [
      ...leShuffled.filter((x) => x.needed.id !== id).slice(0, 19),
      leObj,
    ];
    return shuffleArray(leFinale);
  }

  function SolvedAll() {
    return solved1 && solved2 && solved3;
  }

  function GetNeeded() {
    return Terminal.find((x) => x.needed.id !== -1 && !x.solved);
  }

  function Up() {
    if (selected == 1 && selected1 + 1 < data1.length && !solved1) {
      selected1 = selected1 + 1;
    } else if (selected == 2 && selected2 + 1 < data2.length && !solved2) {
      selected2 = selected2 + 1;
    } else if (selected == 3 && selected3 + 1 < data3.length && !solved3) {
      selected3 = selected3 + 1;
    }
  }

  function Down() {
    if (selected == 1 && selected1 - 1 >= 0 && !solved1) {
      selected1 = selected1 - 1;
    } else if (selected == 2 && selected2 - 1 >= 0 && !solved2) {
      selected2 = selected2 - 1;
    } else if (selected == 3 && selected3 - 1 >= 0 && !solved3) {
      selected3 = selected3 - 1;
    }
  }

  function ResetData() {
    TerminalSetting.set({ value: false });
    Terminal = [];
    data1 = [];
    data2 = [];
    data3 = [];
    selected1 = 0;
    selected2 = 0;
    selected3 = 0;
    allsolved = false;
    solved1 = false;
    solved2 = false;
    solved3 = false;
  }

  function SetSolved(id) {
    Terminal.find((x) => x.needed.id == id).solved = true;

    if (SolvedAll()) {
      allsolved = true;
      fetchNui("terminal-done").then(ResetData);
    } else {
      dataNeed = GetNeeded();
    }
  }

  function CheckMatch() {
    if (selected == 1) {
      const dat = data1[selected1];
      if (dataNeed.needed.id == dat.needed.id) {
        solved1 = true;
        SetSolved(1);
      }
    } else if (selected == 2) {
      const dat = data2[selected2];
      if (dataNeed.needed.id == dat.needed.id) {
        solved2 = true;
        SetSolved(2);
      }
    } else if (selected == 3) {
      const dat = data3[selected3];
      if (dataNeed.needed.id == dat.needed.id) {
        solved3 = true;
        SetSolved(3);
      }
    }
  }

  let selected = 1;
  function KeyPress(event: KeyboardEvent) {
    if (!$TerminalSetting.value) return;
    event.preventDefault();
    switch (event.key) {
      case "ArrowLeft":
        if (selected - 1 !== 0) {
          selected = selected - 1;
        }
        break;
      case "ArrowRight":
        if (selected + 1 !== 4) {
          selected = selected + 1;
        }
        break;
      case "a":
        if (selected - 1 !== 0) {
          selected = selected - 1;
        }
        break;
      case "d":
        if (selected + 1 !== 4) {
          selected = selected + 1;
        }
        break;
      case "s":
        Up();
        break;
      case "w":
        Down();
        break;
      case "ArrowUp":
        Down();
        break;
      case "ArrowDown":
        Up();
        break;
      case "Enter":
        CheckMatch();
        break;
      case "Space":
        CheckMatch();
        break;
      case "Escape":
        fetchNui("exit-terminal")
          .then(ResetData)
          .catch(() => {
            if (!isEnvBrowser()) return;
            ResetData();
          });
        break;
    }
  }

  function OpenTerminal(data) {
    TerminalSetting.set({ value: data.value });
    if (data.value) {
      Terminal = generateData();
      data1 = GetData(1);
      data2 = GetData(2);
      data3 = GetData(3);
      dataNeed = GetNeeded();
    }
  }

  useNuiEvent("open-terminal", OpenTerminal);

  onMount(() => {
    window.addEventListener("keydown", KeyPress);
  });
  onDestroy(() => {
    window.removeEventListener("keydown", KeyPress);
  });
</script>

<!-- <p class="text-xl text-white">
  {dataNeed?.needed?.id}
</p> -->
{#if $TerminalSetting.value}
  <div class="match">
    <div
      class="top border-b-2 text-blue-50 border-b-blue-50 pb-2 flex items-center"
    >
      <h1 class="font-semibold text-xl">Security Terminal</h1>
    </div>

    <div class="flex justify-between mt-5">
      {#if Terminal.length}
        <div class="box" class:selected={selected == 1} class:solved={solved1}>
          {#if solved1}
            <h1
              class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold"
            >
              <i class="fa-solid fa-check" />
            </h1>
          {:else if data1.length}
            <div class="px-2 mb-7">
              <h1 class="text-blue-50 font-semibold text-xl">
                {data1[selected1].title[0]}
              </h1>
              <div class="mt-2 ml-5 text-lg text-justify">
                {@html data1[selected1].content}
              </div>
            </div>
          {/if}
        </div>
        <div class="box" class:selected={selected == 2} class:solved={solved2}>
          {#if solved2}
            <h1
              class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold"
            >
              <i class="fa-solid fa-check" />
            </h1>
          {:else if data2.length}
            <div class="px-2 mb-7">
              <h1 class="text-blue-50 font-semibold text-xl">
                {data2[selected2].title[0]}
              </h1>
              <div class="mt-2 ml-5 text-lg text-justify">
                {@html data2[selected2].content}
              </div>
            </div>
          {/if}
        </div>
        <div class="box" class:selected={selected == 3} class:solved={solved3}>
          {#if solved3}
            <h1
              class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold"
            >
              <i class="fa-solid fa-check" />
            </h1>
          {:else if data3.length}
            <div class="px-2 mb-7">
              <h1 class="text-blue-50 font-semibold text-xl">
                {data3[selected3].title[0]}
              </h1>
              <div class="mt-2 ml-5 text-lg text-justify">
                {@html data3[selected3].content}
              </div>
            </div>
          {/if}
        </div>
        <div class="box" class:solved={allsolved}>
          {#if allsolved}
            <h1
              class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold"
            >
              <i class="fa-solid fa-check" />
            </h1>
          {:else}
            <div class="px-2">
              <h1 class="text-blue-50 font-semibold text-xl">
                {dataNeed.title[0]}
              </h1>
              <div class="mt-2 ml-5 text-lg text-justify">
                {@html dataNeed.content}
              </div>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>
{/if}

<style lang="postcss">
  .box.solved {
    @apply border-green-500 !text-green-500;
  }
  .box.selected {
    @apply border border-double;
  }
  .box {
    @apply w-[14em] h-[25.4rem] overflow-hidden  pb-6 relative;
  }
  .box::-webkit-scrollbar {
    display: none;
  }
  .match {
    @apply text-white p-2 overflow-hidden font-source-code;
    @apply rounded-sm bg-slate-900;
    @apply w-[50vw] h-[50vh] border  absolute left-1/2 top-1/2  transform -translate-x-1/2 -translate-y-1/2;
  }
</style>
