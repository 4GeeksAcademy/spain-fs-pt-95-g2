import React, { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);

  const PERMISSIONS = {
    1: "Visualizer",
    2: "Admin"
  };

  useEffect(() => {
    setUser({
      username: "",
      email: "",
      created_date: "new_date",
      inventories: [
        { name: "tienda 1", permissions: 1 },
        { name: "tienda 2", permissions: 2 },
      ],
    });
  }, []);

  if (!user) return <p className="text-center">Loading profile...</p>;

  return (
    <div className="profile-container">
      <h1 className="titulo">User Profile</h1>
      <div className="card">
        <p><strong>User Name:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Member since:</strong> {user.created_date}</p>
      </div>
      <div className="inventories">
        <h2 className="stores">Assigned inventories</h2>
        <ul className="inventorieslist">
          {user.inventories.map((inv, idx) => (
            <li key={idx}>
              {inv.name} - Permission: {PERMISSIONS[inv.permissions]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
