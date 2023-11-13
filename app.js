const express = require('express')
var cors = require('cors')
const multer = require("multer")
const path = require("path");
const bodyParser = require('body-parser')
const { Pool } = require('pg')
const fs = require('fs')

const app = express()
app.use(cors())
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
const port = 3000

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../RealtorAPI/assets/houses"); // Save uploaded files to the 'assets' folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

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
  pool.query('SELECT * FROM townhouses', (error, result) => {
    if (error) {
      console.error('Error executing query', error);
      res.status(500).json({ error: 'Internal Server Error'});
    } else {
      res.json(result.rows);
    }
  });
});



app.get('/api/data2', (req, res) => {
  pool.query('SELECT * FROM mobilehomes', (error, result) => {
    if (error) {
      console.error('Error executing query', error);
      res.status(500).json({ error: 'Internal Server Error'});
    } else {
      res.json(result.rows);
    }
  });
});



app.get('/api/data3', (req, res) => {
  pool.query('SELECT * FROM farmhomes', (error, result) => {
    if (error) {
      console.error('Error executing query', error);
      res.status(500).json({ error: 'Internal Server Error'});
    } else {
      res.json(result.rows);
    }
  });
});



app.get('/api/data4', (req, res) => {
  pool.query('SELECT * FROM ranchhouses', (error, result) => {
    if (error) {
      console.error('Error executing query', error);
      res.status(500).json({ error: 'Internal Server Error'});
    } else {
      res.json(result.rows);
    }
  });
});




app.get('/api/users', (req, res) => {
  // Query the database using the connection pool
  pool.query('SELECT * FROM users', (error, result) => {
    if (error) {
      console.error('Error executing query', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(result.rows);
    }
  });
});


app.get('/api/apartments', (req, res) => {
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




app.post('/api/addNew/:category', upload.single("image"), async (req, res) => {
  console.log(req.file);
  const {category} = req.params;
  const houseName = req.body.houseName;
  const imagesrc = 'src/assets/images/houses/' + req.file.filename;
  const description = req.body.description;
  const price = req.body.price; 

  //saving the image file to different destinations
  const imgfile = req.file;
  saveFile(imgfile, '../RealtorApp/src/assets/images/houses')
  saveFile(imgfile, '../RealtorAdmin/src/assets/images/houses')

  try {
    const result = await pool.query(`INSERT INTO public.${category}(houseName,imagesrc,description,price) VALUES ($1,$2,$3,$4) RETURNING *`, [houseName, imagesrc, description, price])
    const insertedRow = result.rows[0].username;
    res.status(201).json({ Msg: 'Added successfully!'});
  } catch (error) {
    console.error(error); 
    res.status(500).json({ Msg: 'An error occcured!'});
  }
});

function saveFile(imgfile, destination){
  filepath = path.join(destination, imgfile.filename);
  fs.copyFileSync(imgfile.path, filepath);
}

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


app.listen(port, '0.0.0.0', () => {
  console.log(`App listening on port ${port}`)
})
