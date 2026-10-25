import { Request, Response } from 'express';
import { Helper } from "../data/helper";
import { ChatMap, Chat, ChatSelect } from "../type/chat";

module.exports = {

    select: async function( request: Request, response: Response ){

        const data: ChatMap = await Helper.read();
        const chats: Chat[] = Object.values( data );
        chats.reverse();

        let result: ChatSelect[] = [];

        const offset = request.body.offset || 0;
        const limit = Math.min( request.body.limit, 20 );
        for( let i = offset; i < ( offset + limit ); i++ ){
            if( i >= chats.length ) break;
            const chat = chats[i];
            const id = chat[0][1].id;
            const message = chat[0][1].choices[0].message.content;
            result.push({
                id: id,
                message: message
            });
        }
        response.status(200).json({
            chats: result
        });
    },

    delete: async function( request: Request, response: Response ){

        const data: ChatMap = await Helper.read();

        if( data[request.body.id] ) delete data[request.body.id]; 
        else{
            for( const id of Object.keys( data ) ){
                delete data[id]; 
            }
        }
        await Helper.write();
        response.status(200).send();
    }
};