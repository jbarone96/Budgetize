import { useParams } from "react-router-dom";
import Sidebar from "../Components/Sidebar";

const UserAccount = () => {
  const { username } = useParams();

  // Placeholder user data – replace with data fetched from Firestore in the future
  const user = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    age: 30,
    linkedAccounts: 2,
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">User Profile: {username}</h1>

        <div className="bg-white shadow rounded-lg p-6 max-w-xl">
          <p className="mb-2">
            <strong>First Name:</strong> {user.firstName}
          </p>
          <p className="mb-2">
            <strong>Last Name:</strong> {user.lastName}
          </p>
          <p className="mb-2">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="mb-2">
            <strong>Age:</strong> {user.age}
          </p>
          <p>
            <strong>Linked Bank Accounts:</strong> {user.linkedAccounts}
          </p>
        </div>
      </main>
    </div>
  );
};

export default UserAccount;
