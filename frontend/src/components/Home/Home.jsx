import './Home.css';
import React, { useRef, useEffect } from 'react';
import Pizzas from './../Pizzas/Pizzas';
import Toppings from './../Toppings/Toppings';
import {connect} from 'react-redux';
import { PropTypes } from 'prop-types';

const Home = ({loading, data}) => {

    const observerRef= useRef()

    const mainImgRef= useRef()
    const menuImgRef= useRef()
    const introductionRef= useRef()

 
    
    useEffect(() => {

      const observer = new IntersectionObserver(entries => {

        for (const entry of entries) {
          if (entry.isIntersecting) {
              entry.target.style.transform = 'scale(1)'
          } else {
              entry.target.style = ''
          }
        }
      })

      observerRef.current = observer

      if (mainImgRef.current && menuImgRef.current && introductionRef.current) {
        observer.observe(mainImgRef.current)
        observer.observe(menuImgRef.current)
        observer.observe(introductionRef.current)
      }
      
      
      return () => {
        observerRef.current.disconnect()
      }
    }, [loading])


    return (
        <div className="Home">
        { loading ? <p>Loading</p>
          : data === null ? 
              <h3>Data fetch error</h3>
              :  
              <div className="mainContainer">

                <div className="head" style={{backgroundImage: 'url("head.jpg")', backgroundSize: 'cover'}}>
                    <img className="logo" src="logo.png" alt="" />

                    <h1>
                        Pizza Party Étterem
                    </h1>
                </div>

                <div className="firstPart">
                  <img className="mainImage" ref={mainImgRef} style={{transform: "scale(0)"}} src="mainImage.jpg" alt="" />

                  <p className="introduction" ref={introductionRef} style={{transform: "scale(0)"}}>
                    A Party Pizzériát 1997-ben nyitottuk, többé-kevésbé családi vállalkozás keretében. Elsősorban a lakosság "pizzaigényeit" szerettük volna kielégíteni, de a környékbeli falvakból és a közelebbi városokból is sikerült már törzsvendékeket szereznünk az elmult másfél évtizedben. Gazdaságadta lehetőségekhez, és Kedves Vendégeink pénztárcájához igazodva megpróbáltunk az árszínvonal arany középútján maradni, természetesen maximális minőség mellett. Minden erőnkből azon dolgozunk, hogy aki tőlünk távozik, jó érzéssel- véleménnyel, és nem utolsó sorben tele hassal tegye!
                  </p>
                </div>

                <div className="secondPart">
                  <img className="menuImage" ref={menuImgRef} style={{transform: "scale(0)"}} src="menuImage.png" alt="" />

                  <div className="pizzasAndToppings">
        
                    <div className="pizzasContainer">
                      <h2>Pizzas</h2>
                      {data.pizza.length ? <Pizzas pizzas={data.pizza}/> : <p className="warning"> No pizzas </p>}
                    </div>

                    <div className="toppingsContainer">
                      <h2>Toppings</h2>
                      {data.topping.length ? <Toppings toppings={data.topping}/> : <p className="warning"> No toppings </p>}
                    </div>
                  </div>
                </div>

                  
              </div>
        }
            
        </div>
    )
}

// Home.propTypes = {
//   data: PropTypes.object.isRequired,
//   loading: PropTypes.bool.isRequired
// }

const mapStateToProps = state => ({
  data: state.data.data,
  loading: state.data.loading
})

export default connect(mapStateToProps)(Home)