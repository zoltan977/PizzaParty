import Pizza from './Pizza/Pizza.jsx';
import './Pizzas.css';
import React, { useState } from 'react';
import PizzaDetails from './PizzaDetails/PizzaDetails.jsx';

export default function Pizzas({pizzas}) {

    const [quantityPerPage, setQuantityPerPage] = useState(6 <= pizzas.length ? 6 : pizzas.length);
    const [from, setFrom] = useState(0);
    const [to, setTo] = useState(quantityPerPage);
    const [filteredPizzas, setFilteredPizzas] = useState(pizzas);

    const search = (e) => {
        const filtered = pizzas.filter((p => {
            if (p.name.toUpperCase().includes(e.target.value.toUpperCase()) || e.target.value === "")
                return true
            else 
                return false
        }))

        setFilteredPizzas(filtered)

        setQuantityPerPage(filtered.length)

        setFrom(0)
        setTo(filtered.length)
    }

    const prev = () => {
        if (from >= quantityPerPage) {
            setFrom(from - quantityPerPage)
            setTo(to - quantityPerPage)
        }
        else {
            setFrom(0)
            setTo(quantityPerPage)
        }
    }
    
    const next = () => {
        if (to + quantityPerPage <= filteredPizzas.length) {
            setTo(to + quantityPerPage)
            setFrom(from + quantityPerPage)
        }
        else {
            setTo(filteredPizzas.length)
            setFrom(filteredPizzas.length - quantityPerPage)
        }
    }
    
    const change = (e) => {

        if (e.target.value.length > 3)
            e.target.value = e.target.value.slice(0, 3)

        if (isNaN(e.target.value))
            e.target.value = 1;

        if (Number(e.target.value) < 1)
            e.target.value = 1;

        if (Number(e.target.value) > filteredPizzas.length)
            e.target.value = filteredPizzas.length;

        e.target.value = Number(e.target.value)

        setQuantityPerPage(Number(e.target.value));
        setFrom(0);
        setTo(Number(e.target.value));
    }

    const increaseQuantityPerPage = () => {
        if (quantityPerPage <= filteredPizzas.length -1) {
            setFrom(0);
            setTo(quantityPerPage + 1);
            
            setQuantityPerPage(quantityPerPage + 1)
        }
    }

    const decreaseQuantityPerPage = () => {
        if (quantityPerPage >= 2) {
            setFrom(0);
            setTo(quantityPerPage - 1);
            
            setQuantityPerPage(quantityPerPage - 1)
        }
    }

    return (

        <div className="pizzas">
            <PizzaDetails />
            <div className="search">
                <input type="text" placeholder="search" onChange={(e) => search(e)} />
            </div>
            <div className="navigation">
                <span onClick={prev}>{"\u2190"}</span>
                <span>
                    {filteredPizzas.length}{"("}<input value={quantityPerPage} onChange={change}/>{")"}/
                    {Number(to) === 0 ? 0 : from + 1}-{to}
                    <span onClick={increaseQuantityPerPage}>{"\u2bc5"}</span>
                    <span onClick={decreaseQuantityPerPage}>{"\u2bc6"}</span>
                </span>
                <span onClick={next}>{"\u2192"}</span>
            </div>
            <div className="content">
            {
                filteredPizzas.slice(from, to).map((pizza, idx) => <Pizza key={pizza._id} key2={pizza._id} pizza={pizza}/>)
            }
            </div>
            <div className="navigation">
                <span onClick={prev}>{"\u2190"}</span>
                <span>
                    {filteredPizzas.length}{"("}<input value={quantityPerPage} onChange={change}/>{")"}/
                    {Number(to) === 0 ? 0 : from + 1}-{to}
                    <span onClick={increaseQuantityPerPage}>{"\u2bc5"}</span>
                    <span onClick={decreaseQuantityPerPage}>{"\u2bc6"}</span>
                </span>
                <span onClick={next}>{"\u2192"}</span>
            </div>
        </div>

    )
}
