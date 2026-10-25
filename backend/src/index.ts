import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
var chat = require( "./route/chat" );
var message = require( "./route/message" );
var error = require( "./middleware/error" );

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use( express.json() );

app.use( "/chat", chat );
app.use( "/message", message );
app.use( error );

app.listen( process.env.PORT || 5000 );