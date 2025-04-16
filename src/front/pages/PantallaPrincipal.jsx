import React, {useEffect,useState} from "react";
import { useNavigate } from "react-router-dom";
import "./PantallaPrincipal.css";

function PantallaPrincipal() {
    const navigate = useNavigate();
    const [user,setUser] = useState(null);
    const [inventories, setInventories] = useState([]);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            navigate("/registro");
            return;
        }
        fetch("/api/users/id/${userid}")
        .then(res => res.json())
        .then(data => {
            setUser(data);
            setInventories(Date.inventories || []);
        })
        .catch(err => console.error("Error loading user",err));
    },[]);
    const handleLogout = () => {
        localStorage.clear();
        navigate("/registro");
    };

    return (
        <div className="pantalla-principal">
            {user ? (
                <>
                <h1>Welcome, {user.name}</h1>
                <p> You have {inventories.length} inventory(s) assigned.</p>
                <div className="botones-navegacion">
                    <button onClick={() => navigate('/inventarios')}>View Inventories</button>
                    <button onClick={() => navigate('/productos')}>View Products</button>
                    <button onClick={() => navigate('/pedidos')}>View Orders</button>
                    <button onClick={() => navigate('/transacciones')}>View Transactions</button>
                </div>
                <button className="logout-button" on-Click={handleLogout}>Close sesion</button></>
            ) : ( <p> Loading...</p>
            )}
        </div>
    );
}
export default PantallaPrincipal;