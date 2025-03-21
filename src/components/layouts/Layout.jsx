import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { SidebarProvider } from '../../context/SidebarContext';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <SidebarProvider>
            <div className="flex h-screen bg-gray-100">
                {/* Sidebar */}
                <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />

                {/* Main Content */}
                <div className="flex flex-col flex-1 overflow-hidden">
                    <Header toggleSidebar={toggleSidebar} />

                    <main className="flex-1 overflow-y-auto p-4 md:p-6">
                        <Outlet />
                    </main>

                    <footer className="bg-white p-4 shadow-inner text-center text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} Restaurant Admin Panel. All rights reserved.
                    </footer>
                </div>
            </div>
        </SidebarProvider>
    );
};

export default Layout;