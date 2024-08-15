import { db } from "../index.js";
const getProducts = (req, res) => {
    const query = 'SELECT * FROM product'
    db.query(query,[],(err,results)=>{
      if(err){console.log(err);}
      else if(results.length > 0 ){
        res.send({product:results})
      }
      else{
        res.send({success:false})
      }
      
})}
  export default getProducts