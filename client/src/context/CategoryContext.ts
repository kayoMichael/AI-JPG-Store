import { create } from 'zustand';

interface CategoryState {
  categoryRef: HTMLElement | null;
  setCategoryRef: (ref: HTMLElement | null) => void;
}

const useCategory = create<CategoryState>((set) => ({
  categoryRef: null,
  setCategoryRef: (ref) => set({ categoryRef: ref }),
}));

export default useCategory;
