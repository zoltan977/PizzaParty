import React, { useState } from 'react';
import axios from 'axios';
import '../Login/Login.css';
import { connect } from 'react-redux';
import {logout} from '../../actions/authActions';

const Order = ({logout, cart, history}) => {

    let formValid = true
    
    const [order, setOrder] = useState({
        name: "",
        email: "",
        tel: "",
        address: ""
    });

    const [error, setError] = useState(null);
   
    const {name, email, tel, address} = order;


    const onChange = e => setOrder({...order, [e.target.name]: e.target.value})


    const submit = async () => {

        if (!formValid)
            return

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {

            setError(null)
            const res = await axios.post(
                "/api/order", 
                {...order, cart}, 
                config)

            if (res.data && res.data.success === true)
                history.push("/orders")
            else
                logout()

        } catch (err) {
            console.log("error: ", err.response.data)
            setError(err.response.data)
            logout()
        }

    }

    return (
        <div className="Order">
            <div className="content">
                <h1>Order</h1>
                <div className="alerts">
                {
                    function() {
                        let alerts = []
                        formValid = true

                        if (name === "" || email === "" || tel === "" || address === "") {
                            alerts.push(<p key={alerts.length + 1}>Please fill every field!</p>)
                            formValid = false
                        }

                        if (!Object.keys(cart.pizza).length && !Object.keys(cart.topping).length) {
                            alerts.push(<p key={alerts.length + 1}>Cart is empty!</p>)
                            formValid = false
                        }

                        if (error) {
                            if (error.msg)
                                alerts.push(<p key={alerts.length + 1}>{error.msg}</p>)

                            if (error.errors) {
                                for (const err of error.errors) {
                                    alerts.push(<p key={alerts.length + 1}>{err.msg}</p>)
                                }   
                            }
                        }

                        return alerts
                    }()
                }
                </div>
                <form>
                    <div>
                        <label htmlFor="name">Name</label>
                        <input type="text" name="name" value={name} onChange={onChange}/>
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" value={email} onChange={onChange}/>
                    </div>
                    <div>
                        <label htmlFor="tel">Phone Number</label>
                        <input type="tel" name="tel" value={tel} onChange={onChange}/>
                    </div>
                    <div>
                        <label htmlFor="address">Address</label>
                        <input type="text" name="address" value={address} onChange={onChange}/>
                    </div>
                    <button type="button" disabled={!formValid} onClick={submit}>Order</button>
                </form>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    cart: state.cart
})

export default connect(mapStateToProps, {logout})(Order)