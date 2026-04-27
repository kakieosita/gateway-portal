import { create } from "zustand";
import { 
  LibraryResource, 
  ReadingList, 
  mockResources, 
  mockReadingLists 
} from "@/lib/library-data";

interface LibraryState {
  resources: LibraryResource[];
  readingLists: ReadingList[];
  bookmarks: string[]; // Resource IDs
  
  // Actions
  toggleBookmark: (id: string) => void;
  addResource: (resource: LibraryResource) => void;
  removeResource: (id: string) => void;
  updateResource: (id: string, updates: Partial<LibraryResource>) => void;
}

export const useLibraryStore = create<LibraryState>((set) => ({
  resources: mockResources,
  readingLists: mockReadingLists,
  bookmarks: [],

  toggleBookmark: (id) => set((state) => ({
    bookmarks: state.bookmarks.includes(id)
      ? state.bookmarks.filter(bid => bid !== id)
      : [...state.bookmarks, id]
  })),

  addResource: (resource) => set((state) => ({
    resources: [resource, ...state.resources]
  })),

  removeResource: (id) => set((state) => ({
    resources: state.resources.filter(r => r.id !== id)
  })),

  updateResource: (id, updates) => set((state) => ({
    resources: state.resources.map(r => r.id === id ? { ...r, ...updates } : r)
  })),
}));
