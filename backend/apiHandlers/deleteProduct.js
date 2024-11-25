import { db } from "../index.js";
const deleteProduct =  (req, res) => {
    console.log('product deleted successfullt');

    const {productId} = req.query;
    const query = 'DELETE FROM product where id = ?'

    try {
        db.query(query, [productId], (err, deleteResult) => {
            if (err) {
                console.log(err);
            }
            else{
                console.log('product deleted successfullt');
                
                res.status(201).send({success:true})
            }
        })
    } catch (error) {
        console.log(error);

    }
    
}
export default deleteProduct;
