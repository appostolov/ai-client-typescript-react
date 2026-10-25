import { Request, Response } from 'express';
import { Helper } from "../data/helper";
import type { Message, ChatMap, Chat, Request as OpenRouterRequest, Response as OpenRouterResponse } from "../type/chat";
import { openrouter } from "../lib/openrouter";

module.exports = {

    send: async function( request: Request, response: Response ){

        const data: ChatMap = await Helper.read();
        
        if( request.body.chat && !data[request.body.chat] ) throw {
            code: 404,
            body: {
                message: "Chat not found"
            }
        };
        let messages: Message[] = [];
        if( request.body.chat && !request.body.alone ){
            messages = Helper.messages( request.body.chat );
        }
        const prediction = await openrouter.chat.completions.create(
            Object.assign(
                {},
                request.body.request,
                {
                    messages: messages.concat(request.body.request.messages)
                }
            )
        );

        const result: [OpenRouterRequest, OpenRouterResponse] = [request.body.request, prediction];

        if( request.body.chat ) data[request.body.chat].push(result);
        else{
            const id = prediction.id;
            data[id] = [result];
        }
        await Helper.write();

        response.status(200).json({
            chat: request.body.chat ? request.body.chat : prediction.id,
            message: result
        });
    },

    select: async function( request: Request, response: Response ){

        const data: ChatMap = await Helper.read();
        
        if( request.body.chat && !data[request.body.chat] ) throw {
            code: 404,
            body: {
                message: "Chat not found"
            }
        };
        const messages: Message[] = Helper.messages( request.body.chat );
        messages.reverse();
        let result: Message[] = [];

        const offset = request.body.offset || 0;
        const limit = Math.min( request.body.limit, 20 );
        for( let i = offset; i < ( offset + limit ); i++ ){
            if( i >= messages.length ) break;
            result.push( messages[ i ] );
        }
        response.status(200).json({
            messages: result
        });
    }
};  