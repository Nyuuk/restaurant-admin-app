import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const SalesChart = ({ loading }) => {
    const [chartData, setChartData] = useState([]);
    const [period, setPeriod] = useState('week'); // 'week', 'month', 'year'

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                // Replace with actual API call
                // const response = await api.get(`/dashboard/sales-chart?period=${period}`);
                // setChartData(response.data);

                // Placeholder data for demonstration
                let demoData = [];

                if (period === 'week') {
                    demoData = [
                        { name: 'Monday', sales: 1200000, orders: 25 },
                        { name: 'Tuesday', sales: 900000, orders: 18 },
                        { name: 'Wednesday', sales: 1500000, orders: 30 },
                        { name: 'Thursday', sales: 1800000, orders: 35 },
                        { name: 'Friday', sales: 2400000, orders: 48 },
                        { name: 'Saturday', sales: 2800000, orders: 55 },
                        { name: 'Sunday', sales: 2100000, orders: 42 },
                    ];
                } else if (period === 'month') {
                    demoData = Array.from({ length: 30 }, (_, i) => ({
                        name: `${i + 1}`,
                        sales: Math.floor(Math.random() * 3000000) + 500000,
                        orders: Math.floor(Math.random() * 60) + 10,
                    }));
                } else if (period === 'year') {
                    demoData = [
                        { name: 'Jan', sales: 15000000, orders: 300 },
                        { name: 'Feb', sales: 17000000, orders: 340 },
                        { name: 'Mar', sales: 18500000, orders: 370 },
                        { name: 'Apr', sales: 16000000, orders: 320 },
                        { name: 'May', sales: 21000000, orders: 420 },
                        { name: 'Jun', sales: 24000000, orders: 480 },
                        { name: 'Jul', sales: 23000000, orders: 460 },
                        { name: 'Aug', sales: 27000000, orders: 540 },
                        { name: 'Sep', sales: 25000000, orders: 500 },
                        { name: 'Oct', sales: 26000000, orders: 520 },
                        { name: 'Nov', sales: 29000000, orders: 580 },
                        { name: 'Dec', sales: 35000000, orders: 700 },
                    ];
                }

                setChartData(demoData);
            } catch (error) {
                console.error('Error fetching chart data:', error);
            }
        };

        // Only fetch if not loading
        if (!loading) {
            fetchChartData();
        }
    }, [period, loading]);

    // Format IDR currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    // Custom tooltip for the chart
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="p-3 bg-white shadow-md border border-gray-200 rounded-md">
                    <p className="font-medium text-gray-900">{label}</p>
                    <p className="text-sm text-blue-600">
                        Sales: {formatCurrency(payload[0].value)}
                    </p>
                    <p className="text-sm text-green-600">
                        Orders: {payload[1].value}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="mt-4">
            {/* Period selector */}
            <div className="flex mb-4 space-x-2">
                {['week', 'month', 'year'].map((option) => (
                    <button
                        key={option}
                        className={`px-3 py-1 text-sm rounded-md ${period === option
                                ? 'bg-blue-100 text-blue-600 font-medium'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        onClick={() => setPeriod(option)}
                    >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                ))}
            </div>

            {/* Chart */}
            {loading ? (
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
                    <svg
                        className="w-10 h-10 text-gray-300 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                </div>
            ) : (
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={chartData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis
                                yAxisId="left"
                                tickFormatter={(value) => `${Math.floor(value / 1000000)}M`}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="sales"
                                stroke="#3b82f6"
                                activeDot={{ r: 8 }}
                                strokeWidth={2}
                                name="Sales (IDR)"
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="orders"
                                stroke="#10b981"
                                strokeWidth={2}
                                name="Orders"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

SalesChart.propTypes = {
    loading: PropTypes.bool,
};

export default SalesChart;