import React from "react";
import "./Checkout.css";
import Subtotal from "./Subtotal";
import { Link } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import CheckoutProduct from "./CheckoutProduct";

function Checkout() {
  const [{basket,user},dispatch] = useStateValue();
  

  return (
    <div className="checkout">
      <div className="checkout__left">
         <Link to='/'>
        <img
          className="checkout__ad"
          src="https://images-na.ssl-images-amazon.com/images/G/02/UK_CCMP/TM/OCC_Amazon1._CB423492668_.jpg"
          alt=""
        />
         </Link>
        <div>
          <h3> Hey {!user ? 'Guest':user.email.replace('@gmail.com','')}!</h3>
          <h1>Your Shopping Basket</h1>

          {basket.map(item => (
            <CheckoutProduct
              id={item.id}
              title={item.title}
              image={item.image}
              price={item.price}
              rating={item.rating}
            />
          ))}

        </div>
       
      </div>

      <div className="checkout__right">
      <Subtotal />
      </div>
    </div>
  );
}

export default Checkout;