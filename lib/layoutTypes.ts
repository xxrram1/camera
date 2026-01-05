export type LayoutType = '1:1' | '4:5' | '9:16' | '16:9' | '4:3' | '3:4' | 'polaroid'

export interface LayoutConfig {
  id: LayoutType
  name: string
  label: string
  aspectRatio: number
  width: number
  height: number
}

export const LAYOUT_CONFIGS: Record<LayoutType, LayoutConfig> = {
  '1:1': {
    id: '1:1',
    name: 'Square',
    label: 'SQUARE',
    aspectRatio: 1,
    width: 1080,
    height: 1080,
  },
  '4:5': {
    id: '4:5',
    name: 'Portrait',
    label: 'PORTRAIT',
    aspectRatio: 4 / 5,
    width: 1080,
    height: 1350,
  },
  '9:16': {
    id: '9:16',
    name: 'Story',
    label: 'STORY',
    aspectRatio: 9 / 16,
    width: 1080,
    height: 1920,
  },
  '16:9': {
    id: '16:9',
    name: 'Landscape',
    label: 'LANDSCAPE',
    aspectRatio: 16 / 9,
    width: 1920,
    height: 1080,
  },
  '4:3': {
    id: '4:3',
    name: 'Classic',
    label: 'CLASSIC',
    aspectRatio: 4 / 3,
    width: 1440,
    height: 1080,
  },
  '3:4': {
    id: '3:4',
    name: 'Vertical',
    label: 'VERTICAL',
    aspectRatio: 3 / 4,
    width: 1080,
    height: 1440,
  },
  'polaroid': {
    id: 'polaroid',
    name: 'Polaroid',
    label: 'POLAROID',
    aspectRatio: 4 / 5, // With border
    width: 1080,
    height: 1350,
  },
}

