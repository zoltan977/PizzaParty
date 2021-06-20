import './Toppings.css';
import Topping from './Topping/Topping';
import React, { useState } from 'react';

export default function Toppings({toppings}) {
    
    const [quantityPerPage, setQuantityPerPage] = useState(4 <= toppings.length ? 4 : toppings.length);
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
        if (to + quantityPerPage <= toppings.length) {
            setTo(to + quantityPerPage)
            setFrom(from + quantityPerPage)
        }
        else {
            setTo(toppings.length)
            setFrom(toppings.length - quantityPerPage)
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

        if (Number(e.target.value) > toppings.length)
            e.target.value = toppings.length;

        setQuantityPerPage(Number(e.target.value));
        setFrom(0);
        setTo(Number(e.target.value));
    }

    return (
        <div className="toppings">
            <div className="navigation">
                <span onClick={prev}>{"\u2190"}</span>
                <span>{toppings.length}{"("}<input value={quantityPerPage} onChange={change} onKeyDown={keyDown}/>{")"}/{from + 1}-{to}</span>
                <span onClick={next}>{"\u2192"}</span>
            </div>
            {
                toppings.slice(from, to).map((topping, idx) => <Topping key={topping.id} key2={topping.id} topping={topping}/>)
            }
            <div className="navigation">
                <span onClick={prev}>{"\u2190"}</span>
                <span>{toppings.length}{"("}<input value={quantityPerPage} onChange={change} onKeyDown={keyDown}/>{")"}/{from + 1}-{to}</span>
                <span onClick={next}>{"\u2192"}</span>
            </div>
        </div>
    )
}
