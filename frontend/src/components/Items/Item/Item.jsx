import './item.css';
import React, { useEffect, useRef } from 'react';
import { putInCart } from '../../../actions/cartActions'
import { selectPizza, selectTopping } from '../../../actions/dataActions'
import { connect } from 'react-redux';

const Item = ({putInCart, selectPizza, selectTopping, item, itemType, key2}) => {

    const itemRef = useRef();
    const observerRef = useRef();
    
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                entries[0].target.style.transform = 'scale(1)'
            } else {
                entries[0].target.style = '';
            }
        })

        observerRef.current = observer;

        if (itemRef.current) {
            observer.observe(itemRef.current);
        }

        return () => {
            observerRef.current.disconnect()
        }
    }, [])


    return (
        <div ref={itemRef} className={itemType} data-id={key2}>
            <img src={"/images/" + itemType + "s/" + item.image} alt="" />
            <div className="dashboard">
                <div>
                    <svg viewBox="0 0 576 512" onClick={
                        (e) => putInCart(itemRef.current, document.querySelector("." + itemType + "s"))
                        }>
                        <path fill="currentColor" d="M504.717 320H211.572l6.545 32h268.418c15.401 0 26.816 14.301 23.403 29.319l-5.517 24.276C523.112 414.668 536 433.828 536 456c0 31.202-25.519 56.444-56.824 55.994-29.823-.429-54.35-24.631-55.155-54.447-.44-16.287 6.085-31.049 16.803-41.548H231.176C241.553 426.165 248 440.326 248 456c0 31.813-26.528 57.431-58.67 55.938-28.54-1.325-51.751-24.385-53.251-52.917-1.158-22.034 10.436-41.455 28.051-51.586L93.883 64H24C10.745 64 0 53.255 0 40V24C0 10.745 10.745 0 24 0h102.529c11.401 0 21.228 8.021 23.513 19.19L159.208 64H551.99c15.401 0 26.816 14.301 23.403 29.319l-47.273 208C525.637 312.246 515.923 320 504.717 320zM408 168h-48v-40c0-8.837-7.163-16-16-16h-16c-8.837 0-16 7.163-16 16v40h-48c-8.837 0-16 7.163-16 16v16c0 8.837 7.163 16 16 16h48v40c0 8.837 7.163 16 16 16h16c8.837 0 16-7.163 16-16v-40h48c8.837 0 16-7.163 16-16v-16c0-8.837-7.163-16-16-16z">
                        </path>
                    </svg>
                </div>
                <div>
                    <svg viewBox="0 0 512 512" onClick={
                        (e) => itemType === "pizza" ? selectPizza(item) : selectTopping(item)
                        }>
                        <path fill="currentColor" d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z">
                        </path>
                    </svg>
                </div>
            </div>
            <div className={itemType + "_info"}>
                <p>
                    {item.name}
                </p>   
                <p>
                    {item.price} Ft
                </p>   
            </div>
        </div>
    )
}

export default connect(null, {putInCart, selectPizza, selectTopping})(Item)