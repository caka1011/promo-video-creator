import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type {
  Project,
  Scene,
  SceneElement,
  DeviceFrameElement,
  Animation,
  ProjectSettings,
  ScreenshotSettings,
  RESOLUTION_PRESETS,
} from '@/types/editor';
import { LAYOUT_PRESETS } from '@/lib/layout-presets';
import { getOutputSizeById } from '@/lib/output-sizes';
import * as storage from '@/lib/storage';

const DEFAULT_ANIMATION: Animation = {
  type: 'none',
  duration: 30,
  delay: 0,
  easing: 'ease-out',
};

function createDefaultScene(): Scene {
  return {
    id: uuidv4(),
    name: 'Scene 1',
    elements: [],
    duration: 90, // 3 seconds at 30fps
    background: '#0f0f1a',
    transition: 'none',
  };
}

interface HistoryEntry {
  scenes: Scene[];
  activeSceneId: string | null;
}

interface EditorState {
  // Project
  project: Project | null;
  projects: Project[];

  // Editor state
  activeSceneId: string | null;
  selectedElementId: string | null;

  // Canvas
  zoom: number;
  panX: number;
  panY: number;

  // Playback
  isPlaying: boolean;
  currentFrame: number;

  // History (undo/redo)
  history: HistoryEntry[];
  historyIndex: number;

  // Mode
  previewMode: boolean;

  // Project actions
  loadProject: (project: Project) => void;
  loadProjects: () => void;
  saveProject: () => void;
  createProject: (name: string, settings: ProjectSettings) => string;
  createScreenshotProject: (name: string, screenshotSettings: ScreenshotSettings) => string;
  deleteProject: (id: string) => void;

  // Scene actions
  addScene: () => void;
  removeScene: (id: string) => void;
  setActiveScene: (id: string) => void;
  updateScene: (id: string, updates: Partial<Scene>) => void;
  reorderScenes: (fromIndex: number, toIndex: number) => void;

  // Element actions
  addElement: (element: SceneElement) => void;
  updateElement: (id: string, updates: Partial<SceneElement>) => void;
  removeElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  reorderElements: (fromIndex: number, toIndex: number) => void;
  duplicateElement: (id: string) => void;

  // Layout actions
  applyLayoutPreset: (presetId: string) => void;

  // Audio actions
  setAudio: (src: string, fileName: string) => void;
  removeAudio: () => void;
  setAudioVolume: (volume: number) => void;

  // Canvas actions
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  resetView: () => void;

  // Playback actions
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setCurrentFrame: (frame: number) => void;

  // History actions
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;

  // Mode
  setPreviewMode: (preview: boolean) => void;

  // Helpers
  getActiveScene: () => Scene | null;
  getSelectedElement: () => SceneElement | null;
  getTotalFrames: () => number;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  project: null,
  projects: [],
  activeSceneId: null,
  selectedElementId: null,
  zoom: 0.5,
  panX: 0,
  panY: 0,
  isPlaying: false,
  currentFrame: 0,
  history: [],
  historyIndex: -1,
  previewMode: false,

  // Project actions
  loadProject: (project) => {
    const firstSceneId = project.scenes[0]?.id ?? null;
    set({
      project,
      activeSceneId: firstSceneId,
      selectedElementId: null,
      currentFrame: 0,
      isPlaying: false,
      zoom: 0.5,
      panX: 0,
      panY: 0,
      history: [{ scenes: structuredClone(project.scenes), activeSceneId: firstSceneId }],
      historyIndex: 0,
    });
  },

  loadProjects: () => {
    if (typeof window === 'undefined') return;
    storage.loadProjects().then((projects) => {
      set({ projects });
    }).catch(() => {
      set({ projects: [] });
    });
  },

  saveProject: () => {
    const { project, projects } = get();
    if (!project) return;
    const updated = { ...project, updatedAt: Date.now() };
    const idx = projects.findIndex((p) => p.id === project.id);
    const newProjects = [...projects];
    if (idx >= 0) {
      newProjects[idx] = updated;
    } else {
      newProjects.push(updated);
    }
    set({ project: updated, projects: newProjects });
    storage.saveProject(updated).catch(() => {});
  },

  createProject: (name, settings) => {
    const defaultScene = createDefaultScene();
    const project: Project = {
      id: uuidv4(),
      type: 'video',
      name,
      scenes: [defaultScene],
      settings,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const { projects } = get();
    const newProjects = [...projects, project];
    set({ projects: newProjects });
    storage.saveProject(project).catch(() => {});
    return project.id;
  },

  createScreenshotProject: (name, screenshotSettings) => {
    const firstSize = getOutputSizeById(screenshotSettings.outputSizes[0]);
    const resolution = firstSize
      ? { name: firstSize.name, width: firstSize.width, height: firstSize.height }
      : { name: 'iPhone 6.7"', width: 1290, height: 2796 };

    const defaultSlide: Scene = {
      id: uuidv4(),
      name: 'Screenshot 1',
      elements: [],
      duration: 90,
      background: '#0f0f1a',
      transition: 'none',
    };

    const project: Project = {
      id: uuidv4(),
      type: 'app-screens',
      name,
      scenes: [defaultSlide],
      settings: {
        platform: 'both',
        resolution,
        fps: 30,
      },
      screenshotSettings,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const { projects } = get();
    const newProjects = [...projects, project];
    set({ projects: newProjects });
    storage.saveProject(project).catch(() => {});
    return project.id;
  },

  deleteProject: (id) => {
    const { projects } = get();
    const newProjects = projects.filter((p) => p.id !== id);
    set({ projects: newProjects });
    storage.deleteProject(id).catch(() => {});
  },

  // Scene actions
  addScene: () => {
    const { project } = get();
    if (!project) return;
    get().pushHistory();
    const sceneCount = project.scenes.length;
    const newScene: Scene = {
      ...createDefaultScene(),
      name: `Scene ${sceneCount + 1}`,
    };
    const updatedProject = {
      ...project,
      scenes: [...project.scenes, newScene],
    };
    set({ project: updatedProject, activeSceneId: newScene.id });
    get().saveProject();
  },

  removeScene: (id) => {
    const { project, activeSceneId } = get();
    if (!project || project.scenes.length <= 1) return;
    get().pushHistory();
    const newScenes = project.scenes.filter((s) => s.id !== id);
    const newActiveId = activeSceneId === id ? newScenes[0].id : activeSceneId;
    set({
      project: { ...project, scenes: newScenes },
      activeSceneId: newActiveId,
      selectedElementId: null,
    });
    get().saveProject();
  },

  setActiveScene: (id) => {
    set({ activeSceneId: id, selectedElementId: null });
  },

  updateScene: (id, updates) => {
    const { project } = get();
    if (!project) return;
    const newScenes = project.scenes.map((s) =>
      s.id === id ? { ...s, ...updates } : s
    );
    set({ project: { ...project, scenes: newScenes } });
  },

  reorderScenes: (fromIndex, toIndex) => {
    const { project } = get();
    if (!project) return;
    get().pushHistory();
    const newScenes = [...project.scenes];
    const [moved] = newScenes.splice(fromIndex, 1);
    newScenes.splice(toIndex, 0, moved);
    set({ project: { ...project, scenes: newScenes } });
    get().saveProject();
  },

  // Element actions
  addElement: (element) => {
    const { project, activeSceneId } = get();
    if (!project || !activeSceneId) return;
    get().pushHistory();
    const newScenes = project.scenes.map((s) =>
      s.id === activeSceneId
        ? { ...s, elements: [...s.elements, element] }
        : s
    );
    set({
      project: { ...project, scenes: newScenes },
      selectedElementId: element.id,
    });
    get().saveProject();
  },

  updateElement: (id, updates) => {
    const { project, activeSceneId } = get();
    if (!project || !activeSceneId) return;
    const newScenes = project.scenes.map((s) =>
      s.id === activeSceneId
        ? {
            ...s,
            elements: s.elements.map((e) =>
              e.id === id ? ({ ...e, ...updates } as SceneElement) : e
            ),
          }
        : s
    );
    set({ project: { ...project, scenes: newScenes } });
  },

  removeElement: (id) => {
    const { project, activeSceneId, selectedElementId } = get();
    if (!project || !activeSceneId) return;
    get().pushHistory();
    const newScenes = project.scenes.map((s) =>
      s.id === activeSceneId
        ? { ...s, elements: s.elements.filter((e) => e.id !== id) }
        : s
    );
    set({
      project: { ...project, scenes: newScenes },
      selectedElementId: selectedElementId === id ? null : selectedElementId,
    });
    get().saveProject();
  },

  selectElement: (id) => set({ selectedElementId: id }),

  reorderElements: (fromIndex, toIndex) => {
    const { project, activeSceneId } = get();
    if (!project || !activeSceneId) return;
    get().pushHistory();
    const scene = project.scenes.find((s) => s.id === activeSceneId);
    if (!scene) return;
    const newElements = [...scene.elements];
    const [moved] = newElements.splice(fromIndex, 1);
    newElements.splice(toIndex, 0, moved);
    const newScenes = project.scenes.map((s) =>
      s.id === activeSceneId ? { ...s, elements: newElements } : s
    );
    set({ project: { ...project, scenes: newScenes } });
    get().saveProject();
  },

  duplicateElement: (id) => {
    const scene = get().getActiveScene();
    if (!scene) return;
    const element = scene.elements.find((e) => e.id === id);
    if (!element) return;
    const newElement = {
      ...structuredClone(element),
      id: uuidv4(),
      name: `${element.name} copy`,
      x: element.x + 20,
      y: element.y + 20,
    };
    get().addElement(newElement as SceneElement);
  },

  // Layout actions
  applyLayoutPreset: (presetId) => {
    const { project, activeSceneId } = get();
    if (!project || !activeSceneId) return;

    const preset = LAYOUT_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    get().pushHistory();

    const scene = project.scenes.find((s) => s.id === activeSceneId);
    if (!scene) return;

    const canvasW = project.settings.resolution.width;
    const canvasH = project.settings.resolution.height;

    // Find existing device frames
    const deviceElements = scene.elements.filter(
      (e): e is DeviceFrameElement => e.type === 'device-frame'
    );

    const elementsToUpdate = [...deviceElements];
    const newElements: SceneElement[] = [];

    // Create new device frames if needed
    while (elementsToUpdate.length < preset.deviceCount) {
      const newDevice: DeviceFrameElement = {
        id: uuidv4(),
        type: 'device-frame',
        name: `Device ${elementsToUpdate.length + 1}`,
        x: 0,
        y: 0,
        width: 320,
        height: 650,
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: false,
        deviceType: 'iphone-15-pro',
        color: '#1a1a2e',
        screenshotSrc: '',
        perspectiveX: 0,
        perspectiveY: 0,
        animation: { type: 'none', duration: 30, delay: 0, easing: 'ease-out' },
      };
      elementsToUpdate.push(newDevice);
      newElements.push(newDevice);
    }

    // Apply preset positions
    const updatedDeviceIds = new Set<string>();
    elementsToUpdate.slice(0, preset.deviceCount).forEach((device, i) => {
      const pos = preset.positions[i];
      const scaledWidth = 320 * pos.scale;
      const scaledHeight = 650 * pos.scale;
      device.x = (pos.xPercent / 100) * canvasW - scaledWidth / 2;
      device.y = (pos.yPercent / 100) * canvasH - scaledHeight / 2;
      device.width = scaledWidth;
      device.height = scaledHeight;
      device.rotation = pos.rotation;
      device.perspectiveX = pos.perspectiveX;
      device.perspectiveY = pos.perspectiveY;
      updatedDeviceIds.add(device.id);
    });

    // Build new elements array
    const newSceneElements = scene.elements.map((e) => {
      if (updatedDeviceIds.has(e.id)) {
        return elementsToUpdate.find((d) => d.id === e.id)!;
      }
      return e;
    });
    newSceneElements.push(...newElements);

    const newScenes = project.scenes.map((s) =>
      s.id === activeSceneId ? { ...s, elements: newSceneElements } : s
    );
    set({ project: { ...project, scenes: newScenes } });
    get().saveProject();
  },

  // Audio actions
  setAudio: (audioSrc, audioFileName) => {
    const { project } = get();
    if (!project) return;
    set({
      project: { ...project, audioSrc, audioFileName, audioVolume: project.audioVolume ?? 1 },
    });
    get().saveProject();
  },

  removeAudio: () => {
    const { project } = get();
    if (!project) return;
    set({
      project: {
        ...project,
        audioSrc: undefined,
        audioFileName: undefined,
        audioVolume: undefined,
      },
    });
    get().saveProject();
  },

  setAudioVolume: (audioVolume) => {
    const { project } = get();
    if (!project) return;
    set({ project: { ...project, audioVolume } });
  },

  // Canvas actions
  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(3, zoom)) }),
  setPan: (panX, panY) => set({ panX, panY }),
  resetView: () => set({ zoom: 0.5, panX: 0, panY: 0 }),

  // Playback actions
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  setCurrentFrame: (currentFrame) => set({ currentFrame }),

  // History actions
  pushHistory: () => {
    const { project, activeSceneId, history, historyIndex } = get();
    if (!project) return;
    const entry: HistoryEntry = {
      scenes: structuredClone(project.scenes),
      activeSceneId,
    };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(entry);
    // Keep last 50 entries
    if (newHistory.length > 50) newHistory.shift();
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  undo: () => {
    const { history, historyIndex, project } = get();
    if (historyIndex <= 0 || !project) return;
    const newIndex = historyIndex - 1;
    const entry = history[newIndex];
    set({
      project: { ...project, scenes: structuredClone(entry.scenes) },
      activeSceneId: entry.activeSceneId,
      historyIndex: newIndex,
      selectedElementId: null,
    });
  },

  redo: () => {
    const { history, historyIndex, project } = get();
    if (historyIndex >= history.length - 1 || !project) return;
    const newIndex = historyIndex + 1;
    const entry = history[newIndex];
    set({
      project: { ...project, scenes: structuredClone(entry.scenes) },
      activeSceneId: entry.activeSceneId,
      historyIndex: newIndex,
      selectedElementId: null,
    });
  },

  // Mode
  setPreviewMode: (previewMode) => set({ previewMode }),

  // Helpers
  getActiveScene: () => {
    const { project, activeSceneId } = get();
    if (!project || !activeSceneId) return null;
    return project.scenes.find((s) => s.id === activeSceneId) ?? null;
  },

  getSelectedElement: () => {
    const scene = get().getActiveScene();
    const { selectedElementId } = get();
    if (!scene || !selectedElementId) return null;
    return scene.elements.find((e) => e.id === selectedElementId) ?? null;
  },

  getTotalFrames: () => {
    const { project } = get();
    if (!project) return 0;
    return project.scenes.reduce((sum, s) => sum + s.duration, 0);
  },
}));
