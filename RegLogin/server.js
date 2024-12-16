const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const knex = require('knex');
const cors = require('cors');
const twilio = require('twilio');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'root',
        database: 'majorProj',
        port : 5432
    }
})


const app = express();

let intialPath = path.join(__dirname, "public");

app.use(bodyParser.json());
app.use(express.static(intialPath));
app.use(cors());

//use twilio here



// Initialize the Twilio client


app.get('/', (req, res) => {
    res.sendFile(path.join(intialPath, "login.html"));
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(intialPath, "login.html"));
})

app.get('/register', (req, res) => {
    res.sendFile(path.join(intialPath, "register.html"));
})

app.post('/register-user', (req, res) => {
    const { name, email, password } = req.body;

    if(!name.length || !email.length || !password.length){
        res.json('fill all the fields');
    } else{
        db("users").insert({
            name: name,
            email: email,
            password: password
        })
        .returning(["name", "email"])
        .then(data => {
            res.json(data[0])
        })
        .catch(err => {
            if(err.detail.includes('already exists')){
                res.json('email already exists');
            }
        })
    }
})

app.post('/login-user', (req, res) => {
    const { email, password } = req.body;

    db.select('name', 'email')
    .from('users')
    .where({
        email: email,
        password: password
    })
    .then(data => {
        if(data.length){
            res.json(data[0]);
        } else{
            res.json('email or password is incorrect');
        }
    })
})

app.post('/ordersBills',(req,res)=>{
    const orders =req.body.order;
    const emailid =req.body.email;
    const bills = req.body.bill;
    res.json(orders + emailid +bills)

    db('users')
        .where({ email: emailid })
        .update({
            orders: orders,
            bills:bills
        })
        .returning(['name', 'email', 'orders','bills']) // Return updated fields
        .then(data => {
            if (data.length) {
                return res.json({
                    message: 'Successfully saved orders',
                });
            } else {
                return res.status(404).json('User not found');
            }
        })
        .catch(err => {
            if (!res.headersSent) { // Check if headers have been sent
                return res.status(500).json({ error: 'Error occurred' });
            }
        });
})

app.get('/getOrdersBills', (req, res) => {
    const email = req.query.email; // Retrieve email from query parameter

    db('users')
    .select('orders', 'bills') // Select both orders and bills columns
    .where({ email })
    .then(data => {
        if (data.length) {
            res.json({
                orders: data[0].orders,
                bills: data[0].bills
            }); // Return both orders and bills
        } else {
            res.status(404).json({ error: 'No data found for this email' });
        }
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    });
});

//
app.post('/send-whatsapp', (req, res) => {
   
});
//


app.listen(3000, (req, res) => {
    console.log('listening on port 3000......')
})