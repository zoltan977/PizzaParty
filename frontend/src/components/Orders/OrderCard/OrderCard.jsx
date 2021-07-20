import React from 'react';
import './OrderCard.css';

const OrderCard = ({order}) => {

    let totalSum = 0;

    const renderTable = (category) => {

        let sum = 0;
        let rows = order.cart[category].map((item, idx) => {

            sum += item.quantity * item.price

            return (<tr key={idx}>
            <td>{item.name}</td>
            <td>{item.price}</td>
            <td>{item.quantity}</td>
            <td>{item.quantity * item.price}</td>
        </tr>)
        })

        rows.push(
            <tr key={order.cart[category].length}>
                <td colSpan="3"></td>
                <td>{sum}</td>
            </tr>)

        totalSum += sum;

        return rows;
    }

    return (
        <div className="OrderCard">
            <div className="personalData">
                <table>
                    <tbody>
                        <tr>
                            <td>Név: </td>
                            <td>{order.name}</td>
                        </tr>
                        <tr>
                            <td>Cím: </td>
                            <td>{order.address}</td>
                        </tr>
                        <tr>
                            <td>Email: </td>
                            <td>{order.email}</td>
                        </tr>
                        <tr>
                            <td>Tel: </td>
                            <td>{order.tel}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="cart">
            {
                    (order.cart.pizza && order.cart.pizza.length) ? 
                    <div>
                        <h2>Pizzák</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Név</th>
                                    <th>Egységár</th>
                                    <th>db</th>
                                    <th>Ár</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    function () {
                                        totalSum = 0;

                                        return renderTable("pizza")
                                    }()
                                }
                            </tbody>
                        </table>
                    </div> : <p>Nincsenek pizzák!</p>
                }
                {
                    (order.cart.topping && order.cart.topping.length) ? 
                    <div>
                        <h2>Feltétek</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Név</th>
                                    <th>Egységár</th>
                                    <th>db</th>
                                    <th>Ár</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                    function () {
                                        return renderTable("topping")
                                    }()
                                }
                            </tbody>
                        </table>
                    </div> : <p>Nincsenek feltétek!</p>
                }
            </div>
            <div className="totalSum">
                Összesen: {totalSum} Ft.
            </div>
        </div>
    )
}

export default OrderCard