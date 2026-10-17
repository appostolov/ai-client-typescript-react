import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { ChatMapSchema } from "../type/chat";
import type { Message, Chat, ChatMap, Request, Response } from "../type/chat";

export const Helper = {
    data: {} as ChatMap,
    read: async function(): Promise<ChatMap> {
        const file: string = path.join(__dirname, 'data.json');
        const text: string = await readFile(file, 'utf-8');
        let data: ChatMap;
        try{
            data = ChatMapSchema.parse( JSON.parse( text ) );
        }
        catch( ex ){
            throw new Error("Invalid data");
        }
        this.data = data;
        return this.data;
    },
    write: async function(): Promise<ChatMap> {
        const file: string = path.join(__dirname, 'data.json');
        try{
            ChatMapSchema.parse( this.data );
        }
        catch( ex ){
            throw new Error("Invalid data");
        }
        await writeFile(file, JSON.stringify(this.data), 'utf-8');
        return this.data;
    },
    messages: function( id: string ): Message[]{
        const chat: Chat = this.data[id];
        const messages: Message[] = [];
        for(const [req, res] of chat){
            messages.push(...req.messages);
            messages.push(res.choices[0].message);
        }
        return messages;
    }
};