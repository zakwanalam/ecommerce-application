import { storageRef, getDownloadURL, ref, uploadString } from "../../config/firebase.js";

const uploadImage = (req, res) => {
  const { dataurl } = req.body;
  let fileExtension = "";

  if (dataurl.startsWith("data:image/jpeg")) {
    fileExtension = "jpg";
  } else if (dataurl.startsWith("data:image/png")) {
    fileExtension = "png";
  }
  const randomName = Math.round(Math.random() * 100000);
  const imagesRef = ref(storageRef, `${randomName}.${fileExtension}`);

  uploadString(imagesRef, dataurl, "data_url").then(async (snapshot) => {
    console.log("Uploaded a data_url string!");
    const url = await getDownloadURL(snapshot.ref);
    console.log(url);
    res.send({ url });
  });
};

export default uploadImage;
