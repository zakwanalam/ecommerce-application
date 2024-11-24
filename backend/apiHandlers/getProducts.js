import { db } from "../index.js";
const getProducts = (req, res) => {
    const query = `
        SELECT 
            p.id,
            p.name, 
            p.image_main,
            p.description, 
            p.category,
            p.subCategory,
            p.image_secondary_1,
            p.image_secondary_2,
            p.status,
            p.sales,
            s.stock_item_id, 
            s.size, 
            s.quantity, 
            s.price
        FROM 
            product AS p
        LEFT JOIN 
            stock AS s ON s.product_id = p.id
    `;

    db.query(query, [], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send({ success: false, error: err.message });
            return;
        }

        if (results.length > 0) {
            // Transform results into nested structure
            const products = results.reduce((acc, row) => {
                const { id, name, image_main,description, category,subCategory,image_secondary_1,image_secondary_2,status,sales,stock_item_id, size, quantity, price } = row;
                  let product = acc.find(p => p.id === id);
                if (!product) {
                    product = {id, name, image_main,description, category,subCategory,image_secondary_1,image_secondary_2,status,sales, stock: [] };
                    acc.push(product);
                }

                // Add stock item to the product's stock array if it exists
                if (stock_item_id) {
                    product.stock.push({ stock_item_id, size, quantity, price });
                }

                return acc;
            }, []);

            res.send({ product:products });
        } else {
            res.send({ success: false, message: 'No products found' });
        }
    });
};

  export default getProducts

//OLD query
//   import { db } from "../index.js";
// const getProducts = (req, res) => {
//     const query = 'SELECT * FROM product'
//     db.query(query,[],(err,results)=>{
//       if(err){console.log(err);}
//       else if(results.length > 0 ){
//         res.send({product:results})
//       }
//       else{
//         res.send({success:false})
//       }
      
// })}
//   export default getProducts