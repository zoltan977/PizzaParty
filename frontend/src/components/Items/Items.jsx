import './Items.css';
import Item from './Item/Item.jsx';
import React, { useState } from 'react';
import ItemDetails from './ItemDetails/ItemDetails.jsx';
import Navigation from '../Navigation/navigation.jsx';

export default function Items({items, itemType}) {

    const defaultQuantityPerPage = itemType === "pizza" ? 6 : 4;
    const [quantityPerPage, setQuantityPerPage] = useState(defaultQuantityPerPage <= items.length ? defaultQuantityPerPage : items.length);
    const [from, setFrom] = useState(0);
    const [to, setTo] = useState(quantityPerPage);
    const [filteredItems, setFilteredItems] = useState(items);

    const search = (e) => {
        const filtered = items.filter((p => {
            if (p.name.toUpperCase().includes(e.target.value.toUpperCase()) || e.target.value === "")
                return true
            else 
                return false
        }))

        setFilteredItems(filtered)

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
        if (to + quantityPerPage <= filteredItems.length) {
            setTo(to + quantityPerPage)
            setFrom(from + quantityPerPage)
        }
        else {
            setTo(filteredItems.length)
            setFrom(filteredItems.length - quantityPerPage)
        }
    }
    
    const change = (e) => {

        if (e.target.value.length > 3)
            e.target.value = e.target.value.slice(0, 3)

        if (isNaN(e.target.value))
            e.target.value = 1;

        if (Number(e.target.value) < 1)
            e.target.value = 1;

        if (Number(e.target.value) > filteredItems.length)
            e.target.value = filteredItems.length;

        e.target.value = Number(e.target.value)

        setQuantityPerPage(Number(e.target.value));
        setFrom(0);
        setTo(Number(e.target.value));
    }

    const increaseQuantityPerPage = () => {
        if (quantityPerPage <= filteredItems.length -1) {
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

        <div className={itemType + "s"}>
            <ItemDetails itemType={itemType} />
            <div className="search">
                <input type="text" placeholder="search" onChange={(e) => search(e)} />
            </div>
            <Navigation props = {{prev, next, data: filteredItems, 
                quantityPerPage, change, to, from, 
                increaseQuantityPerPage, decreaseQuantityPerPage}} />
            <div className="content">
            {
                filteredItems.slice(from, to).map(item => <Item key={item._id} key2={item._id} item={item} itemType={itemType}/>)
            }
            </div>
            <Navigation props = {{prev, next, data: filteredItems, 
                quantityPerPage, change, to, from, 
                increaseQuantityPerPage, decreaseQuantityPerPage}} />
        </div>

    )
}
