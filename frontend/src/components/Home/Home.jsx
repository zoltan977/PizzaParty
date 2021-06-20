import React, { useState, useContext, useCallback, useEffect, useRef } from 'react';
import Pizzas from './../Pizzas/Pizzas';
import Toppings from './../Toppings/Toppings';
import DataContext from './../../context/data/dataContext';
import './Home.css';

export default function Home() {

    const [mainImgStyle, setMainImgStyle] = useState({})
    const [menuImgStyle, setMenuImgStyle] = useState({})
    const [introductionStyle, setIntroductionStyle] = useState({})

    const {data, loading} = useContext(DataContext)

    const observerRef1 = useRef()
    const observerRef2 = useRef()
    const observerRef3 = useRef()

    const mainImgRef = useCallback((node) => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setMainImgStyle({transform: 'scale(1)'})
            } else {
                setMainImgStyle({})
            }
        })
    
        if (node) {
            observer.observe(node)
            observerRef1.current = observer
        }
    }, [])
    
    const menuImgRef = useCallback((node) => {
      const observer = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting) {
              setMenuImgStyle({transform: 'scale(1)'})
          } else {
              setMenuImgStyle({})
          }
      })
    
      if (node) {
        observer.observe(node)
        observerRef2.current = observer
      }
    }, [])
    
    const introductionRef = useCallback((node) => {
      const observer = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting) {
              setIntroductionStyle({transform: 'scale(1)'})
          } else {
              setIntroductionStyle({})
          }
      })
    
      if (node) {
        observer.observe(node)
        observerRef3.current = observer
      }
    }, [])

    useEffect(() => {
      return () => {
        observerRef1.current.disconnect()
        observerRef2.current.disconnect()
        observerRef3.current.disconnect()
      }
    }, [])

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
                  <img ref={mainImgRef} style={mainImgStyle} className="mainImage" src="mainImage.jpg" alt="" />

                  <p ref={introductionRef} style={introductionStyle} className="introduction">
                    A Party Pizzériát 1997-ben nyitottuk, többé-kevésbé családi vállalkozás keretében. Elsősorban a lakosság "pizzaigényeit" szerettük volna kielégíteni, de a környékbeli falvakból és a közelebbi városokból is sikerült már törzsvendékeket szereznünk az elmult másfél évtizedben. Gazdaságadta lehetőségekhez, és Kedves Vendégeink pénztárcájához igazodva megpróbáltunk az árszínvonal arany középútján maradni, természetesen maximális minőség mellett. Minden erőnkből azon dolgozunk, hogy aki tőlünk távozik, jó érzéssel- véleménnyel, és nem utolsó sorben tele hassal tegye!
                  </p>
                </div>

                <div className="secondPart">
                  <img ref={menuImgRef} style={menuImgStyle} className="menuImage" src="menuImage.png" alt="" />

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
