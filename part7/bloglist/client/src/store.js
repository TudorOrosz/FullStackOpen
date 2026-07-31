import { create } from "zustand";

export const useMessages = create((set) => ({
  text: "",
  type: "",
  setMessage: ({ text, type }) => set({ text, type }),
  clearMessage: () => set({ text: "", type: "" }),
}));

export const useBlogs = create((set) => ({
  blogs: [],
  setBlogs: (blogs) => set({ blogs }),
  addBlogInStore: (blog) => set((state) => ({ blogs: [...state.blogs, blog] })),
  updateBlogInStore: (updatedBlog) =>
    set((state) => ({
      blogs: state.blogs.map((blog) =>
        blog.id !== updatedBlog.id ? blog : updatedBlog,
      ),
    })),
  removeBlogFromStore: (id) =>
    set((state) => ({
      blogs: state.blogs.filter((blog) => blog.id !== id),
    })),
}));

export const useLogin = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}))

export const useUsers = create((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
}))
