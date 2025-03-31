import React, { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser({
      username: "ericMulero",
      email: "ericemail@email.com",
      created_date: "31/03/2025",
      inventories: [
        { name: "la mate por un petisuisse", permissions: 1 },
        { name: "tres pistola pa un manco", permissions: 2 },
      ],
    });
  }, []);

  if (!user) return <p className="text-center">Loading profile...</p>;

  return (
    <div className="profile-container">
      <h1 className="title">User Profile</h1>
      <div className="card">
        <p><strong>User Name:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Member Since:</strong> {user.created_date}</p>
      </div>
      <div className="inventories">
        <h2 className="stores">Assigned Inventories</h2>
        <ul className="inventories-list">
          {user.inventories.map((inv, idx) => (
            <li key={idx}>
              {inv.name} - Permission: {inv.permissions === 2 ? "Admin" : "Visualizer"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
