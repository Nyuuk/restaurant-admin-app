import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
    TruckIcon,
} from '@heroicons/react/24/outline';

const RecentOrders = ({ loading }) => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchRecentOrders = async () => {
            try {
                // Replace with actual API call
                // const response = await api.get('/orders/recent');
                // setOrders(response.data);

                // Placeholder data for demonstration
                setTimeout(() => {
                    const demoOrders = [
                        {
                            id: 'ORD-12345',
                            table: 'Table #5',
                            customer: 'Dine-in',
                            items: 4,
                            total: 175000,
                            status: 'completed',
                            time: '15 minutes ago',
                        },
                        {
                            id: 'ORD-12344',
                            table: 'Table #3',
                            customer: 'Dine-in',
                            items: 3,
                            total: 120000,
                            status: 'in-progress',
                            time: '30 minutes ago',
                        },
                        {
                            id: 'ORD-12343',
                            table: 'Take Away',
                            customer: 'John Doe',
                            items: 2,
                            total: 85000,
                            status: 'ready',
                            time: '45 minutes ago',
                        },
                        {
                            id: 'ORD-12342',
                            table: 'Table #7',
                            customer: 'Dine-in',
                            items: 6,
                            total: 250000,
                            status: 'completed',
                            time: '1 hour ago',
                        },
                        {
                            id: 'ORD-12341',
                            table: 'Take Away',
                            customer: 'Jane Smith',
                            items: 1,
                            total: 45000,
                            status: 'cancelled',
                            time: '2 hours ago',
                        },
                    ];

                    setOrders(demoOrders);
                }, 500);
            } catch (error) {
                console.error('Error fetching recent orders:', error);
            }
        };

        // Only fetch if not loading
        if (!loading) {
            fetchRecentOrders();
        }
    }, [loading]);

    // Format IDR currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Status badge component
    const StatusBadge = ({ status }) => {
        const badges = {
            'completed': {
                color: 'bg-green-100 text-green-800',
                icon: <CheckCircleIcon className="w-4 h-4 mr-1" />,
                text: 'Completed',
            },
            'in-progress': {
                color: 'bg-blue-100 text-blue-800',
                icon: <ClockIcon className="w-4 h-4 mr-1" />,
                text: 'In Progress',
            },
            'ready': {
                color: 'bg-yellow-100 text-yellow-800',
                icon: <TruckIcon className="w-4 h-4 mr-1" />,
                text: 'Ready for Pickup',
            },
            'cancelled': {
                color: 'bg-red-100 text-red-800',
                icon: <XCircleIcon className="w-4 h-4 mr-1" />,
                text: 'Cancelled',
            },
        };

        const { color, icon, text } = badges[status] || badges['in-progress'];

        return (
            <span className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
                {icon}
                {text}
            </span>
        );
    };

    return (
        <div className="overflow-x-auto">
            {loading ? (
                <div className="animate-pulse">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="border-b py-4">
                            <div className="flex justify-between">
                                <div className="w-1/4 h-5 bg-gray-200 rounded"></div>
                                <div className="w-1/5 h-5 bg-gray-200 rounded"></div>
                            </div>
                            <div className="mt-2 flex justify-between">
                                <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
                                <div className="w-1/6 h-4 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div className="py-20 text-center text-gray-500">
                    <p>No recent orders</p>
                </div>
            ) : (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Order ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Table/Customer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Items
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Time
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {order.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div>{order.table}</div>
                                    <div className="text-xs text-gray-400">{order.customer}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {order.items} item{order.items !== 1 ? 's' : ''}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                    {formatCurrency(order.total)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={order.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {order.time}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link
                                        to={`/orders/${order.id}`}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

RecentOrders.propTypes = {
    loading: PropTypes.bool,
};

export default RecentOrders;