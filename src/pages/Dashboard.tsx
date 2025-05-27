import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
          <div className="mb-4">
            <p className="text-gray-600">Welcome, {user?.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 