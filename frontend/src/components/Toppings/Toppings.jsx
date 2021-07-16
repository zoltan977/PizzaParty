import './Toppings.css';
import Topping from './Topping/Topping';
import React, { useState } from 'react';
import ToppingDetails from './ToppingDetails/ToppingDetails';
import Navigation from '../Navigation/navigation';

export default function Toppings({toppings}) {
    
    const [quantityPerPage, setQuantityPerPage] = useState(4 <= toppings.length ? 4 : toppings.length);
    const [from, setFrom] = useState(0);
    const [to, setTo] = useState(quantityPerPage);
    const [filteredToppings, setFilteredToppings] = useState(toppings);

    const search = (e) => {
        const filtered = toppings.filter((t => {
            if (t.name.toUpperCase().includes(e.target.value.toUpperCase()) || e.target.value === "")
                return true
            else 
                return false
        }))

        setFilteredToppings(filtered)

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
        if (to + quantityPerPage <= filteredToppings.length) {
            setTo(to + quantityPerPage)
            setFrom(from + quantityPerPage)
        }
        else {
            setTo(filteredToppings.length)
            setFrom(filteredToppings.length - quantityPerPage)
        }
    }
    
    const change = (e) => {

        if (e.target.value.length > 3)
            e.target.value = e.target.value.slice(0, 3)

        if(isNaN(e.target.value))
            e.target.value = 1;

        if (Number(e.target.value) < 1)
            e.target.value = 1;

        if (Number(e.target.value) > filteredToppings.length)
            e.target.value = filteredToppings.length;

        e.target.value = Number(e.target.value)

        setQuantityPerPage(Number(e.target.value));
        setFrom(0);
        setTo(Number(e.target.value));
    }

    const increaseQuantityPerPage = () => {
        if (quantityPerPage <= filteredToppings.length -1) {
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
        <div className="toppings">
            <ToppingDetails />
            <div className="search">
                <input type="text" placeholder="search" onChange={(e) => search(e)} />
            </div>
            <Navigation props = {{prev, next, data: filteredToppings, 
                quantityPerPage, change, to, from, 
                increaseQuantityPerPage, decreaseQuantityPerPage}} />
            <div className="content">
            {
                filteredToppings.slice(from, to).map((topping, idx) => <Topping key={topping._id} key2={topping._id} topping={topping}/>)
            }
            </div>
            <Navigation props = {{prev, next, data: filteredToppings, 
                quantityPerPage, change, to, from, 
                increaseQuantityPerPage, decreaseQuantityPerPage}} />
        </div>
    )
}
