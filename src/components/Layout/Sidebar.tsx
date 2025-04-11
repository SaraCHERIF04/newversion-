import {
  HardDriveIcon,
  FileDocumentIcon,
  LayersIcon,
  Building2Icon,
  BriefcaseIcon,
  UsersIcon,
  CalendarIcon,
  SettingsIcon,
  InfoIcon,
  LayoutDashboardIcon,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const sidebarItems = [
  {
    title: 'Project',
    href: '/project',
    icon: HardDriveIcon
  },
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboardIcon
  },
  {
    title: 'Sous-projet',
    href: '/sous-projet',
    icon: LayersIcon
  },
  {
    title: 'Incidents',
    href: '/incident',
    icon: InfoIcon
  },
  {
    title: 'Calendar',
    href: '/calendar',
    icon: CalendarIcon
  },
  {
    title: 'Organization',
    href: '/organization',
    icon: Building2Icon
  },
  {
    title: 'Team',
    href: '/team',
    icon: UsersIcon
  },
  {
    title: 'Ressources Humaines',
    href: '/ressources-humaines',
    icon: BriefcaseIcon
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: SettingsIcon
  }
];

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <aside
      className={`bg-gray-50 text-gray-700 w-64 py-8 px-4 space-y-6 fixed top-0 left-0 h-full overflow-y-auto transition-transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 z-50`}
    >
      <div className="flex items-center justify-center">
        <span className="text-2xl font-bold">Menu</span>
      </div>
      <nav>
        {sidebarItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center py-2 px-4 rounded-md hover:bg-gray-100 transition-colors ${
                isActive ? 'bg-gray-100 font-semibold' : ''
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-2" />
            {item.title}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
