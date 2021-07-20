import './Orders.css';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import OrderCard from './OrderCard/OrderCard';
import { connect } from 'react-redux';
import { logout } from '../../actions/authActions';

const Orders = ({logout}) => {

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const asyncFn = async () => {
            try {
    
                const res = await axios.get("/api/orders")
                console.log("orders: ", res.data)
                setOrders(res.data)
    
            } catch (err) {
                console.log(err.response.data)
                logout()
            }
        }

        asyncFn()

    }, []);

    return (
        <div className="Orders">
            <div className="title">
                <h1>
                    Megrendelések
                </h1>
            </div>
            <div className="content">
                {
                    orders.length ? orders.map((ord, idx) => <OrderCard key={idx} order={ord}/>)
                                    : <p className="info">Nincsenek megrendelések</p>
                }
            </div>
        </div>
    )
}

export default connect(null, {logout})(Orders)