import "./NavBar.css";
import { useState, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { logout, setUser } from "../../actions/authActions";
import ContentEditable from "../ContentEditable/ContentEditable";
import httpClient from "axios";

//Main navigation: top bar
const NavBar = ({ logout, setUser, user, cart, data }) => {
  const [rect1Class, setRect1Class] = useState("a");
  const [rect2Class, setRect2Class] = useState("b");
  const [rect3Class, setRect3Class] = useState("c");

  const [dropDownClass, setDropDownClass] = useState("dropDownMenu");

  const burgerClick = (e) => {
    if (rect1Class === "a") {
      setRect1Class("ax");
      setRect2Class("bx");
      setRect3Class("cx");

      setDropDownClass("dropDownMenu show");
    } else {
      setRect1Class("a");
      setRect2Class("b");
      setRect3Class("c");

      setDropDownClass("dropDownMenu");
    }
  };

  const callGoogle = async () => {
    try {
      const res = await httpClient.get("/api/get_auth_info");

      const { authUrl } = res.data;

      window.location.href = authUrl;
    } catch (error) {
      console.log("Get auth url error: ", error.response.data);
    }
  };

  const sendNameChangeRequest = async (newName) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await httpClient.post(
        "/api/name_change",
        { newName },
        config
      );

      if (!res.data.success) logout();
      else {
        console.log("name change happened: ", newName);
        setUser({ ...user, name: newName })
      }
    } catch (err) {
      console.log("name change error: ", err.response.data);
      if (err?.response?.data?.msg && err.response.data.msg === "Authentication error")
        logout();
    }
  };

  const currentTimeout = useRef();
  const nameChange = (value) => {
    clearTimeout(currentTimeout.current);

    currentTimeout.current = setTimeout(() => {
      sendNameChangeRequest(value);
    }, 2000);
  };

  return (
    <div className="NavBar">
      <div className={dropDownClass}>
        <Link to="/">
          <span>Home</span>
        </Link>
        {user ? (
          <>
            <Link to="/order">
              <span>Új megrenelés</span>
            </Link>
            <Link to="/orders">
              <span>Megrendelések</span>
            </Link>
            <Link to="/booking">
              <span>Új asztalfoglalás</span>
            </Link>
            <Link to="/bookings">
              <span>Asztalfoglalások</span>
            </Link>
          </>
        ) : (
          <>
            <Link to="/register">
              <span>Regisztráció</span>
            </Link>
            <Link to="/login">
              <span>Belépés</span>
            </Link>
          </>
        )}
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
              <path d="M528.12 301.319l47.273-208C578.806 78.301 567.391 64 551.99 64H159.208l-9.166-44.81C147.758 8.021 137.93 0 126.529 0H24C10.745 0 0 10.745 0 24v16c0 13.255 10.745 24 24 24h69.883l70.248 343.435C147.325 417.1 136 435.222 136 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-15.674-6.447-29.835-16.824-40h209.647C430.447 426.165 424 440.326 424 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-22.172-12.888-41.332-31.579-50.405l5.517-24.276c3.413-15.018-8.002-29.319-23.403-29.319H218.117l-6.545-32h293.145c11.206 0 20.92-7.754 23.403-18.681z"></path>
            </svg>
            <span>
              {(function () {
                //Counting total sum of the cart
                //Based on quantities in cart and prices in the database
                let amount = 0;
                for (const categoryKey in cart) {
                  for (const itemId in cart[categoryKey]) {
                    amount +=
                      Number(cart[categoryKey][itemId]) *
                      data[categoryKey]
                        .filter((item) => {
                          if (item._id.toString() === itemId.toString())
                            return true;
                          else return false;
                        })
                        .map((element) => element.price);
                  }
                }
                return amount;
              })()}
            </span>
          </Link>
        </div>
      </div>
      <div className="linksAndUser">
        <div className="links">
          <NavLink to="/" exact={true}>
            Home{" "}
          </NavLink>
          {user ? (
            <>
              <span className="loggedIn">
                Megrendelés
                <div className="order">
                  <NavLink to="/order">Új megrendelés</NavLink>
                  <NavLink to="/orders">Megrendelések </NavLink>
                </div>
              </span>
              <span className="loggedIn">
                Asztalfoglalás
                <div className="booking">
                  <NavLink to="/booking">Új asztalfoglalás</NavLink>
                  <NavLink to="/bookings">Asztalfoglalások</NavLink>
                </div>
              </span>
            </>
          ) : (
            <>
              <NavLink to="/register">Regisztráció</NavLink>
              <NavLink to="/login">Belépés</NavLink>
            </>
          )}
        </div>
        <div className="userInfo">
          {user && user.photo !== "no-image.png" && (
            <img src={user.photo} alt="" />
          )}
          {user ? (
            <Link to="/profile">
              <ContentEditable onChange={nameChange}>
                <span className="userName">{user.name}</span>
              </ContentEditable>
            </Link>
          ) : (
            <span className="notLoggedIn" onClick={callGoogle}>
              Belépés
              <img src="google.png" alt="" />
              -al!
            </span>
          )}
          {user && (
            <div className="logout" onClick={() => logout()}>
              <svg viewBox="0 0 512 512">
                <path d="M497 273L329 441c-15 15-41 4.5-41-17v-96H152c-13.3 0-24-10.7-24-24v-96c0-13.3 10.7-24 24-24h136V88c0-21.4 25.9-32 41-17l168 168c9.3 9.4 9.3 24.6 0 34zM192 436v-40c0-6.6-5.4-12-12-12H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h84c6.6 0 12-5.4 12-12V76c0-6.6-5.4-12-12-12H96c-53 0-96 43-96 96v192c0 53 43 96 96 96h84c6.6 0 12-5.4 12-12z"></path>
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  cart: state.cart,
  data: state.data.data,
  user: state.auth.user,
});

export default connect(mapStateToProps, { logout, setUser })(NavBar);
