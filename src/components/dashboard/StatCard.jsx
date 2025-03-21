import React from 'react';
import PropTypes from 'prop-types';

/**
 * Stat Card Component for displaying statistics in dashboard
 */
const StatCard = ({
    title,
    value,
    icon,
    color = 'blue',
    loading = false,
    subtitle = '',
    change = null,
    changeType = 'neutral',
}) => {
    // Color variants
    const colorVariants = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        red: 'bg-red-50 text-red-600',
        yellow: 'bg-yellow-50 text-yellow-600',
        purple: 'bg-purple-50 text-purple-600',
        indigo: 'bg-indigo-50 text-indigo-600',
        amber: 'bg-amber-50 text-amber-600',
        gray: 'bg-gray-50 text-gray-600',
    };

    // Change type styling
    const changeStyles = {
        positive: 'text-green-600',
        negative: 'text-red-600',
        neutral: 'text-gray-500',
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>

                    {loading ? (
                        <div className="h-8 w-24 bg-gray-200 animate-pulse rounded mt-1"></div>
                    ) : (
                        <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
                    )}

                    {subtitle && (
                        <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
                    )}

                    {change !== null && (
                        <p className={`mt-1 text-xs flex items-center ${changeStyles[changeType]}`}>
                            {changeType === 'positive' && (
                                <svg
                                    className="w-3 h-3 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 15l7-7 7 7"
                                    />
                                </svg>
                            )}

                            {changeType === 'negative' && (
                                <svg
                                    className="w-3 h-3 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            )}

                            {change}
                        </p>
                    )}
                </div>

                {loading ? (
                    <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full"></div>
                ) : (
                    <div className={`p-2 rounded-full ${colorVariants[color]}`}>{icon}</div>
                )}
            </div>
        </div>
    );
};

StatCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    icon: PropTypes.node,
    color: PropTypes.oneOf(['blue', 'green', 'red', 'yellow', 'purple', 'indigo', 'amber', 'gray']),
    loading: PropTypes.bool,
    subtitle: PropTypes.string,
    change: PropTypes.string,
    changeType: PropTypes.oneOf(['positive', 'negative', 'neutral']),
};

export default StatCard;