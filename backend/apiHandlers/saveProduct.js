import { db } from "../index.js";
const saveProduct = (req, res) => {
  const product = req.body;
  const stock = product.stock

  console.log(product, stock);

  if (product != undefined) {
    const insertProductQuery =
      `INSERT into product 
      (name,image_main,description,stock,category,subCategory,
      image_secondary_1,image_secondary_2,status,sales) 
      VALUES(?,?,?,?,?,?,?,?,?,?) `;

    const insertStockQuery =
      `INSERT into product 
      (product_id,size,price,quantity) VALUES(?,?,?,?)`;
    const updateProductQuery =
      `UPDATE product SET name= ? , image_main= ? , description= ? , 
     category= ? ,subCategory= ? ,image_secondary_1= ?,
      image_secondary_2= ? ,status= ? , sales= ? where id= ?;
      `;

    const updateStockQuery = ` update stock set size=? 
    ,price=? ,quantity = ? 
    where stock_item_id=? 
`
    try {
      //UPATE PRODUCT
      db.query(
        updateProductQuery,
        [
          product.name,
          product.image_main,
          product.description,
          product.category,
          product.subCategory,
          product.image_secondary_1,
          product.image_secondary_2,
          product.status,
          product.sales,
          product.id,
        ], (err, results) => {
          if (err) {
            console.log(err);
          }
          if (results.affectedRows > 0) {
            stock.forEach(stockItem => {
              db.query(
                updateStockQuery,
              [ stockItem.size,
                stockItem.price,
                stockItem.quantity,
                stockItem.stock_item_id], (err, results) => {
                  if (err) {
                    console.log(err);
                  }
                }
              )
            });
            res.send({ success: true, product });
          }
          else {
            db.query(
              insertProductQuery,
              [
                product.name,
                product.image_main,
                product.description,
                product.category,
                product.subCategory,
                product.image_secondary_1,
                product.image_secondary_2,
                product.status,
                product.sales
              ],
              (error, results) => {
                if (error) {
                  throw error
                }
                else {
                  stock.forEach(stockItem => {
                    db.query(insertStockQuery,
                      [product.product_id, stockItem.size,
                      stockItem.price, stockItem.quantity])
                  });
                  res.send({ success: true, product });
                }
              }
            );
          }
        })
      //INSERT PRODUCT

    } catch (error) {
      console.log(error);
    }
  }
}
export default saveProduct