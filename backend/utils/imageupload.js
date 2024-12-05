import cloudinary from "cloudinary";    

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadImageToClodinary = async (file,folder,height,quality) => {
    const options ={folder};
    if(height){
        options.height = height;
    }
    if(quality){
        options.quality = quality;
    }
    options.resource_type = "auto";
    return await cloudinary.v2.uploader.upload(file.tempFilePath,options);

};

exports.deleteImage = async (publicId) => {
    return await cloudinary.v2.uploader.destroy(publicId);
};





