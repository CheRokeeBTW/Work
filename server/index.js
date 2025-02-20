const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const Pool = require('pg').Pool
require("dotenv").config();
const port = process.env.PORT
const pool = new Pool({
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  password: process.env.DATABASE_PASSWORD,
  user: process.env.DATABASE_USER,
  port: process.env.DATABASE_PORT,
});

app.use(express.json())
app.use(cors());


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:8000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  app.use('/login', (req, res) => {
    res.send({
        token: 'test123'
    })
})

  const getUsers = () => {
    return new Promise(function(resolve, reject) {
      pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if (error) {
          reject(error)
        }
        resolve(results.rows);
      })
    }) 
  }

  app.get('/', (req, res) => {
    getUsers()
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
  })

  //register
  app.post('/register', async (req, res) => {
    try{
      const {username,password} = req.body;
      const result = await pool.query("INSERT INTO users (username, passhash) VALUES ($1,$2) RETURNING *",
        [username,password]
      );
      res.status(201).json(result.rows[0]);
    }
    catch(error){
      console.error(error.message);
      res.status(500).send("Server error");
    }
  });

  app.post('/registerData', async (req,res) => {
    try{
      const {username} = req.body
      const result = await pool.query(`SELECT * FROM users where username = '${username}'`)
      const user = result.rows[0]
      if(!user){
        return res.send({validation:false})
      }
      else{
        res.send({validation: true})
      }
  }
  catch(error){
    console.error(error.message)
    res.status(500).send('Server error')
  }
})

app.post('/RoomPassword', async (req, res) => {
  try{
    const {RoomPass} = req.body;
    const result = await pool.query("INSERT INTO users (username, passhash) VALUES ($1,$2) RETURNING *",
      [username,password]
    );
    res.status(201).json(result.rows[0]);
  }
  catch(error){
    console.error(error.message);
    res.status(500).send("Server error");
  }
})

//login
  app.post('/data', async (req,res) => {
    
    try{
      const {username,password} = req.body
      const result = await pool.query(`SELECT * FROM users where username = '${username}' and passhash = '${password}'`)
      const user = result.rows[0]
      if(!user){
        return res.send({validation:false})
      }
      else{
        res.send({validation: true})
      }
  }
  catch(error){
    console.error(error.message)
    res.status(500).send('Server error')
  }
})

//delete
app.delete('/delete', async (req, res) => {
  try{
    const {username} = req.body;
    console.log(username)
    const result = await pool.query(`UPDATE users SET friends = 'Friend list:' WHERE username = '${username}'`
    );
    res.status(201).json(result.rows[0]);
  }
  catch(error){
    console.error(error.message);
    res.status(500).send("Server error");
  }
})

app.post('/friendss', async (req,res) => {
  try{
    const {username} = req.body
    console.log(username)
    const result = await pool.query(`SELECT * FROM users WHERE username = '${username}'`)
      console.log(result.rows[0])
      return result.rows[0]
  }
  catch(error){
    console.error(error.message)
  }
  })

  app.post('/friends', async (req,res) => {
  try{
    const {friend,username} = req.body
    console.log(username)
    console.log(friend)
    const result = await pool.query(`SELECT * FROM users where username = '${friend}'`)
    const user = result.rows[0]
    if(!user){
      return res.send({validation:false})
    }
    else{
      res.send({validation: true})
      pool.query(`UPDATE users SET friends = friends || ' ${friend}' WHERE username = '${username}'`
      )
    }
}
catch(error){
  console.error(error.message)
}
})

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})