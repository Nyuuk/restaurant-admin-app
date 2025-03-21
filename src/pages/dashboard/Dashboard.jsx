import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
    const { user } = useAuth();
    const isOwner = user?.role === 'owner';

    // Cards untuk statistik
    const statsCards = [
        {
            title: "Pesanan Hari Ini",
            value: "24",
            icon: "📋",
            bgColor: "bg-blue-500"
        },
        {
            title: "Pendapatan Hari Ini",
            value: "Rp 1,250,000",
            icon: "💰",
            bgColor: "bg-green-500"
        },
        {
            title: "Meja Terisi",
            value: "8 / 15",
            icon: "🪑",
            bgColor: "bg-yellow-500"
        },
        {
            title: "Menu Habis",
            value: "3",
            icon: "⚠️",
            bgColor: "bg-red-500"
        },
    ];

    // Data untuk pesanan terbaru
    const recentOrders = [
        { id: "ORD-001", table: "Meja 5", total: "Rp 175,000", status: "Diproses", time: "10:15" },
        { id: "ORD-002", table: "Take Away", total: "Rp 85,000", status: "Siap", time: "10:05" },
        { id: "ORD-003", table: "Meja 8", total: "Rp 225,000", status: "Selesai", time: "09:45" },
        { id: "ORD-004", table: "Meja 2", total: "Rp 150,000", status: "Selesai", time: "09:30" },
    ];

    // Data untuk menu populer
    const popularItems = [
        { name: "Ayam Bakar Madu", sold: 18, revenue: "Rp 1,080,000" },
        { name: "Nasi Goreng Spesial", sold: 15, revenue: "Rp 750,000" },
        { name: "Es Teh Manis", sold: 24, revenue: "Rp 240,000" },
        { name: "Sate Ayam", sold: 12, revenue: "Rp 600,000" },
    ];

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statsCards.map((card, index) => (
                    <div
                        key={index}
                        className={`${card.bgColor} rounded-lg shadow-md p-4 text-white`}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm opacity-80">{card.title}</p>
                                <p className="text-2xl font-bold mt-1">{card.value}</p>
                            </div>
                            <div className="text-3xl opacity-80">{card.icon}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders and Popular Items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Pesanan Terbaru</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Meja
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Waktu
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {recentOrders.map((order, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                            {order.id}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                            {order.table}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                            {order.total}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${order.status === 'Diproses' ? 'bg-yellow-100 text-yellow-800' :
                                                    order.status === 'Siap' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-green-100 text-green-800'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                            {order.time}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Popular Items */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Menu Terlaris</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Menu
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Terjual
                                    </th>
                                    {isOwner && (
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Pendapatan
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {popularItems.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                            {item.name}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                            {item.sold}
                                        </td>
                                        {isOwner && (
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                                {item.revenue}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Aksi Cepat</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                        <span className="text-2xl mb-2">📋</span>
                        <span className="text-sm font-medium text-blue-700">Pesanan Baru</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition">
                        <span className="text-2xl mb-2">🔄</span>
                        <span className="text-sm font-medium text-green-700">Update Stok</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition">
                        <span className="text-2xl mb-2">📅</span>
                        <span className="text-sm font-medium text-yellow-700">Catat Reservasi</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
                        <span className="text-2xl mb-2">🪑</span>
                        <span className="text-sm font-medium text-purple-700">Atur Meja</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;