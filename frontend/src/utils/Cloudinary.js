export const getSignature = async (protectedAxios) => {
    try {
        const response = await protectedAxios.get('/alumni/cloudinary-signature');
        console.log("Cloudinary signature fetched successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching Cloudinary signature:", error);
        throw error;
    }
}