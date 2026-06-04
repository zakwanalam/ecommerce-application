import cloudinary from "../../config/cloudinary.js";

const uploadImage = async (req, res) => {
  const { dataurl } = req.body;

  try {
    const result = await cloudinary.uploader.upload(dataurl, {
      folder: "images",
    });
    console.log("Uploaded to Cloudinary:", result.secure_url);
    res.send({ url: result.secure_url });
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    res.status(500).send({ error: "Image upload failed" });
  }
};

export default uploadImage;
