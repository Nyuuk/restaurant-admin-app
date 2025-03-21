import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const PopularItemsChart = ({ loading }) => {
    const [chartData, setChartData] = useState([]);
    const [timeRange, setTimeRange] = useState('today'); // 'today', 'week', 'month'

    useEffect(() => {
        const fetchPopularItems = async () => {
            try {
                // Replace with actual API call
                // const response = await api.get(`/dashboard/popular-items?range=${timeRange}`);
                // setChartData(response.data);

                // Placeholder data for demonstration
                const demoData = [
                    { name: 'Nasi Goreng Spesial', count: timeRange === 'today' ? 18 : timeRange === 'week' ? 124 : 520 },
                    { name: 'Ayam Bakar', count: timeRange === 'today' ? 15 : timeRange === 'week' ? 105 : 420 },
                    { name: 'Soto Ayam', count: timeRange === 'today' ? 12 : timeRange === 'week' ? 87 : 350 },
                    { name: 'Mie Goreng', count: timeRange === 'today' ? 10 : timeRange === 'week' ? 72 : 290 },
                    { name: 'Es Teh Manis', count: timeRange === 'today' ? 25 : timeRange === 'week' ? 175 : 700 },
                ];

                setChartData(demoData);
            } catch (error) {
                console.error('Error fetching popular items:', error);
            }
        };

        // Only fetch if not loading
        if (!loading) {
            fetchPopularItems();
        }
    }, [timeRange, loading]);

    // Custom tooltip for the chart
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="p-3 bg-white shadow-md border border-gray-200 rounded-md">
                    <p className="font-medium text-gray-900">{label}</p>
                    <p className="text-sm text-purple-600">
                        Orders: {payload[0].value}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="mt-4">
            {/* Time range selector */}
            <div className="flex mb-4 space-x-2">
                <button
                    className={`px-3 py-1 text-sm rounded-md ${timeRange === 'today'
                            ? 'bg-purple-100 text-purple-600 font-medium'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    onClick={() => setTimeRange('today')}
                >
                    Today
                </button>
                <button
                    className={`px-3 py-1 text-sm rounded-md ${timeRange === 'week'
                            ? 'bg-purple-100 text-purple-600 font-medium'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    onClick={() => setTimeRange('week')}
                >
                    This Week
                </button>
                <button
                    className={`px-3 py-1 text-sm rounded-md ${timeRange === 'month'
                            ? 'bg-purple-100 text-purple-600 font-medium'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    onClick={() => setTimeRange('month')}
                >
                    This Month
                </button>
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
                        <BarChart
                            data={chartData}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis
                                dataKey="name"
                                type="category"
                                scale="band"
                                tick={{ fontSize: 12 }}
                                width={150}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar
                                dataKey="count"
                                name="Orders"
                                fill="#8b5cf6"
                                barSize={20}
                                radius={[0, 4, 4, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

PopularItemsChart.propTypes = {
    loading: PropTypes.bool,
};

export default PopularItemsChart;