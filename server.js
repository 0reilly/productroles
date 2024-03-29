require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const db = require("./db");
const path = require("path")



const app = express();


app.use(cors());
app.use(express.static('.'));

const YOUR_DOMAIN = '';

app.use(express.json())


app.use(express.static("client/build"));
const stripe = require('stripe')(process.env.SECRET);

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "client/build")));

}

app.post("/create-payment-intent", async (req, res) => {
    console.log(req.body.items[0].price)
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.items[0].price,
      currency: "usd"
    });
    res.send({
      clientSecret: paymentIntent.client_secret
    });
    console.log(paymentIntent)
  });




  app.get('/*', function(req, res) {
      console.log(__dirname)
    res.sendFile(path.join(__dirname, '/client/build/index.html'), function(err) {

      if (err) {
        res.status(500).send(err)
      }


    })
  })
  app.get('/add-job', function(req, res) {
    console.log(__dirname)
  res.sendFile(path.join(__dirname, '/client/build/index.html'), function(err) {

    if (err) {
      res.status(500).send(err)
    }


  })
})

//Get all jobs
app.get("/api/v1/jobs", async (req, res) => {
    try {
        const results = await db.query("select * from jobs");
    res.status(200).json({
        status: "success",
        results: results.rows.length,
        data: {
            jobs: results.rows
        },
    });

    } catch(err){
        console.log(err)
    }


});

//Get induvidual job
app.get("/api/v1/jobs/:id", async (req, res) => {
    try{
        const job = await db.query("select * from jobs where id = $1", [req.params.id]);
        res.status(200).json({
            status: "success",
            data: {
                job: job.rows[0],
            }
        })
    }
    catch(err){
        console.log(err)
    }

});

//Create a job
app.post("/api/v1/jobs", async (req, res) =>{
    try{

        const results = await db.query("INSERT INTO jobs (name, pay, description, link, primary_tag, color) values ($1, $2, $3, $4, $5, $6) returning *", [req.body.name, req.body.pay, req.body.description, req.body.link, req.body.primary_tag, req.body.color])
        res.status(201).json({
            status: "success",
            data: {
                job: results.rows[0]
            }
        })
    }catch(err){
        console.log(err);
    }

});

//add email
app.post("/api/v1/jobs/email", async (req, res) =>{
    try{
        const customer = await stripe.customers.create({
            email: req.body.email,
            description: req.body.description,
        });

        const results = await db.query("INSERT INTO subscribers (email) values ($1) returning *", [req.body.email])
        res.status(201).json({
            status: "success",
            data: {
                email: results.rows[0].email
            }
        })
    }catch(err){
        console.log(err);
    }

});


const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`server is up and running on ${port}`);

});
