import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { logout, user } = useAuth();

  return (
    <div>
      <h1>Welcome, {user?.username}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;