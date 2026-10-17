import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { ChatMapSchema, ChatMap } from "../src/type/chat";

export const Helper = {
    data: {},
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
    }
};