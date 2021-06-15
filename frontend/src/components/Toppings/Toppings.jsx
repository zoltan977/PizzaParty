import React from 'react';
import './Toppings.css';
import Topping from './Topping/Topping';

export default function Toppings({toppings}) {
    
    //console.log("Toppings:", toppings);

    return (
        <div className="Toppings">
            {
                toppings.map((topping, idx) => <Topping key={idx} key2={idx} topping={topping}/>)
            }
        </div>
    )
}
