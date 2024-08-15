import { db } from "../index.js";
const saveProduct=(req, res) => {
    const product = req.body;
    if (product != undefined) {
      const query =
        "INSERT into product (name,image_main,description,stock,category,subCategory,image_secondary_1,image_secondary_2,status,sales) VALUES(?,?,?,?,?,?,?,?,?,?) ";
      const updateQuery =
        "UPDATE product SET name= ? , image_main= ? , description= ? , stock= ? ,category= ? ,subCategory= ? ,image_secondary_1= ?,image_secondary_2= ? ,status= ? , sales= ? where id= ?  ";
      try {
        //UPATE PRODUCT
        db.query(
          updateQuery,
          [
            product.name,
            product.image_main,
            product.description,
            JSON.stringify(product.stock),
            product.category,
            product.subCategory,
            product.image_secondary_1,
            product.image_secondary_2,
            product.status,
            product.sales,
            product.id,
          ],
          (error, results) => {
            if (error) {
              throw error
            } else if (results.affectedRows > 0) {
              res.send({ success: true ,product})
            } else {
              //INSERT PRODUCT
              db.query(
                query,
                [
                  product.name,
                  product.image_main,
                  product.description,
                  JSON.stringify(product.stock),
                  product.category,
                  product.subCategory,
                  product.image_secondary_1,
                  product.image_secondary_2,
                  product.status,
                  product.sales
                ],
                (error, results) => {
                  if (error){
                    throw error
                  } 
                  else {
                    res.send({ success: true,product });
                  }
                }
              );
            }
          }
        );
      } catch (error) {
        throw error
      }
    }
  }
  export default saveProduct