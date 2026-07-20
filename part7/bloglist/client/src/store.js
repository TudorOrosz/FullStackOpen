import { create } from "zustand";

export const useMessages = create((set) => ({
  text: "",
  type: "",
  setMessage: ({ text, type }) => set({ text, type }),
  clearMessage: () => set({ text: "", type: "" }),
}));

// export const useBlogs = create((set) => ({
//   blogs: {},

// }));
