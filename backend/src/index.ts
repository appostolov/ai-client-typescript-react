import express from 'express';
import dotenv from 'dotenv';
var chat = require( "./route/chat" );

dotenv.config();

const app = express();
app.use( express.json() );

app.use( "/chat", chat );

app.listen( process.env.PORT || 5000 );