import './App.css';
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Home from "./Home";
import Header from './Header';
import Checkout from './Checkout';
import Login from './Login';
import Orders from './Orders';
import React, { useEffect } from 'react';
import { useStateValue } from './StateProvider';
import { auth } from './firebase';
import Payment from './Payment';
import {loadStripe} from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"

const promise = loadStripe(
  "pk_test_51Lc5wFSBa7m1JZpny38A4tm84FqXbEncoJbm3SCKN7A0DI9bLtelhvhcQ7jwd6wADYFWtXPVtLgq3bdBUc8mkANd00wh7C129m"
);



function App() {
 const [{},dispatch]=useStateValue();

 useEffect(()=>{
 auth.onAuthStateChanged(authUser => {
  if(authUser){
    dispatch({type: 'SET_USER', user: authUser})
  }
  else{
    dispatch({type: 'SET_USER',user:null})
  }
}
)},[])

  return (
  <div className="App">
    <BrowserRouter>
     <Header />
       <Routes>
          <Route path="/orders" element={<Orders />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout" element={<Checkout />} />

          <Route path="/payment" element={
          <Elements stripe={promise}>
          <Payment />
          </Elements>
          }/>
          
          <Route path="/" element={<Home />} />
        </Routes>
    </BrowserRouter>
   </div>
    
  );
}

export default App;
