import { Request, Response } from 'express';
var controller = require( "../controller/chat" );
import { z } from 'zod';

module.exports = {

    select: async function( req: Request, res: Response, next: Function ){

        try{
            const schema = z.object({
                offset: z.number().int().nonnegative().optional(),
                limit: z.number().int().positive().optional()
            });
            schema.parse( req.body );
        }
        catch( ex ){
            next({
                code: 400,
                body: {
                    message: "Invalid user input"
                }
            });
            return;
        }

        try{
            await controller.select( req, res );
        }
        catch( ex ){
            const err = Object.assign(
                {},
                {
                    code: 500,
                    body: {
                        message: "System error"
                    }
                },
                ex
            );
            next( err );
            return;
        }
    },

    delete: async function( req: Request, res: Response, next: Function ){

        try{
            const schema = z.object({
                id: z.string().startsWith('gen-').optional()
            });
            schema.parse( req.body );
        }
        catch( ex ){
            next({
                code: 400,
                body: {
                    message: "Invalid user input"
                }
            });
            return;
        }

        try{
            await controller.delete( req, res );
        }
        catch( ex ){
            const err = Object.assign(
                {},
                {
                    code: 500,
                    body: {
                        message: "System error"
                    }
                },
                ex
            );
            next( err );
            return;
        }
    }
};