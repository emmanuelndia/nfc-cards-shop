export interface SidebarItem {
  name: string;
  icon?: React.ReactNode | React.ComponentType<{ className?: string }>; // <--- MODIFIER ICI
  path?: string;
  subItems?: SidebarItem[];
  new?: boolean;
  pro?: boolean;
}

export interface SubmenuState {
  type: 'main' | 'others';
  index: number;
}