import { Request, Response } from 'express';

module.exports = function( error: any, req: Request, res: Response, next: Function ){

    res.setHeader( "Content-Type", "application/json" );
    res.status( error.code ).send( JSON.stringify( error.body ) );
};