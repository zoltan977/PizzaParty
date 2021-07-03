import React, {useContext, useState, useEffect} from 'react';
// import CartContext from '../../../context/cart/cartContext';
// import DataContext from '../../../context/data/dataContext';
import {modifyOrDeleteItem} from '../../../actions/cartActions';
import {selectPizza} from '../../../actions/dataActions';
import './PizzaDetails.css';
import { connect } from 'react-redux';

const PizzaDetails = ({selectPizza, modifyOrDeleteItem, cart, selectedPizza}) => {

    const [quantity, setQuantity] = useState(0);
    const [input, setInput] = useState(0);

    const [pizzaDetailsStyle, setPizzaDetailsStyle] = useState({transform: "scale(0)"});
    const [contentClass, setContentClass] = useState("content");

    useEffect(() => {

        setQuantity(selectedPizza ? cart.pizza[selectedPizza.id] || 0 : 0);

        if (selectedPizza)
            setPizzaDetailsStyle({transform: "scale(1)"})

        setContentClass("content")

    }, [selectedPizza, cart]);

    return (
        <div className="PizzaDetails" style={pizzaDetailsStyle}>
            {
                selectedPizza &&
                <>
                    <span className="close" onClick={() => {
                            setPizzaDetailsStyle({transform: "scale(0)"})
                            setTimeout(() => {
                                selectPizza(null)
                            }, 1000);
                        }
                    }>
                        X
                    </span>
            
                    <img src={"/images/pizzas/" + selectedPizza.image} alt="" />
            
                    <div className={contentClass}>
                        <div className="info">
                            <span className="closeInfo" onClick={() => 
                                setContentClass("content hide")}>X</span>
                            <div className="pizzaInfo">
                                <div className="firstColumn">Név:</div>
                                <div>
                                    {selectedPizza.name}
                                </div>   
                                <div className="firstColumn">
                                    Ár:
                                </div>
                                <div>
                                    {selectedPizza.price} Ft
                                </div>
                                <div className="firstColumn">
                                    Leírás:
                                </div>
                                <div>
                                    {selectedPizza.description}
                                </div>
                            </div>
                            <div className="cartInfo">
                                <div>
                                    <svg viewBox="0 0 576 512">
                                        <path fill="currentColor" d="M504.717 320H211.572l6.545 32h268.418c15.401 0 26.816 14.301 23.403 29.319l-5.517 24.276C523.112 414.668 536 433.828 536 456c0 31.202-25.519 56.444-56.824 55.994-29.823-.429-54.35-24.631-55.155-54.447-.44-16.287 6.085-31.049 16.803-41.548H231.176C241.553 426.165 248 440.326 248 456c0 31.813-26.528 57.431-58.67 55.938-28.54-1.325-51.751-24.385-53.251-52.917-1.158-22.034 10.436-41.455 28.051-51.586L93.883 64H24C10.745 64 0 53.255 0 40V24C0 10.745 10.745 0 24 0h102.529c11.401 0 21.228 8.021 23.513 19.19L159.208 64H551.99c15.401 0 26.816 14.301 23.403 29.319l-47.273 208C525.637 312.246 515.923 320 504.717 320zM408 168h-48v-40c0-8.837-7.163-16-16-16h-16c-8.837 0-16 7.163-16 16v40h-48c-8.837 0-16 7.163-16 16v16c0 8.837 7.163 16 16 16h48v40c0 8.837 7.163 16 16 16h16c8.837 0 16-7.163 16-16v-40h48c8.837 0 16-7.163 16-16v-16c0-8.837-7.163-16-16-16z">
                                        </path>
                                    </svg>
                                </div>
                                <div>
                                    <p>A kosárban<span> {quantity} db </span>van</p>
                                    
                                    <p>Kosárhoz adok
                                    <input type="text" value={input} onChange={
                                        (e) => {
                                                if (e.target.value.length > 3)
                                                    e.target.value = e.target.value.slice(0, 3)

                                                if(isNaN(e.target.value))
                                                    e.target.value = 0;

                                                if (Number(e.target.value) < 0)
                                                    e.target.value = 0;

                                                e.target.value = Number(e.target.value)

                                                setInput(e.target.value)
                                            }
                                        }/> 

                                    <span className="db">
                                        db-ot. 
                                    </span>
                                        
                                    <button onClick={
                                        (e) => {
                                                modifyOrDeleteItem(true, selectedPizza.id, "pizza", 
                                                                    Number(input) + Number(quantity));
                                                
                                                setInput(0);
                                            }
                                        } type="button">
                                    
                                            Mehet!
                                    </button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

const mapStateToProps = state => ({
    cart: state.cart,
    selectedPizza: state.data.selectedPizza
})

export default connect(mapStateToProps, {selectPizza, modifyOrDeleteItem})(PizzaDetails)