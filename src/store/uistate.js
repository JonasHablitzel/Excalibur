import create from "zustand";
import { devtools } from "zustand/middleware";

const useUiState = create(
  devtools((set, get) => ({
    tabIndex: "1",
    setTabIndex: (newidx) => set({ tabIndex: newidx }),
  }))
);

export default useUiState;
