import { db } from "../index.js";

const saveProduct = (req, res) => {
  const product = req.body;
  const stock = product.stock;

  console.log("Product:", product);
  console.log("Stock:", stock);

  if (!product) {
    return res.status(400).send({ success: false, message: "No product data provided." });
  }

  const insertProductQuery = `
    INSERT INTO product 
    (name, image_main, description, category, subCategory,
     image_secondary_1, image_secondary_2, status, sales) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const updateProductQuery = `
    UPDATE product 
    SET name = ?, image_main = ?, description = ?, 
        category = ?, subCategory = ?, image_secondary_1 = ?, 
        image_secondary_2 = ?, status = ?, sales = ? 
    WHERE id = ?
  `;

  const insertStockQuery = `
    INSERT INTO stock 
    (product_id, size, price, quantity) 
    VALUES (?, ?, ?, ?)
  `;

  const updateStockQuery = `
    UPDATE stock 
    SET size = ?, price = ?, quantity = ? 
    WHERE stock_item_id = ?
  `;

  const currentStockQuery = `
    SELECT stock_item_id 
    FROM stock 
    WHERE product_id = ?
  `;

  const deleteStockQuery = `
    DELETE FROM stock 
    WHERE stock_item_id IN (?)
  `;

  try {
    // Update the product
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
      ],
      (err, results) => {
        if (err) {
          console.error("Error updating product:", err);
          return res.status(500).send({ success: false, message: "Failed to update product." });
        }

        if (results.affectedRows > 0) {
          db.query(currentStockQuery, [product.id], (err, currentStockResults) => {
            if (err) {
              console.error("Error fetching current stock:", err);
              return res.status(500).send({ success: false, message: "Failed to fetch current stock." });
            }

            const currentStockIds = currentStockResults.map((item) => item.stock_item_id);
            const updatedStockIds = stock.map((stockItem) => stockItem.stock_item_id);
            const idsToDelete = currentStockIds.filter((id) => !updatedStockIds.includes(id));

            // Delete stock items not in the updated list
            if (idsToDelete.length > 0) {
              db.query(deleteStockQuery, [idsToDelete], (deleteErr) => {
                if (deleteErr) {
                  console.error("Error deleting stock items:", deleteErr);
                  return res.status(500).send({ success: false, message: "Failed to delete removed stock items." });
                }
              });
            }

            stock.forEach((stockItem) => {
              if (stockItem.stock_item_id) {
                db.query(
                  updateStockQuery,
                  [stockItem.size, stockItem.price, stockItem.quantity, stockItem.stock_item_id],
                  (err) => {
                    if (err) {
                      console.error("Error updating stock item:", err);
                    }
                  }
                );
              } else {
                db.query(
                  insertStockQuery,
                  [product.id, stockItem.size, stockItem.price, stockItem.quantity],
                  (err) => {
                    if (err) {
                      console.error("Error inserting stock item:", err);
                    }
                  }
                );
              }
            });

            return res.send({ success: true, message: "Product and stock updated successfully." });
          });
        } else {
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
              product.sales,
            ],
            (insertErr, results) => {
              if (insertErr) {
                console.error("Error inserting product:", insertErr);
                return res.status(500).send({ success: false, message: "Failed to insert product." });
              }

              const productId = results.insertId;

              stock.forEach((stockItem) => {
                db.query(
                  insertStockQuery,
                  [productId, stockItem.size, stockItem.price, stockItem.quantity],
                  (err) => {
                    if (err) {
                      console.error("Error inserting stock item:", err);
                    }
                  }
                );
              });

              return res.send({ success: true, message: "Product and stock inserted successfully." });
            }
          );
        }
      }
    );
  } catch (error) {
    console.error("Error in saveProduct:", error);
    res.status(500).send({ success: false, message: "An unexpected error occurred." });
  }
};

export default saveProduct;
