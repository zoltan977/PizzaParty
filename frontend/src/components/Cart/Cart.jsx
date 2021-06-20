import React, { useContext, useState, useEffect } from 'react';
import CartContext from './../../context/cart/cartContext';
import DataContext from './../../context/data/dataContext';
import './cart.css';

export default function Cart() {

    const {cart, modifyOrDeleteItem} = useContext(CartContext);
    const {data} = useContext(DataContext);

    const [pizzas, setPizzas] = useState([]);
    const [toppings, setToppings] = useState([]);

    let totalSum = 0;

    const setItems = (pizzaOrTopping) => {
        let array = [];
        for (const key in cart[pizzaOrTopping]) {
            const item = data[pizzaOrTopping].filter((p) => {
                if (p.id === Number(key))
                    return p;
            })
            .map(p => ({...p, db: cart[pizzaOrTopping][key]}))[0]


            array.push(item)
        }
        if (pizzaOrTopping === "pizza")
            setPizzas(array);
        else
            setToppings(array);
    }

    const numbers = "0123456789";
    
    const keyDown = (e) => {
        if (!numbers.includes(e.key) && 
            !e.key.includes("Arrow") && 
            e.key !== "Backspace" && 
            e.key !== "Delete") 
                e.preventDefault();
    }

    const change = (e, id, category) => {
        if (e.target.value === "0" || 
            e.target.value === "")
                e.target.value = "1";

        modifyOrDeleteItem(true, id, category, e.target.value)
    }

    const renderTableBody = (pizzasOrToppings, category) => {
        let sum = 0;
        let itemsRows = pizzasOrToppings.map((item, i) => {
            if (item)
                sum += item.price * item.db;
            
            return item && <tr key={i}>
            <td>{item.name}</td>
            <td>{item.price}</td>
            <td>
                <input value={item.db} 
                    onKeyDown={keyDown} 
                    onChange={(e) => change(e, item.id, category)}/>
            </td>
            <td>{item.price * item.db}</td>
            <td>
                <svg viewBox="0 0 448 512" onClick={() => modifyOrDeleteItem(false, item.id, category)}>
                    <path fill="currentColor" d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z">
                    </path>
                </svg>
            </td>
        </tr>})
        let sumRow = <tr>
            <td colSpan="4" style={{textAlign: "right"}}>{sum}</td>
            <td></td>
        </tr>

        totalSum += sum;

        return <>{itemsRows}{sumRow}</>
    }

    useEffect(() => {
        setItems("pizza")
        setItems("topping")
    }, [cart, data])

    return (
        <div className="cartRoute">
            {
                pizzas.length &&
                <div className="backdrop">
                    <h2>Pizzák</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Egységár</th>
                                <th>db</th>
                                <th>Ár</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                function() {
                                    totalSum = 0;

                                    return renderTableBody(pizzas, "pizza")
                                }()
                            }
                        </tbody>
                    </table>
                </div>
            }
            {
                toppings.length &&
                <div className="backdrop">
                    <h2>Feltétek</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Egységár</th>
                                <th>db</th>
                                <th>Ár</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                function() {
                                    return renderTableBody(toppings, "topping")
                                }()
                            }
                        </tbody>
                    </table>
                </div>
            }
            <div className="backdrop">
                <p>Összesen fizetendő: {totalSum}</p>
            </div>
        </div>
    )
}
