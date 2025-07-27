const express = require('express');
const http = require ('http');
const cors = require ('cors');
const {Server} = require('socket.io');
const app = express();
require('dotenv').config();
const hotelFetchRoute = require('./routes/fetchHotels')


const server= http.createServer(app);
const io = new Server(server,{
    cors:{origin:"*"}
})
app.use(cors());
app.use(express.json());
app.use('/api/v1',hotelFetchRoute)

server.listen(process.env.PORT,()=>{
    console.log("Backend Started at port 4000");
})

