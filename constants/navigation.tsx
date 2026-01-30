import {
  GridIcon,
  PieChartIcon,
  BoxCubeIcon,
  PlugInIcon,
  ClockIcon, // Ajoutez ceci
  XCircleIcon, // Ajoutez ceci
  CheckCircleIcon, // Ajoutez ceci
  GroupIcon,
  SettingsIcon,
  DocsIcon
} from '@/icons';
import { SidebarItem } from '@/types/components/sidebar';

export const mainNavItems: SidebarItem[] = [
  {
    icon: <GridIcon />,
    name: 'Dashboard',
    path: '/user',
  },
  {
    icon: <DocsIcon />,
    name: 'Liste des postulants',
    subItems: [
      { icon: <ClockIcon />, name: 'en attente', path: '/user/postulants/en-attente'},
      { icon: <XCircleIcon />, name: 'rejetes', path: '/user/postulants/rejetes'},
      { icon: <CheckCircleIcon />, name: 'retenus', path: '/user/postulants/retenus'},
      { icon: <GroupIcon />, name: 'reservistes', path: '/user/postulants/reservistes'},
    ],
  },
  {
    icon: <SettingsIcon />,
    name: 'Paramètres',
    path: '/user/settings',
  },
  /* {
    icon: <UserCircleIcon />,
    name: 'Postulants en attente',
    path: '/user/postulants/en-attente',
  },
  {
    icon: <UserCircleIcon />,
    name: 'Postulants rejetes',
    path: '/user/postulants/rejetes',
  },
  {
    icon: <UserCircleIcon />,
    name: 'Postulants retenus',
    path: '/user/postulants/retenus',
  },
  {
    icon: <UserCircleIcon />,
    name: 'Postulants reservistes',
    path: '/user/postulants/reservistes',
  }, */
];

export const othersNavItems: SidebarItem[] = [
  {
    icon: <PieChartIcon />,
    name: 'Charts',
    subItems: [
      { name: 'Line Chart', path: '/line-chart', pro: false },
      { name: 'Bar Chart', path: '/bar-chart', pro: false },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: 'UI Elements',
    subItems: [
      { name: 'Alerts', path: '/alerts', pro: false },
      { name: 'Avatar', path: '/avatars', pro: false },
      { name: 'Badge', path: '/badge', pro: false },
      { name: 'Buttons', path: '/buttons', pro: false },
      { name: 'Images', path: '/images', pro: false },
      { name: 'Videos', path: '/videos', pro: false },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: 'Authentication',
    subItems: [
      { name: 'Sign In', path: '/login', pro: false },
      { name: 'Sign Up', path: '/signup', pro: false },
    ],
  },
];