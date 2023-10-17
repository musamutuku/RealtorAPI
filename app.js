const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser')
const { Pool } = require('pg')

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'realtor',
  password: 'musa',
  port: 5432,
});


app.post('/api/submit', async (req, res) => {
  const newName = req.body.userName;
  const newEmail = req.body.userEmail;
  const newPhone = req.body.userPhone;
  const newMessage = req.body.userMessage;
  const houseId = req.body.id;

  try {
    const result = await pool.query('INSERT INTO public.users(username,email,phone,message,houseID) VALUES ($1,$2,$3,$4,$5) RETURNING *', [newName, newEmail, newPhone, newMessage,houseId])
    // const insertedRow = result.rows[0].username;
    res.status(201).json({ loadingMsg: false,returnMsg1: 'Send successfully', returnImg: 'src/assets/images/success_img.png', returnMsg2: 'You will get a feedback after 24 hours', returnColor: 'black' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ loadingMsg: false, returnMsg1: 'An error occcured!', returnImg: 'src/assets/images/error_img.png', returnMsg2: 'Try again later', returnColor: 'brown' });
  }
})

app.get('/api/data', (req, res) => {
  // Query the database using the connection pool
  pool.query('SELECT * FROM apartments', (error, result) => {
    if (error) {
      console.error('Error executing query', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(result.rows);
    }
  });
});

app.get('/api/data1', (req, res) => {
  // Query the database using the connection pool
  pool.query('SELECT * FROM townhouses', (error, result) => {
    if (error) {
      console.error('Error executing query', error);
      res.status(500).json({ error: 'Internal Server Error'});
    } else {
      res.json(result.rows);
    }
  });
});

// get list data from table and return array list(testing)
// app.get('/api/data2', async (req, res) => {
//   try {
//     const { rows } = await pool.query('SELECT price FROM apartments');
//     const data = rows.map(row => row.price);
//     res.json(data);
//     console.log(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
