import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { ChatMapSchema, ChatMap } from "../src/type/chat";

const Helper = {
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
        return data;
    },
    write: async function(data: ChatMap): Promise<ChatMap> {
        const file: string = path.join(__dirname, 'data.json');
        try{
            data = ChatMapSchema.parse( data );
        }
        catch( ex ){
            throw new Error("Invalid data");
        }
        await writeFile(file, JSON.stringify(data), 'utf-8');
        return data;
    }
};