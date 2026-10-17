import { Request, Response } from 'express';
import { Helper } from "../data/helper";
import { ChatMap } from "../type/chat";

module.exports = {

    select: async function( request: Request, response: Response ){

        const data: ChatMap = await Helper.read();
        const result: ChatMap = {};

        const ids: string[] = Object.keys( data );
        for (const [index, id] of ids.entries()) {
            if( request.body.offset && index < request.body.offset ) continue;
            if( request.body.limit ){
                const offset: number = request.body.offset || 0;
                if( index >= offset + request.body.limit ) break;
            }
            if( request.body.id && request.body.id !== id ) continue;

            result[id] = data[id];
        }
        response.status(200).json(result);
    }
};