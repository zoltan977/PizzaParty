import './NavBar.css';
import { useContext, useState } from 'react';
import CartContext from './../../context/cart/cartContext';
import DataContext from './../../context/data/dataContext';
import AuthContext from './../../context/auth/authContext';
import { Link, NavLink } from 'react-router-dom';

export default function NavBar() {

    const {cart} = useContext(CartContext)
    const {data} = useContext(DataContext)
    const {user, logout} = useContext(AuthContext)

    const [rect1Class, setRect1Class] = useState("a");
    const [rect2Class, setRect2Class] = useState("b");
    const [rect3Class, setRect3Class] = useState("c");
    
    const [dropDownClass, setDropDownClass] = useState("dropDownMenu");
    

    const burgerClick = (e) => {
        
        if (rect1Class === "a") {

            setRect1Class("ax")
            setRect2Class("bx")
            setRect3Class("cx")

            setDropDownClass("dropDownMenu show")
        } else {
            setRect1Class("a")
            setRect2Class("b")
            setRect3Class("c")

            setDropDownClass("dropDownMenu")
        }

    }

    return (
        <div className="NavBar">

            <div className={dropDownClass}>
                <Link to="/"><span>Home</span></Link>
                {
                    user ?
                    <>
                        <Link to="/order"><span>Order</span></Link>
                        <Link to="/orders"><span>Orders</span></Link>
                    </>
                    :
                    <>
                        <Link to="/register"><span>Register</span></Link>
                        <Link to="/login"><span>Login</span></Link>
                    </>
                }
            </div>

            <div className="icons">
                <div className="hamburger" onClick={burgerClick}>
                    <svg viewBox="0 0 40 40">
                        <rect className={rect1Class} x="0" y="0" width="20" height="2" />
                        <rect className={rect2Class} x="0" y="0" width="20" height="2" />
                        <rect className={rect3Class} x="0" y="0" width="20" height="2" />
                    </svg>
                </div>
                <div className="cart">
                    <Link to="/cart">
                        <svg id="cart" viewBox="0 0 576 512">
                            <path d="M528.12 301.319l47.273-208C578.806 78.301 567.391 64 551.99 64H159.208l-9.166-44.81C147.758 8.021 137.93 0 126.529 0H24C10.745 0 0 10.745 0 24v16c0 13.255 10.745 24 24 24h69.883l70.248 343.435C147.325 417.1 136 435.222 136 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-15.674-6.447-29.835-16.824-40h209.647C430.447 426.165 424 440.326 424 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-22.172-12.888-41.332-31.579-50.405l5.517-24.276c3.413-15.018-8.002-29.319-23.403-29.319H218.117l-6.545-32h293.145c11.206 0 20.92-7.754 23.403-18.681z">
                            </path>
                        </svg>
                        <span>
                            {
                                function() {
                                let amount = 0;
                                for (const categoryKey in cart) {
                                        for (const itemId in cart[categoryKey]) {
                                                amount += Number(cart[categoryKey][itemId]) *
                                                data[categoryKey].filter((item) => {
                                                    if (item.id === Number(itemId))
                                                        return true;
                                                    else
                                                        return false;
                                                }).map((element) => element.price)
                                        }
                                }
                                return amount
                                }()
                            }
                        </span>
                    </Link>
                </div>
            </div>
            <div className="linksAndUser">
                <div className="links">
                    <NavLink to="/" exact={true}>Home </NavLink>
                    {
                        user ?
                        <>
                            <NavLink to="/order">Order </NavLink>
                            <NavLink to="/orders">Orders </NavLink>
                        </>
                        :
                        <>
                            <NavLink to="/register">Register </NavLink>
                            <NavLink to="/login">Login </NavLink>
                        </>
                    }
                </div>
                <div className="userInfo">
                    {user ? <span>{user.name}</span> : <span> Not logged in!</span>}
                    {user && <div className="logout" onClick={() => logout()}>
                        <svg viewBox="0 0 512 512">
                            <path d="M497 273L329 441c-15 15-41 4.5-41-17v-96H152c-13.3 0-24-10.7-24-24v-96c0-13.3 10.7-24 24-24h136V88c0-21.4 25.9-32 41-17l168 168c9.3 9.4 9.3 24.6 0 34zM192 436v-40c0-6.6-5.4-12-12-12H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h84c6.6 0 12-5.4 12-12V76c0-6.6-5.4-12-12-12H96c-53 0-96 43-96 96v192c0 53 43 96 96 96h84c6.6 0 12-5.4 12-12z">
                            </path>
                        </svg>
                    </div>}
                </div>
            </div>
        </div>
    )
}
