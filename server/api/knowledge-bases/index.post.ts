import {PrismaClient} from '@prisma/client';
import type {MultiPartData} from "h3";
export default defineEventHandler(async (event) => {
    try {
        const items = await readMultipartFormData(event);
        const decoder = new TextDecoder("utf-8");
        const uploadedFiles: MultiPartData[] = [];

        let _name = ''
        let _description = ''
        let _embedding = ''
        items?.forEach((item) => {
            const key = item.name || '';
            const decodeData = decoder.decode(item.data)
            if (key.startsWith("files")) {
                uploadedFiles.push(item);
            }
            if (key === 'name') {
                _name = decodeData
            }
            if (key === 'description') {
                _description = decodeData
            }
            if (key === 'embedding') {
                _embedding = decodeData
            }
        });
        console.log(_name, _description, _embedding);
        const prisma = new PrismaClient();
        await prisma.knowledgeBase.create({
            data: {
                name: _name,
                description: _description,
                embedding: _embedding,
            }
        });
        return {success: true, items};
    } catch (error) {
        console.log(error);
        throw createError({statusCode: 500, statusMessage: 'Internal Server Error'});
    }
});