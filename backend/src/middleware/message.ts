import { Request, Response } from 'express';
var controller = require( "../controller/message" );
import { z } from 'zod';
import { RequestSchema } from "../type/chat"

module.exports = {

    send: async function( req: Request, res: Response, next: Function ){

        try{
            const schema = z.object({
                chat: z.string().startsWith('gen-').optional(),
                request: RequestSchema,
                alone: z.boolean().optional()
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
            await controller.send( req, res );
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

    select: async function( req: Request, res: Response, next: Function ){

        try{
            const schema = z.object({
                chat: z.string().startsWith('gen-'),
                limit: z.number().int().positive().optional(),
                offset: z.number().int().nonnegative().optional()
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
    }
};