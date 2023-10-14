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
// app.get('/api/data', (req, res) => {
//   res.json({msg: 'Hello, there'})
// }) 

app.post('/api/submit', async (req, res) => {
  const newName = req.body.userName;
  const newEmail = req.body.userEmail;

  const newPhone = req.body.userPhone;
  const newMessage = req.body.userMessage;

  try {
    const result = await pool.query('INSERT INTO public.users(username,email,phone,message) VALUES ($1,$2,$3,$4) RETURNING *', [newName, newEmail, newPhone, newMessage])
    // const insertedRow = result.rows[0].username;
    res.status(201).json({ returnMsg1: 'Send successfully', returnImg: 'src/assets/images/success_img.png', returnMsg2: 'You will get a feedback after 24 hours', returnColor: 'dark gray'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ returnMsg1: 'An error occcured!', returnImg: 'src/assets/images/error_img.png', returnMsg2: 'Try again later', returnColor: 'brown' });
  }
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
