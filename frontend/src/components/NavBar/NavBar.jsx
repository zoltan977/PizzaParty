import './NavBar.css';
import { useContext } from 'react';
import CartContext from './../../context/cart/cartContext';
import DataContext from './../../context/data/dataContext';
import AuthContext from './../../context/auth/authContext';
import { Link } from 'react-router-dom';

export default function NavBar() {

    const {cart} = useContext(CartContext)
    const {data} = useContext(DataContext)
    const {user, logout} = useContext(AuthContext)

    return (
        <div className="NavBar">
            <Link to="/">
                <svg className="hamburger" viewBox="0 0 40 40">
                    <rect className="a" x="0" y="0" width="20" height="2" />
                    <rect className="b" x="0" y="0" width="20" height="2" />
                    <rect className="c" x="0" y="0" width="20" height="2" />
                </svg>
            </Link>
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
                                                    return item;
                                            }).map((element) => element.price)
                                    }
                            }
                            return amount
                            }()
                        }
                    </span>
                </Link>
            </div>
            <Link to="/register">Register </Link>
            <Link to="/login">Login </Link>
            <Link to="/order">Order </Link>
            <Link to="/orders">Orders </Link>
            {user && <span onClick={() => logout()}>Logout </span>}
            {user ? <span>{user.name}</span> : <span> Not logged in!</span>}
        </div>
    )
}
