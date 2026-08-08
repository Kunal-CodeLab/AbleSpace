import { create } from 'zustand';
import { Task, TaskPriority, TaskStatus, ViewMode, ThemeMode, ColorMode, Project, UserProfile } from './types';

interface AppState {
  // Auth state
  isLoggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;

  // Mobile Drawer & Sidebar State
  isMobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;

  // Theme & Color State
  theme: ThemeMode;
  colorMode: ColorMode;
  setTheme: (theme: ThemeMode) => void;
  setColorMode: (colorMode: ColorMode) => void;

  // Navigation & View Mode State
  viewMode: ViewMode;
  setViewMode: (viewMode: ViewMode) => void;

  // Search & Filter State
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedPriority: string;
  setSelectedPriority: (priority: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;

  // Field Visibilities
  visibleFields: {
    priority: boolean;
    members: boolean;
    dueDate: boolean;
    labels: boolean;
    status: boolean;
    reporter: boolean;
  };
  toggleField: (field: keyof AppState['visibleFields']) => void;

  // Tasks State
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  // Active Task Detail Modal State
  activeTaskId: string | null;
  setActiveTaskId: (id: string | null) => void;

  // Create Task Modal State
  isCreateModalOpen: boolean;
  setCreateModalOpen: (open: boolean) => void;

  // Projects State
  projects: Project[];
  setProjects: (projects: Project[]) => void;

  // Profile State
  profile: UserProfile;
  setProfile: (profile: Partial<UserProfile>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isLoggedIn: false,
  setLoggedIn: (isLoggedIn) => set({ isLoggedIn }),

  isMobileSidebarOpen: false,
  setMobileSidebarOpen: (isMobileSidebarOpen) => set({ isMobileSidebarOpen }),

  isSidebarCollapsed: false,
  setSidebarCollapsed: (isSidebarCollapsed) => set({ isSidebarCollapsed }),
  toggleSidebar: () => set((state) => ({
    isSidebarCollapsed: !state.isSidebarCollapsed,
    isMobileSidebarOpen: !state.isMobileSidebarOpen,
  })),

  theme: 'light',
  colorMode: 'blue',
  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pyramid_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    set({ theme });
  },
  setColorMode: (colorMode) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pyramid_colormode', colorMode);
    }
    set({ colorMode });
  },

  viewMode: 'Board',
  setViewMode: (viewMode) => set({ viewMode }),

  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  selectedPriority: 'All',
  setSelectedPriority: (selectedPriority) => set({ selectedPriority }),
  selectedStatus: 'All',
  setSelectedStatus: (selectedStatus) => set({ selectedStatus }),

  visibleFields: {
    priority: true,
    members: true,
    dueDate: true,
    labels: false,
    status: false,
    reporter: false,
  },
  toggleField: (field) =>
    set((state) => ({
      visibleFields: {
        ...state.visibleFields,
        [field]: !state.visibleFields[field],
      },
    })),

  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),

  activeTaskId: null,
  setActiveTaskId: (activeTaskId) => set({ activeTaskId }),

  isCreateModalOpen: false,
  setCreateModalOpen: (isCreateModalOpen) => set({ isCreateModalOpen }),

  projects: [],
  setProjects: (projects) => set({ projects }),

  profile: {
    email: 'dexter@gmail.com',
    fullName: 'Dexter',
    title: 'Designer',
    username: 'Dexuser',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    role: 'Admin',
    theme: 'light',
    colorMode: 'blue',
  },
  setProfile: (updates) =>
    set((state) => ({
      profile: { ...state.profile, ...updates },
    })),
}));
