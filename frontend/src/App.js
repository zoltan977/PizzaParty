import './App.css';
import NavBar from './components/NavBar/NavBar';
import Toppings from './components/Toppings/Toppings.jsx';
import Pizzas from './components/Pizzas/Pizzas.jsx'
import { useEffect, useState, useCallback } from 'react';

function App() {

  const initialData = {toppings: [], pizzas: []};
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [mainImgStyle, setMainImgStyle] = useState({})
  const [menuImgStyle, setMenuImgStyle] = useState({})
  const [introductionStyle, setIntroductionStyle] = useState({})

  useEffect(() => {

    setLoading(true);
    setData(initialData);

    fetch("http://localhost:8000/data")
    .then(r => r.json())
    .then(d => setData(d))
    .catch(err => {
        console.log(err);
        setData(null);
    })
    .finally(() => {
      setLoading(false);
    });

  }, [])

  const mainImgRef = useCallback((node) => {
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            setMainImgStyle({transform: 'scale(1)'})
        } else {
            setMainImgStyle({})
        }
    })

    if (node)
        observer.observe(node)
}, [])

const menuImgRef = useCallback((node) => {
  const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
          setMenuImgStyle({transform: 'scale(1)'})
      } else {
          setMenuImgStyle({})
      }
  })

  if (node)
      observer.observe(node)
}, [])

const introductionRef = useCallback((node) => {
  const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        // console.log("entries[0]", entries[0])
          setIntroductionStyle({transform: 'scale(1)'})
      } else {
          setIntroductionStyle({})
      }
  })

  if (node)
      observer.observe(node)
}, [])

  
  return (
    <div className="App" style={{backgroundImage: 'url("background.svg")', backgroundSize: 'contain'}}>
      <NavBar/>

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
                    {data.pizzas.length ? <Pizzas pizzas={data.pizzas}/> : <p> No pizzas </p>}
                  </div>

                  <div className="toppingsContainer">
                    <h2>Toppings</h2>
                    {data.toppings.length ? <Toppings toppings={data.toppings}/> : <p> No toppings </p>}
                  </div>
                </div>
              </div>

                
            </div>
      }
      
    </div>
  );
}

export default App;
