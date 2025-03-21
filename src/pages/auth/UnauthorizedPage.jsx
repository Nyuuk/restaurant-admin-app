import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
                <div className="text-red-500 text-5xl mb-4">⚠️</div>
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Akses Ditolak</h1>
                <p className="text-gray-600 mb-6">
                    Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
                    Halaman ini memerlukan level akses yang lebih tinggi.
                </p>
                <Link
                    to="/dashboard"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline inline-block"
                >
                    Kembali ke Dashboard
                </Link>
            </div>
        </div>
    );
};

export default UnauthorizedPage;