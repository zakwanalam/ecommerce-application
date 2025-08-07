import { sendVerificationEmail } from "./sendVerificationEmail.js";
import { default as bcrypt } from "bcryptjs";
import e from "express";
import * as mysql from "mysql";
import axios from "axios";
import { default as jwt } from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import getProducts from "./apiHandlers/getProducts.js";
import saveProduct from "./apiHandlers/saveProduct.js";
import verifyAdmin from "./apiHandlers/verifyAdmin.js";
import verifyAdminSession from "./apiHandlers/verifyAdminSession.js";
import deleteProduct from "./apiHandlers/deleteProduct.js";


import { initializeApp } from "firebase/app";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadString,
} from "firebase/storage";
import { loadStripe } from "@stripe/stripe-js";
import Stripe from "stripe";
import getUser from "./apiHandlers/getUser.js";
import { sendOrderConfirmationEmail } from "./sendOrderConfirmationEmail.js";

const app = e();

const firebaseConfig = {
  apiKey: "AIzaSyDzvCtPLqoM0bTkG9EN-fLAttjlFZYl5Nk",
  authDomain: "zakwan-alam.firebaseapp.com",
  projectId: "zakwan-alam",
  storageBucket: "zakwan-alam.appspot.com",
  messagingSenderId: "711524093791",
  appId: "1:711524093791:web:0e9ff3e66575eec59bf0ea",
  measurementId: "G-RFHSEDLCB6",
};
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage();
const storageRef = ref(storage, "images/");

app.use(cookieParser());
app.use(e.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "test",
});

db.connect((err) => {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("my sql connected");
});
// ,e.raw({ type: 'application/octet-stream', limit: '10mb' })
app.post("/api/uploadImage", (req, res) => {
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
});

app.post("/api/saveReview", (req, res) => {
  const feedback = req.body;
  const { date, product_id, email, rating, review } = feedback;
  const query = `INSERT INTO reviews (product_id,email,rating,review_text,date) 
  VALUES('${product_id}','${email}','${rating}','${review}','${date}')`;
  try {
    db.query(query, (err, results) => {
      if (err) {
        throw err;
      }
      console.log(review, 'Review Sent');
      res.send({ success: true });
    });
  } catch (error) {
    res.send({ success: false });
    console.log(error);
  }
});

app.get("/api/getReviews", (req, res) => {
  //review query
  const query = ` SELECT 
                  u.profile_picture,
                  r.product_id, 
                  r.review_id,
                  r.date, 
                  r.email, 
                  u.fullName, 
                  r.rating, 
                  r.review_text, 
                  p.name,
                  p.image_main
              FROM 
                  reviews r
              JOIN 
                  users u ON r.email = u.email
              JOIN 
                  product p ON r.product_id = p.id
              `;

  try {
    db.query(query, (err, results) => {
      if (err) {
        throw err;
      }
      //results will be an array
      if (results.length > 0) {
        console.log(results);
        res.send({ success: true, reviews: results });
      }
    });
  } catch (error) {
    res.send({ success: false });
    console.log("Could Not Fetch Reviews", error);
  }
});

app.delete("/api/deleteReview", (req, res) => {
  const { id } = req.query;
  const query = `DELETE from reviews where review_id=${id}`;
  try {
    db.query(query, (err, results) => {
      if (err) {
        throw err;
      } else {
        res.send({ success: true });
      }
    });
  } catch (error) {
    console.log(error);
    res.send({ success: false });
  }
});

app.get("/api/getSessions", async (req, res) => {
  const sessions = await stripe.checkout.sessions.list({ limit: 16 });

  res.json({ sessions: sessions.length });
});
app.get('/api/getOrders', (req, res) => {
  const getSessionQuery = 'SELECT stripe_session_id, total_price, status, order_date FROM orders';
  const getOrderProducts = 'SELECT product_id,product_name,unit_price,size,subtotal,quantity from orderview where stripe_session_id = ?'
  db.query(getSessionQuery, async (err, result) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).send({ success: false, msg: 'Database Error' });
    }

    try {
      const ordersWithDetails = await Promise.all(
        result.map(async (order) => {
          try {
            const { id, customer_details, payment_intent } = await stripe.checkout.sessions.retrieve(order.stripe_session_id);
            const lineItems = await stripe.checkout.sessions.listLineItems(order.stripe_session_id)
            const filteredLineItems =
              lineItems.data.filter((item) => item.description === 'Shipping' || item.description === 'Tax')
                .map((item) => ({ product_name: item.description, unit_price: parseFloat(item.amount_total) / 100 }));

            const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);
            const paymentMethodObject = await stripe.paymentMethods.retrieve(paymentIntent.payment_method);
            const productResult = await new Promise((resolve, reject) => {
              db.query(getOrderProducts, [order.stripe_session_id], (productError, productResult) => {
                if (productError) {
                  reject(productError); // Reject if there's an error
                } else {
                  resolve(productResult); // Resolve with the product result
                }
              });
            });
            filteredLineItems.forEach((item) => {
              productResult.push(item)
            })
            return {
              ...order,
              id,
              customer_details,
              card: paymentMethodObject.card.brand,
              last4: paymentMethodObject.card.last4,
              products: productResult,
            };
          } catch (stripeError) {
            console.error('Stripe Error for Order:', order.stripe_session_id, stripeError);
            // Return the original order without payment details if Stripe call fails
            return {
              ...order,
              error: 'Failed to retrieve payment details',
            };
          }
        })
      );

      res.status(200).send({ success: true, result: ordersWithDetails, msg: 'Orders Retrieved Successfully' });
    } catch (error) {
      console.error('Unexpected Error:', error);
      res.status(500).send({ success: false, msg: 'Failed to retrieve orders' });
    }
  });
});

app.post("/api/uploadProfilePic", (req, res) => {
  const { url } = req.body;
  const { email } = jwt.decode(req.cookies.token);
  const query = "UPDATE users SET profile_picture= ? where email = ?";
  try {
    db.query(query, [url, email], (err, results) => {
      if (err) {
        res.send({ success: false });
        throw err;
      }
      if (results.affectedRows > 0) {
        res.send({ success: true });
      } else {
        res.send({ success: false });
      }
    });
  } catch (error) {
    console.log(error);
    res.send({ success: false });
  }
});

app.get("/api/signup", (req, res) => {
  const { email, fullName, address, password } = req.query;
  let query = "SELECT * FROM users where email = ?";
  db.query(query, email, async (err, results) => {
    if (err) {
      res.send({ success: "false", msg: "error occured" });
      return;
    }
    //user exists
    if (results.length > 0) {
      if (results[0].isVerified) {
        res.send({ success: "false", msg: "user already exists" });
      } else {
        const verifyCode = Math.floor(Math.random() * 9000 + 1000);
        const expiryDate = new Date(Date.now() + 3600000);
        const hashedPassword = await bcrypt.hash(password, 10);
        const updated = {
          email: email,
          fullName: fullName,
          address: address,
          password: hashedPassword,
          expiry: expiryDate,
          verifyCode: verifyCode,
          isVerified: false,
        };
        let updateQuery = "UPDATE users SET ? WHERE email = ?";
        db.query(updateQuery, [updated, email], async (err, results) => {
          if (err) {
            console.error("Error updating user:", err);
            res
              .status(500)
              .send({ success: "false", msg: "Error updating user" });
            return;
          }
          await sendVerificationEmail(email, verifyCode);
          res.send({ success: "true", msg: "User updated" });
        });
      }
      return;
    } else {
      const verifyCode = Math.floor(Math.random() * 9000 + 1000);
      const expiryDate = new Date(Date.now() + 3600000);
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        email: email,
        fullName: fullName,
        address: address,
        profile_picture: 'https://avatars.githubusercontent.com/u/124599?v=4',
        password: hashedPassword,
        expiry: expiryDate,
        verifyCode: verifyCode,
        isVerified: false,
      };
      let insertQuery = "INSERT INTO users SET ?";
      db.query(insertQuery, newUser, async (err, results) => {
        if (err) {
          console.error("Error adding user:", err);
          res.status(500).send({ success: "false", msg: "Error adding user" });
          return;
        }
        console.log("User added");
        await sendVerificationEmail(email, verifyCode);
        res.send({ success: "true", msg: "User added" });
      });
    }
  });
});

app.get("/api/verifyUser", (req, res) => {
  const { email, password, verifyCode } = req.query;
  const query = "SELECT * from users where email= ?";
  db.query(query, email, (err, results) => {
    console.log(results);
    if (err) {
      throw err;
    }
    if (results) {
      if (
        results[0].verifyCode.toString() === verifyCode.toString() &&
        results[0].verifyCode != "expired"
      ) {
        const verifyCode = "expired";
        let query = "";
        let queryParams = [];
        if (password) {
          let isVerified = true;
          query =
            "UPDATE users SET password= ?, verifyCode= ?, isVerified= ? WHERE email= ?";
          queryParams = [password, verifyCode, isVerified, email];
        } else {
          query =
            "UPDATE users SET verifyCode= ?, isVerified= ? WHERE email= ?";
          let isVerified = true;
          queryParams = [verifyCode, isVerified, email];
        }
        db.query(query, queryParams, (err, results) => {
          if (err) {
            throw err;
          }
        });
        res.send({ success: true, message: "Verification Successful" });
        return;
      } else {
        res.send({ success: false, message: "Invalid Otp" });
        return;
      }
    } else {
      res.send({ sucess: false, message: "User Not Registered", login: false });
      return;
    }
  });
});

app.get("/api/resend", (req, res) => {
  const verifyCode = Math.floor(Math.random() * 9000 + 1000);
  const expiry = new Date(Date.now() + 3600000);

  const { email } = req.query;
  console.log(email);
  const dbQuery = `UPDATE users
                    SET expiry = ?, verifyCode = ?
                    WHERE email = ?;`;

  db.query(dbQuery, [expiry, verifyCode, email], (err, results) => {
    if (err) {
      throw err;
    }
    if (results) {
      sendVerificationEmail(email, verifyCode);
      res.send({ success: true, message: "Verification email Sent" });
    } else {
      res.send({ success: false, message: "Could Not find email" });
    }
  });
});

app.get("/api/login", async (req, res) => {
  const { email, password } = req.query;
  console.log("Email and password", email, password);
  const dbQuery = "SELECT * FROM users where email= ?";
  db.query(dbQuery, email, async (err, results) => {
    console.log(results);
    try {
      if (err) {
        res.send({ success: false });
      }
      if (results) {
        if (results[0].isVerified === 1) {
          const hashedPassword = results[0].password;
          const compareResult = await bcrypt.compare(password, hashedPassword);
          if (compareResult === true) {
            //storing the session
            const jwtToken = jwt.sign(
              {
                email: email,
                fullName: results[0].fullName,
                address: results[0].address,
              },
              "secret",
              {
                expiresIn: "24h",
              }
            );
            const expiry_day = 24 * 60 * 60 * 1000;
            const options = {
              expires: new Date(Date.now() + expiry_day),
              httpOnly: true,
            };
            res
              .cookie("token", jwtToken, options)
              .send({ success: true, message: "Login was successful" });
          } else {
            res.send({ success: false, message: "Incorrect Password" });

          }
        } else {
          res.send({
            success: false,
            message: "Register your account first",
            isNotVerified: true,
          });
        }
      } else {
        //REGISTER YOUR ACCOUNT FIRST
        res.send({
          success: false,
          message: "Register Your account First",
          isNotRegistered: true,
        });
      }
    } catch (error) {
      res.send({ success: false });
    }
  });
});

app.use("/api/verifySession", (req, res, next) => {
  const { email } = req.query;
  const { token } = req.cookies;
  try {
    if (token) {
      res.status(201).send({ success: true });
    } else {
      res.status(205).send({ success: false });
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/getProfilePic", (req, res) => {
  const { email } = jwt.decode(req.cookies.token);
  console.log(email);
  const query = `SELECT profile_picture  from users where email = '${email}'`;
  db.query(query, (err, results) => {
    if (err) {
      throw err;
    }
    if (results) {
      console.log(results);
      res.send({ success: true, profile_picture: results[0].profile_picture });
    }
  });
});
app.get("/api/logout", (req, res) => {
  res.clearCookie("token").send({ success: true });
});

app.post('/api/adminLogout', (req, res) => {
  res.clearCookie('adminToken').send({ success: true })
});

app.post("/api/addToCart", (req, res) => {

  const { productId, quantity, stock_item_id } = req.body;

  console.log('id', productId);
  console.log('quantity', quantity);

  // const { token } = req.cookies;
  const { email } = jwt.decode(req.cookies.token);
  // const email = jwt.decode(token).email;
  const query = `INSERT INTO cart (email,product_id,quantity,stock_item_id)
                    VALUES(?,?,?,?)`;
  db.query(query, [email, productId, quantity, stock_item_id], (err, results) => {
    if (err) {
      console.log(err.code);
      return res.status(401).send('Duplicate Entry')
    }
    if (results.affectedRows > 0) {
      console.log("Product Added To Cart", results.insertId);
      res.send({ success: true, cart_item_id: results.insertId });
    } else {
      res.send("Error While storing cart");
    }
  });

});

app.post('/api/removeFromCart', async (req, res) => {
  const { cart_item_id, product_id, stock_item_id } = req.body;
  console.log(cart_item_id);

  const deleteFromCartId = `DELETE FROM cart WHERE cart_item_id = ${cart_item_id}`
  const deleteFromPrimary = 'DELETE FROM cart where email=? and product_id=? and stock_item_id = ?'
  const { token } = req.cookies;
  const user = jwt.decode(token);
  const email = user.email

  try {
    if (cart_item_id) {
      db.query(deleteFromCartId, (err, results) => {
        if (err) {
          console.log("Cart Id Not Found", err.code);
          return res.status(500).json({ success: false, msg: 'Failed to delete by cart_item_id' });
        }
        else if (results.length > 0) {

          return res.status(200).json({ success: true, msg: 'Cart item deleted successfully' });
        }
      })
    }
    else {
      db.query(deleteFromPrimary, [email, product_id, stock_item_id], (err, results) => {
        if (err) {
          console.log("Cart Id Not Found", err.code);
          return res.status(500).json({ success: false, msg: 'Failed to delete item' });
        }
        else {
          return res.status(200).json({ success: true, msg: 'Cart item deleted successfully' });
        }
      })
    }
  } catch (error) {
    return res.status(500).json({ success: false, msg: 'An unexpected error occurred' });
  }

})
app.post('/api/updateCartItemQuantity', (req, res) => {

  const { cart_item_id, quantity } = req.body;
  console.log(cart_item_id, quantity);

  const query = 'UPDATE cart SET quantity = ? WHERE cart_item_id = ?'

  try {
    db.query(query, [quantity, cart_item_id], (err, results) => {
      if (err) { throw err }
      else if (results.affectedRows > 0) {
        console.log('Cart Item Quantity Updated Successfully');
        res.send({ success: true })
      }
    });
  } catch (error) {
    console.log(error);
    res.send({ success: false })
  }
})

app.get('/api/getCart', (req, res) => {
  const email = jwt.decode(req.cookies.token).email;
  const query =
    `SELECT c.cart_item_id,  p.*,s.stock_item_id,s.price,s.size,c.quantity
                FROM users as u 
                JOIN cart as c
                ON u.email = c.email
                JOIN product p
                ON p.id = c.product_id
                JOIN stock s
                ON s.stock_item_id = c.stock_item_id
                where u.email = ?
              `
  try {
    db.query(query, email, (err, results) => {
      if (err) {
        console.log(err);
      }
      console.log('usrCart',results);
      
      res.send({ cart: results, success: true })
    })
  } catch (error) {
    console.log(error);
  }

})

app.post("/api/saveUser", (req, res) => {

  try {
    const userData = req.body;
    const { email, firstName, lastName, address, profile_picture } = userData;
    const fullName = `${firstName} ${lastName}`;
    const query = `UPDATE users SET fullName = ?, address = ?, profile_picture = ? WHERE email = ?`;
    console.log(fullName);

    //Update Database
    db.query(query, [fullName, address, profile_picture, email], (err, results) => {
      if (err) {
        throw err;
      }
      //Update Cookies
      else {
        const { token } = req.cookies;
        const previousToken = jwt.decode(token);
        const jwtToken = jwt.sign(
          {
            email: email,
            fullName: fullName,
            address: address,
          },
          "secret",
          {
            expiresIn: previousToken.exp,
          }
        );
        const expiryDate = previousToken.exp * 1000;
        const options = {
          expires: new Date(expiryDate),
          httpOnly: true,
        };
        res
          .cookie("token", jwtToken, options)
          .send({ success: true, msg: "User Updated SuccessFully" });
      }
    }
    );
  } catch (error) {
    console.log(error);
  }
});
app.get("/api/getUser", getUser)


// app.get("/api/getCart", (req, res) => {
//   const email = jwt.decode(req.cookies.token).email;
//   const query = "SELECT cart FROM usercart WHERE email = ?";
//   try {
//     db.query(query, email, (err, results) => {
//       if (err) {
//         res.send({ success: false, msg: "Cannot fetch from database" });
//       }

//      try {
//        if (results.length > 0 && results[0].cart != undefined) {
//          res.send({
//            cart: JSON.parse(results[0].cart),
//            success: true,
//            msg: "Cart fetched successfully",
//          });
//        } else {
//          res.send({ success: false, msg: "Cart Not Found" });
//        }
//      } catch (error) {
//       console.log(error);
//      }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

app.get("/api/loadUserData", (req, res) => {
  try {
    const { token } = req.cookies;
    const { email, fullName, address } = jwt.decode(token);
    res.send({ success: true, email, fullName, address });
  } catch (error) {
    res.send({ success: false });
  }
});

// * ADMIN API's 

app.get("/api/verifyAdmin", verifyAdmin);
app.get("/api/verifyAdminSession", verifyAdminSession);
app.get("/api/getProducts", getProducts);
app.post("/api/saveProduct", saveProduct);
app.delete('/api/deleteProduct', deleteProduct)

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`app is running on port${port}`);
});

const stripe = Stripe(
  "sk_test_51NDIgmQY69KQ4gJj7BpV9kB0DVHmcByTZxjH6W0CNWofMoQWPsrkvBYs3VtooB0C0pQfToxq2DeAtwxXU8pEJ1Nq00UhvDUfzz"
);
// app.post('/api/storeCartToCookies', (req, res) => {
//   const { products } = req.body;
//   console.log('From faf',products);

//   const options = {
//     expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day expiry
//     httpOnly: false, // Allow access from the frontend
//     path: '/', // Accessible across the site
//   };
//   res.cookie('cartProducts', JSON.stringify(products), options).send({
//     success: true,
//     message: 'Cart stored in cookie successfully!',
//   });
// });
app.post("/api/checkout", async (req, res) => {
  try {
    const { products, tax, discount, shipping } = req.body;
    console.log(products);

    console.log("checkout", products);
    const lineItems = products.map((product) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
          images: [product.image_main],
          metadata: { product_id: product.id },
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: product.quantity,
    }));

    if (tax > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Tax",
          },
          unit_amount: Math.round(tax * 100),
        },
        quantity: 1,
      });
    }

    if (discount > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Discount",
          },
          unit_amount: Math.round(-discount * 100),
        },
        quantity: 1,
      });
    }

    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shipping",
          },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }
    const {token} = req.cookies
    const {email} = jwt.decode(token)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `http://${process.env.SERVER_IP}:3000/api/storeOrder?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://${process.env.SERVER_IP}:5173/paymentFail`,
      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true, // Enable phone number collection
      },
      customer_email:email
    });
    console.log('session id is:',session.id);
    
    res.send({ id: session.id });
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post('/api/testApi', (req, res) => {
  res.send({ msg: 'hello world' })
})
app.get('/api/storeOrder', async (req, res) => {
  const { session_id } = req.query;

  // Retrieve session from Stripe API
  const session = await stripe.checkout.sessions.retrieve(session_id);
  const amount_total = session.amount_total;
  const email = session.customer_details.email;
  const date = new Date(session.created * 1000);

  // Get the cart items from the database
  const getCartQuery =
    `SELECT c.cart_item_id, p.*, s.stock_item_id, s.price, s.size, c.quantity
      FROM users as u
      JOIN cart as c ON u.email = c.email
      JOIN product p ON p.id = c.product_id
      JOIN stock s ON s.stock_item_id = c.stock_item_id
      WHERE u.email = ?`;

  try {
    // Query the cart data
    db.query(getCartQuery, email, (err, cart) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: 'Error fetching cart' });
      }

      // Insert the order into the orders table
      const query = 'INSERT INTO orders (email, order_date, status, total_price, stripe_session_id) VALUES (?, ?, ?, ?, ?)';
      db.query(query, [email, date, 'Processing', amount_total / 100, session_id], async(err, insertResult) => {
        if (err) {
          console.log(err);
          return res.status(500).send({ success: false, msg: 'Error creating order' });
        }

        // Insert each cart item into the order_items table
        const order_items_query = `INSERT INTO order_items (stripe_session_id, stock_item_id, quantity, unit_price) VALUES (?, ?, ?, ?)`;
        cart.forEach(product => {
          db.query(order_items_query, [session_id, product.stock_item_id, product.quantity, product.price], (err) => {
            if (err) {
              console.log(err);
            }
          });
        });
        let response = false
        let maxRetries = 3;
        let attempts =0;
        while(!response && attempts<=maxRetries){
          attempts++;
          response = await sendOrderConfirmationEmail(cart,email)
        }
        // Once the order items are inserted, redirect the user
        res.redirect(`http://localhost:5173/paymentSuccess?session_id=${session_id}`);
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, msg: 'Server error' });
  }
});
