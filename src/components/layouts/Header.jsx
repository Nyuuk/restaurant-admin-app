import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSidebar } from '../../context/SidebarContext';
import {
    Bars3Icon,
    BellIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const Header = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const notificationsRef = useRef(null);
    const { toggleMobileSidebar } = useSidebar();
    const { user, logout } = useAuth();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                setNotificationsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Sample notifications
    const notifications = [
        {
            id: 1,
            title: 'New order received',
            message: 'Table #5 placed a new order',
            time: '5 minutes ago',
            read: false,
        },
        {
            id: 2,
            title: 'Payment received',
            message: 'Payment for order #1234 received',
            time: '30 minutes ago',
            read: true,
        },
        {
            id: 3,
            title: 'Menu item out of stock',
            message: 'Nasi Goreng is now out of stock',
            time: '1 hour ago',
            read: true,
        },
    ];

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const toggleNotifications = () => {
        setNotificationsOpen(!notificationsOpen);
    };

    return (
        <header className="bg-white shadow-sm">
            <div className="flex items-center justify-between h-16 px-4">
                {/* Mobile menu button */}
                <button
                    className="p-1 text-gray-500 rounded-md md:hidden hover:bg-gray-100"
                    onClick={toggleMobileSidebar}
                >
                    <Bars3Icon className="w-6 h-6" />
                </button>

                {/* Search bar */}
                <div className="flex-1 max-w-xl px-4">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                ></path>
                            </svg>
                        </span>
                        <input
                            type="text"
                            className="w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-100 border border-transparent rounded-md focus:border-blue-500 focus:bg-white focus:ring-0"
                            placeholder="Search..."
                        />
                    </div>
                </div>

                {/* Right side buttons */}
                <div className="flex items-center space-x-4">
                    {/* Notifications */}
                    <div className="relative" ref={notificationsRef}>
                        <button
                            className="p-1 text-gray-500 rounded-md hover:bg-gray-100 relative"
                            onClick={toggleNotifications}
                        >
                            <BellIcon className="w-6 h-6" />
                            {notifications.some(n => !n.read) && (
                                <span className="absolute top-0 right-0 block w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                            )}
                        </button>

                        {/* Notifications dropdown */}
                        {notificationsOpen && (
                            <div className="absolute right-0 z-10 w-80 mt-2 bg-white rounded-md shadow-lg">
                                <div className="p-2 border-b">
                                    <h3 className="text-lg font-semibold">Notifications</h3>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <p className="p-4 text-center text-gray-500">No notifications</p>
                                    ) : (
                                        <ul className="p-2">
                                            {notifications.map((notification) => (
                                                <li
                                                    key={notification.id}
                                                    className={`p-2 border-b last:border-0 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''
                                                        }`}
                                                >
                                                    <h4 className="font-medium">{notification.title}</h4>
                                                    <p className="text-sm text-gray-600">{notification.message}</p>
                                                    <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <div className="p-2 border-t">
                                    <button className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md">
                                        View all notifications
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User menu */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                            onClick={toggleDropdown}
                        >
                            <div className="flex items-center">
                                <UserCircleIcon className="w-8 h-8 text-gray-500" />
                                <span className="ml-2 text-sm font-medium hidden md:block">
                                    {user?.nama_lengkap || user?.username || 'Admin'}
                                </span>
                            </div>
                        </button>

                        {/* User dropdown */}
                        {dropdownOpen && (
                            <div className="absolute right-0 z-10 w-48 mt-2 bg-white rounded-md shadow-lg">
                                <div className="py-2 border-b">
                                    <div className="px-4 py-2">
                                        <p className="text-sm font-medium">{user?.nama_lengkap || user?.username}</p>
                                        <p className="text-xs text-gray-500">{user?.email}</p>
                                    </div>
                                </div>
                                <div className="py-1">
                                    <Link
                                        to="/profile"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <UserCircleIcon className="w-5 h-5 mr-2" />
                                        Profile
                                    </Link>
                                    <Link
                                        to="/settings"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <Cog6ToothIcon className="w-5 h-5 mr-2" />
                                        Settings
                                    </Link>
                                    <button
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={logout}
                                    >
                                        <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}