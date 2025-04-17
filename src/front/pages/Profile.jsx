import React, { useEffect, useState } from "react";
import "../index.css";
import logo from "../assets/img/logo.png"

const Profile = () => {
  const [user, setUser] = useState(null);
  const PERMISSIONS = { 1: "Visualizer", 2: "Admin" };
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {

    const loadProfile = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("no se encontro localstorage");
        return;
      }
      try {
        const response = await fetch(`${BACKEND_URL}/api/users/id/${userId}`)
        const data = await response.json();

        console.log("DATA",data);

        if (!data.result) {
          console.error("usuario no encontrado");
          return;
        }
        setUser(data.result);
      } catch(error) {
          console.error("error loading profile", error);
        }
      
    };
    loadProfile();

    //const token =localStorage.getItem("token");
    //const userId =localStorage.getItem("user_id");

    //if (!token || !userId) {
      //console.error("Usuario no encontrado");
      //return;
    //}

    //fetch(`${BACKEND_URL}/api/users/id/${userId}`, {
      //headers: {
        //Authorization: "Bearer ${token}"
      //}
    //})
      //.then(res => {
        //if (!res.ok) throw new Error("Error loading user");
        //return res.json();
      //})
      //.then(data => setUser(data.result || data))
      //.catch(error => console.error("Error loading profile", error));
  }, []);

  if (!user) return <p className="text-center">Loading profile...</p>;

  return (
    <div className="profile-container">
      <header className="Profile-header">
        <img src ={logo}
        alt="Logo Easy Inventory" className="logo"/>
        </header>
      <h1 className="title">User Profile</h1>
      <div className="card">
        <p><strong>User ID</strong>{user.id_user}</p>
        <p><strong>User Name:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Created Date</strong>{new Date(user.created_date).toLocaleDateString()}</p>
        <p><strong>Expired Date</strong>{" "} {user.expired_date ? new Date(user.expired_date).toLocaleDateString() : "N/A"}</p>
        <p><strong>Staff Number:</strong> {user.staff_number}</p>
        
      </div>
      {user.inventories && user.inventories.length > 0 && (
      <div className="inventories">
        <h2 className="stores">Assigned inventories</h2>
        <ul className="inventorieslist">
          {user.inventories.map((inv, idx) => (
            <li key={idx}>
              {inv.inventory.name} ({inv.inventory.location})- Permission: {PERMISSIONS[inv.permissions]}
            </li>
          ))}
        </ul>
      </div>
      )}
    </div>
  );
};

export default Profile;
