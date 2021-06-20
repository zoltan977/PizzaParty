import Pizza from './Pizza/Pizza.jsx';
import './Pizzas.css';
import React, { useState } from 'react';

export default function Pizzas({pizzas}) {

    const [quantityPerPage, setQuantityPerPage] = useState(6 <= pizzas.length ? 6 : pizzas.length);
    const [from, setFrom] = useState(0);
    const [to, setTo] = useState(quantityPerPage);

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
        if (to + quantityPerPage <= pizzas.length) {
            setTo(to + quantityPerPage)
            setFrom(from + quantityPerPage)
        }
        else {
            setTo(pizzas.length)
            setFrom(pizzas.length - quantityPerPage)
        }
    }
    
    const numbers = "0123456789";
    
    const keyDown = (e) => {
        if (!numbers.includes(e.key) && 
            !e.key.includes("Arrow") && 
            e.key !== "Backspace" && 
            e.key !== "Delete") 
                e.preventDefault();
    }

    const change = (e) => {
        if (e.target.value === "0" || 
            e.target.value === "")
                e.target.value = "1";

        if (Number(e.target.value) > pizzas.length)
            e.target.value = pizzas.length;

        setQuantityPerPage(Number(e.target.value));
        setFrom(0);
        setTo(Number(e.target.value));
    }

    return (

        <div className="pizzas">
            <div className="navigation">
                <span onClick={prev}>{"\u2190"}</span>
                <span>{pizzas.length}{"("}<input value={quantityPerPage} onChange={change} onKeyDown={keyDown}/>{")"}/{from + 1}-{to}</span>
                <span onClick={next}>{"\u2192"}</span>
            </div>
            {
                pizzas.slice(from, to).map((pizza, idx) => <Pizza key={pizza.id} key2={pizza.id} pizza={pizza}/>)
            }
            <div className="navigation">
                <span onClick={prev}>{"\u2190"}</span>
                <span>{pizzas.length}{"("}<input value={quantityPerPage} onChange={change} onKeyDown={keyDown}/>{")"}/{from + 1}-{to}</span>
                <span onClick={next}>{"\u2192"}</span>
        </div>
        </div>

    )
}
