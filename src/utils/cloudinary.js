import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs'

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
});

const uploadCloudinary = async (localFilePath)=>{
    try {
        if(!localFilePath){
            return null
        }
        else{
            const response = await cloudinary.uploader.upload(localFilePath,{
                resource_type:"auto"
            })
            console.log("File is uploaded on cloudinary.",response.url)
            return response;
        }
    } catch (error) {
        fs.unlinkSync(localFilePath); //remove the locally saved temporary file as the upload operation failed
        return null
    }
}

export {uploadCloudinary}
