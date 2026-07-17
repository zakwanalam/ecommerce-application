import cloudinary from "../../config/cloudinary.js";

const removeImage = async (req, res) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).send({ error: "Image URL is required" });
  }

  try {
    // Extract public_id from Cloudinary URL
    // Format: https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/<public_id>.<ext>
    const match = imageUrl.match(/\/image\/upload\/v\d+\/(.+)\.[a-z0-9]+$/i);
    if (!match || !match[1]) {
      return res.status(400).send({ error: "Invalid Cloudinary URL" });
    }

    const publicId = match[1];
    console.log("Destroying Cloudinary image with public ID:", publicId);

    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Cloudinary destroy result:", result);

    if (result.result === "ok" || result.result === "not_found") {
      res.send({ success: true });
    } else {
      res.status(500).send({ error: "Cloudinary failed to delete image", details: result });
    }
  } catch (error) {
    console.error("Cloudinary destroy failed:", error);
    res.status(500).send({ error: "Image deletion failed" });
  }
};

export default removeImage;
