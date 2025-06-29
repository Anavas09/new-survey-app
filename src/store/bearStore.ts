import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

type BearState = {
  bears: number;
};

type BearAction = {
  updateBears: (bears: BearState["bears"]) => void;
  decreaseBears: (bears: BearState["bears"]) => void;
};

const useBearStore = create<BearState & BearAction>()(
  devtools(
    persist(
      (set, get) => ({
        bears: 0,
        updateBears: (by) => set((state) => ({ bears: state.bears + by })),
        decreaseBears: (by) => set((state) => ({ bears: state.bears - by })),
      }),
      { name: "bearStore", storage: createJSONStorage(() => localStorage) }
    )
  )
);

export { useBearStore };
