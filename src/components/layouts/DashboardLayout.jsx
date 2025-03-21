import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isOwner = user?.role === 'owner';

    // Navigation items with access control
    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: '📊', access: ['owner', 'cashier'] },
        { path: '/menu', label: 'Menu', icon: '🍽️', access: ['owner', 'cashier'] },
        { path: '/category', label: 'Kategori', icon: '📋', access: ['owner', 'cashier'] },
        { path: '/table', label: 'Meja', icon: '🪑', access: ['owner', 'cashier'] },
        { path: '/order', label: 'Pesanan', icon: '📝', access: ['owner', 'cashier'] },
        { path: '/reservation', label: 'Reservasi', icon: '📅', access: ['owner', 'cashier'] },
        { path: '/payment', label: 'Pembayaran', icon: '💰', access: ['owner', 'cashier'] },
        { path: '/reports', label: 'Laporan', icon: '📈', access: ['owner'] },
    ];

    // Filter navigation items based on user role
    const filteredNavItems = navItems.filter(item =>
        item.access.includes(user?.role)
    );

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div
                className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:relative md:translate-x-0 transition duration-200 ease-in-out`}
            >
                <div className="flex items-center justify-between px-4">
                    <h2 className="text-2xl font-semibold">Restoran App</h2>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-1 md:hidden focus:outline-none focus:bg-gray-700 rounded"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <nav>
                    <ul className="space-y-2">
                        {filteredNavItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded hover:bg-gray-700 ${location.pathname.startsWith(item.path) ? 'bg-gray-700' : ''
                                        }`}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="px-4 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 rounded hover:bg-gray-700 w-full"
                    >
                        <span className="text-xl">🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow">
                    <div className="flex items-center justify-between px-6 py-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="md:hidden focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <div className="flex items-center">
                            <span className="text-gray-800 mr-2">{user?.nama_lengkap || 'User'}</span>
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {user?.role === 'owner' ? 'Owner' : 'Kasir'}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Main content area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <div className="container mx-auto px-6 py-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;