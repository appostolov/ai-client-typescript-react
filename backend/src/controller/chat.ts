import { Request } from 'express';

module.exports = {

    select: function( request: Request ){

        return new Promise( function( res, rej ){

            res( 1 );
        });
    }
};