import React from 'react';
import Pizza from './Pizza/Pizza.jsx';
import './Pizzas.css';

export default function Pizzas({pizzas}) {
    
    //console.log("Pizzas:", pizzas);

    return (
        <div className="Pizzas">
            {
                pizzas.map((pizza, idx) => <Pizza key={idx} key2={idx} pizza={pizza}/>)
            }
        </div>
    )
}
