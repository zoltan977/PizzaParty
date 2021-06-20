import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios';
import OrderCard from './OrderCard/OrderCard';
import AuthContext from '../../context/auth/authContext';
import './Orders.css';

export default function Orders(props) {

    const [orders, setOrders] = useState([]);

    const {loading, isAuthenticated} = useContext(AuthContext);

    useEffect(() => {
        const asyncFn = async () => {
            try {
    
                const res = await axios.get("http://localhost:8000/orders")
                console.log(res.data)
                setOrders(res.data)
    
            } catch (err) {
                console.log(err.response.data)
            }
        }

        if (!loading) {
            if (!isAuthenticated)
                props.history.push("/")
            else
                asyncFn()
        }

    }, [loading, isAuthenticated]);

    return (
        <div className="Orders">
            {
                orders.length ? orders.map((ord, idx) => <OrderCard key={idx} order={ord}/>)
                                : <p className="info">Nincsenek megrendelések</p>
            }
        </div>
    )
}
