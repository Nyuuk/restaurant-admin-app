import { NavLink } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';
import { useAuth } from '../../hooks/useAuth';
import {
    HomeIcon,
    ClipboardDocumentListIcon,
    QueueListIcon,
    TableCellsIcon,
    ShoppingCartIcon,
    CalendarDaysIcon,
    CreditCardIcon,
    ChartBarIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

const Sidebar = () => {
    const { collapsed, mobileOpen, toggleSidebar, closeMobileSidebar } = useSidebar();
    const { user } = useAuth();

    // Navigation items
    const navItems = [
        {
            name: 'Dashboard',
            icon: <HomeIcon className="w-6 h-6" />,
            path: '/',
            access: ['admin', 'kasir'],
        },
        {
            name: 'Menu',
            icon: <ClipboardDocumentListIcon className="w-6 h-6" />,
            path: '/menu',
            access: ['admin', 'kasir'],
        },
        {
            name: 'Categories',
            icon: <QueueListIcon className="w-6 h-6" />,
            path: '/categories',
            access: ['admin', 'kasir'],
        },
        {
            name: 'Tables',
            icon: <TableCellsIcon className="w-6 h-6" />,
            path: '/tables',
            access: ['admin', 'kasir'],
        },
        {
            name: 'Orders',
            icon: <ShoppingCartIcon className="w-6 h-6" />,
            path: '/orders',
            access: ['admin', 'kasir'],
        },
        {
            name: 'Reservations',
            icon: <CalendarDaysIcon className="w-6 h-6" />,
            path: '/reservations',
            access: ['admin', 'kasir'],
        },
        {
            name: 'Payments',
            icon: <CreditCardIcon className="w-6 h-6" />,
            path: '/payments',
            access: ['admin', 'kasir'],
        },
        {
            name: 'Reports',
            icon: <ChartBarIcon className="w-6 h-6" />,
            path: '/reports/sales',
            access: ['admin'], // Only accessible to admin
        },
    ];

    // Filter items based on user role
    const filteredNavItems = navItems.filter(item => {
        if (!user) return false;
        return item.access.includes(user.role);
    });

    return (
        <>
            {/* Mobile sidebar backdrop */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
                    onClick={closeMobileSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed inset-y-0 left-0 z-50 bg-white shadow-lg transition-all duration-300 
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          ${collapsed ? 'w-20' : 'w-64'}
          md:translate-x-0
        `}
            >
                {/* Sidebar header */}
                <div className="flex items-center justify-between h-16 px-4 border-b">
                    <div className="flex items-center">
                        <img
                            src="/assets/logo.svg"
                            alt="Restaurant Logo"
                            className="w-8 h-8"
                        />
                        {!collapsed && (
                            <span className="ml-2 text-xl font-semibold">Restaurant</span>
                        )}
                    </div>

                    {/* Close button for mobile */}
                    <button
                        className="p-1 text-gray-500 rounded-md md:hidden hover:bg-gray-100"
                        onClick={closeMobileSidebar}
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>

                    {/* Collapse button for desktop */}
                    <button
                        className="hidden p-1 text-gray-500 rounded-md md:block hover:bg-gray-100"
                        onClick={toggleSidebar}
                    >
                        {collapsed ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                                />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4">
                    <ul className="space-y-2">
                        {filteredNavItems.map((item) => (
                            <li key={item.name}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) => `
                    flex items-center p-2 rounded-md transition-colors
                    ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}
                  `}
                                    onClick={mobileOpen ? closeMobileSidebar : undefined}
                                >
                                    <span className="flex-shrink-0">{item.icon}</span>
                                    {!collapsed && <span className="ml-3">{item.name}</span>}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;