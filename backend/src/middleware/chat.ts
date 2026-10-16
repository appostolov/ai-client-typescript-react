import { Request, Response } from 'express';
var controller = require( "../controller/chat" );

module.exports = {

    select: function( req: Request, res: Response, next: Function ){
        controller.select( req, res )
        .then(function(){
            next();
        })
        .catch(function(){
            // next( err );
        });
    }
};