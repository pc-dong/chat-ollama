export default defineEventHandler(async (event) => {
    try {
        const body = await readMultipartFormData(event);
        console.log(body);
        return { success: true, body};
    } catch (error) {
        console.log(error);
        throw createError({statusCode: 500, statusMessage: 'Internal Server Error'});
    }
});