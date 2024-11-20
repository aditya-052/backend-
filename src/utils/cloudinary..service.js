import {v2 as cloudinary} from "cloudinary";
import fs from "fs";



    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME , 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret : process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });
    
    const uploadOnCloudinary = async (localFilePath)=>{
        try{
            if(!localFilePath){
                console.log("localFilePath not found");                
                return null;
            }
            cloudinary.uploader.upload
            const response = await (localFilePath, {
                resource_type:"auto"
            })
            //file has been successfully uploaded
            console.log("file is successfully uploaded on the cloudinary ", response.url)
            return response;
            
        }
        catch(error){
            fs.unlinkSync(localFilePath);
            //remove the locally saved temporary file as the upload has been failed
        }
    }




    // Upload an image
    const uploadResult = await cloudinary.uploader
    .upload(
        'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
            public_id: 'shoes',
        }
    )
    .catch((error) => {
        console.log(error);
    });
 
 console.log(uploadResult);
   