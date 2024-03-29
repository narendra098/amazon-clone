const functions = require("firebase-functions");
const express = require("express")
const cors = require("cors");
const stripe = require("stripe")("sk_test_51Lc5wFSBa7m1JZpneIHcPC9V2jF8EiKl3oVfNKp0sPKAzBIHsSzvPoA4iaeL84buoiaPDinj8FatoxzEHO9zfbKZ00N3h0Abub");

// API 

// API CONFIG

const app = express();



// MIDDLE WARES 
app.use(cors());

app.use(express.json());




// API ROUTES 
app.get('/',(request,response)=>response.status(200).send('hello world'))

app.post("/payments/create",async (request, response)=>{
    const total = request.query.total;
  
    console.log("Payment Request Recieved BOOM!!! for this amount >>> ", total);
  
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total, // subunits of the currency
      currency: "usd",
      payment_method_types: ['card'],
     
      description : 'payment successful',
    
    })

   console.log("pi>>>",paymentIntent.id)
   console.log("cs>>>",paymentIntent.client_secret)
  
    // OK - Created
    response.status(200).send({
      paymentintent : paymentIntent,
    });
    
  });
 

// LISTEN COMMAND 
exports.api = functions.https.onRequest(app)
