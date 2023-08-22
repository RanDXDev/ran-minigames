import { writable } from "svelte/store";

type Dat = {
  id: string;
  isbomb: boolean;
  money?: number;
  clicked?: boolean;
  forceshow: boolean;
};

type SweepData = {
  value: boolean;
  money: number;
  failbomb: number;
  bomb: number;
  position: "left" | "center" | "right";
};
export const sweepData = writable<SweepData>({
  value: false,
  bomb: 12,
  failbomb: 3,
  money: 100,
  position: "center",
});
export const sweepStore = writable<Dat[]>([]);
