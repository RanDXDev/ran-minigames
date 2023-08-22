import { writable } from "svelte/store";

type MemoryData = {
  value: boolean;
  timer?: number;
};

interface Card {
  id: number;
  icon: string;
  isMatched: boolean;
  isFlipped: boolean;
}

export const MemoryData = writable<MemoryData>({
  value: false,
});

export const MemoryCard = writable<Card[]>([]);


export const Initializing = writable(true)