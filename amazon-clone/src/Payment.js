import React,{useState,useEffect} from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import CheckoutProduct from './CheckoutProduct';
import { useStateValue } from './StateProvider'
import CurrencyFormat from "react-currency-format";
import { getBasketTotal } from "./reducer";
import "./Payment.css"
import {CardElement, useStripe, useElements} from "@stripe/react-stripe-js";
import axios from './axios';
import { db, auth} from "./firebase";




function Payment() {
    const [{ basket, user }, dispatch] = useStateValue();
    const history = useNavigate();

    const stripe = useStripe();
    const elements = useElements();

    const [succeeded, setSucceeded] = useState(false);
    const [processing, setProcessing] = useState("");
    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [paymentIntent, setPaymentIntent] = useState(true);
    const [clientSecret, setClientSecret] = useState(true);

    useEffect(() => {
        // generate the special stripe secret which allows us to charge a customer
        const getClientSecret = async () => {
            const response = await axios({
                method: 'post',

                // Stripe expects the total in a currencies subunits
                url: `/payments/create?total=${getBasketTotal(basket) * 100}`
            });
            
            setClientSecret(response.data.paymentintent.client_secret)
            
            setPaymentIntent(response.data.paymentintent)
        }

        getClientSecret();
    }, [basket])

    
    console.log('👱', user)
    console.log('paymentintent >>>',paymentIntent)
    console.log('clientsecret >>>',clientSecret)
   
    

    const handleSubmit = async (event) => {
        // do all the fancy stripe stuff...
        event.preventDefault();
        setProcessing(true);
    

        const payload = await stripe.confirmCardPayment(paymentIntent.client_secret, {
            payment_method: {
                
                card: elements.getElement(CardElement),
                billing_details: {
                    name : user.email,
                    address: {
                        line1: '510 Townsend St',
                        postal_code: '98140',
                        city: 'San Francisco',
                        state: 'CA',
                        country: 'US',
                      },
                }
            
            }
           
        }).then(({ id, amount, created, error }) => {
            if(error) {
              console.log('error>>>>',error)
             } else {
               db.collection('users') 
                .doc(user?.uid)
                .collection('orders')
                .doc(id) // destructured id from paymentIntent object
                .set({
                   basket: basket,
                   amount : paymentIntent.amount, // destructured amount from paymentIntent object
                   created: paymentIntent.created // destructured created from paymentIntent object
                  })
       
                setSucceeded(true);
                setError(null)
                setProcessing(false)
                dispatch({
                     type: 'EMPTY_BASKET'
                })
       
                history('/orders')
             }
       })

    }

    const handleChange = event => {
        // Listen for changes in the CardElement
        // and display any errors as the customer types their card details
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "");
    }
  return (
    <div className='payment'>
    <div className='payment__container'>
        <h1>
            Checkout (
                <Link to="/checkout">{basket?.length} items</Link>
                )
        </h1>


        {/* Payment section - delivery address */}
        <div className='payment__section'>
            <div className='payment__title'>
                <h3>Delivery Address</h3>
            </div>
            <div className='payment__address'>
                <p>{user?.email}</p>
                <p>123 React Lane</p>
                <p>Los Angeles, CA</p>
            </div>
        </div>

        {/* Payment section - Review Items */}
        <div className='payment__section'>
            <div className='payment__title'>
                <h3>Review items and delivery</h3>
            </div>
            <div className='payment__items'>
                
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
    

        {/* Payment section - Payment method */}
    <div className='payment__section'>

        <div className='payment__title'>
                <h3>Payment Method</h3>
        </div>

    <div className='payment__details'>
     <form onSubmit={handleSubmit}>
 
         
        <div className='payment_priceContainer'>
         <CurrencyFormat
          renderText={(value) => (
         <h5>Order Total: {value}</h5>
         )}
        decimalScale={2}
        value={getBasketTotal(basket)}
        displayType={"text"}
        thousandSeparator={true}
        prefix={"$"}
        />
        </div>
         <br></br>
         <p>Enter your card Details Here:</p>
         <br></br>
        <CardElement onChange={handleChange}/>
        <br></br>

        <button disabled={processing || disabled || succeeded}>
        <span>{processing ? "Processing" : "Buy Now"}</span>
        </button>
      {error && <div>{error}</div>}
     </form>
    
    </div>
    

    </div>
    </div>
</div>
)
}



export default Payment