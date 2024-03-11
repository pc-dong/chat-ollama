import {PrismaClient} from '@prisma/client';
export default defineEventHandler(async (event) => {
    try {
        const prisma = new PrismaClient()
        return await prisma.knowledgeBase.findMany()
    } catch (error) {
        console.log(error);
        throw createError({statusCode: 500, statusMessage: 'Internal Server Error'});
    }
});