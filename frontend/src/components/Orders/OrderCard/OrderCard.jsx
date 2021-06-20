import React, {useContext} from 'react';
import DataContext from './../../../context/data/dataContext';
import './OrderCard.css';

export default function OrderCard({order}) {

    const {data} = useContext(DataContext)

    return (
        <div className="OrderCard">
            <div className="personalData">
                <table>
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
                </table>
            </div>
            <div className="cart">
            {
                    (Object.keys(order.cart.pizza).length !== 0 && data.pizza.length !== 0) ? 
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
                                        let pizzas = []
                                        for (const key in order.cart.pizza) {
                                            pizzas.push(
                                                {...data.pizza.filter(p => p.id === Number(key))[0],
                                                    db: order.cart.pizza[key]
                                                })
                                        }

                                        let sum = 0;
                                        let rows = pizzas.map((p, idx) => {

                                            sum += p.db * p.price

                                            return (<tr key={idx}>
                                            <td>{p.name}</td>
                                            <td>{p.price}</td>
                                            <td>{p.db}</td>
                                            <td>{p.db * p.price}</td>
                                        </tr>)
                                        })

                                        rows.push(
                                            <tr key={pizzas.length}>
                                                <td colSpan="3"></td>
                                                <td>{sum}</td>
                                            </tr>)

                                        return rows;
                                    }()
                                }
                            </tbody>
                        </table>
                    </div> : <p>Nincsenek pizzák!</p>
                }
                {
                    (Object.keys(order.cart.topping).length !== 0 && data.topping.length !== 0) ? 
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
                                        let toppings = []
                                        for (const key in order.cart.topping) {
                                            toppings.push(
                                                {...data.topping.filter(p => p.id === Number(key))[0],
                                                    db: order.cart.topping[key]
                                                })
                                        }

                                        let sum = 0;
                                        let rows = toppings.map((t, idx) => {
                                        
                                            sum += t.db * t.price

                                            return <tr key={idx}>
                                                <td>{t.name}</td>
                                                <td>{t.price}</td>
                                                <td>{t.db}</td>
                                                <td>{t.db * t.price}</td>
                                            </tr>
                                        })

                                        rows.push(
                                            <tr key={toppings.length}>
                                                <td colSpan="3"></td>
                                                <td>{sum}</td>
                                            </tr>)

                                        return rows;
                                    }()
                                }
                            </tbody>
                        </table>
                    </div> : <p>Nincsenek feltétek!</p>
                }
            </div>
        </div>
    )
}
