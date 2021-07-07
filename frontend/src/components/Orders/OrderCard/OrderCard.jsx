import React from 'react';
import './OrderCard.css';
import { connect } from 'react-redux';

const OrderCard = ({order, data}) => {

    let totalSum = 0;

    const renderTable = (category) => {

        let items = []
        for (const key in order.cart[category]) {
            items.push(
                {...data[category].filter(p => p._id.toString() === key.toString())[0],
                    db: order.cart[category][key]
                })
        }

        let sum = 0;
        let rows = items.map((p, idx) => {

            sum += p.db * p.price

            return (<tr key={idx}>
            <td>{p.name}</td>
            <td>{p.price}</td>
            <td>{p.db}</td>
            <td>{p.db * p.price}</td>
        </tr>)
        })

        rows.push(
            <tr key={items.length}>
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
                    (order.cart.pizza && Object.keys(order.cart.pizza).length !== 0 && data.pizza.length !== 0) ? 
                    <div>
                        <h2>Pizzák</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
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
                    (order.cart.topping && Object.keys(order.cart.topping).length !== 0 && data.topping.length !== 0) ? 
                    <div>
                        <h2>Feltétek</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
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

const mapStateToProps = state => ({
    data: state.data.data
})

export default connect(mapStateToProps)(OrderCard)