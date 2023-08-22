import { writable } from "svelte/store";

interface DataObject {
  title: string[];
  content: string;
  needed?: { id: number };
  solved?: boolean;
}

export const TerminalData = writable<DataObject[]>([]);

export const TerminalSetting = writable({
  value: false,
});
