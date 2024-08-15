import databaseConnect from "./dbConnect.js";
import { sendVerificationEmail } from "./sendVerificationEmail.js";
import mongoose from "mongoose";
import UserModel from "./model/UserModel.js";
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
  const query = `INSERT INTO reviews (product_id,email,rating,review_text,date) VALUES('${product_id}','${email}','${rating}','${review}','${date}')`;
  try {
    db.query(query, (err, results) => {
      if (err) {
        throw err;
      }
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
app.get("/api/getOrders", async (req, res) => {
  try {
    const sessions = await stripe.checkout.sessions.list();
    const filteredSessions = sessions.data.filter(
      (session) => session.payment_status === "paid" 
    );
    const sessionsWithDetails = await Promise.all(
      filteredSessions.map(async (session) => {
        const lineItems = await stripe.checkout.sessions.listLineItems(
          session.id
        );
        
        const paymentIntent = await stripe.paymentIntents.retrieve(
          session.payment_intent
        );
        const paymentMethodId = paymentIntent.payment_method;

        const paymentMethod = await stripe.paymentMethods.retrieve(
          paymentMethodId
        );
        if (session.payment_status === "paid") {
          const lineItemsWithProductDetails = await Promise.all(lineItems.data.map(async (item) => {
            const product = await stripe.products.retrieve(item.price.product);
            return {
              product: {
                id: product.id,
                name: product.name,
                images: product.images,
                amountTotal: item.amount_total,
                quantity:item.quantity,
                product_id: product.metadata.product_id,
              },
            };
          }));
          return {
            id: session.id,
            amount_total: session.amount_total,
            amount_subtotal: session.amount_subtotal,
            currency: session.currency,
            card_brand:paymentMethod.card.brand,
            card_last4:paymentMethod.card.last4,
            created: new Date(session.created * 1000).toISOString(), 
            customer_details: await session.customer_details,
            products: lineItemsWithProductDetails
          };
        }
      })
    );
    
    res.json({ success: true, sessions: sessionsWithDetails });
  } catch (error) {
    console.error("Error retrieving Checkout Sessions:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve sessions" });
  }
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
  const query = `SELECT profile_picture from users where email = '${email}'`;
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

app.post("/api/addToCart", (req, res) => {
  const cart = req.body;
  // const { token } = req.cookies;
  const { email } = jwt.decode(req.cookies.token);
  // const email = jwt.decode(token).email;
  console.log(cart);
  const query = "UPDATE usercart SET cart = ? where email = ?";

  db.query(query, [JSON.stringify(cart), email], (err, results) => {
    if (err) {
      throw err;
    }
    if (results.affectedRows > 0) {
      console.log("User Updated");
      res.send({ cart });
    } else {
      //INSERT
      const query = `INSERT INTO usercart (email,cart)
                    VALUES(?,?)`;
      db.query(query, [email, JSON.stringify(cart)], (err, results) => {
        if (err) {
          throw err;
        }
        if (results > 0) {
          console.log("User Saved");
          res.status(201).send();
        } else {
          res.send("Error While storing cart");
        }
      });
    }
  });
});
app.get("/api/getUser", (req, res) => {
  try {
    const { token } = req.cookies;
    const user = jwt.decode(token);
    res.send({ user: user });
  } catch (error) {
    console.log(error);
  }
});
app.get("/api/getCart", (req, res) => {
  const email = jwt.decode(req.cookies.token).email;
  const query = "SELECT cart FROM usercart WHERE email = ?";
  db.query(query, email, (err, results) => {
    if (err) {
      res.send({ success: false, msg: "Cannot fetch from database" });
    }

    if (results.length > 0 && results[0].cart != undefined) {
      res.send({
        cart: JSON.parse(results[0].cart),
        success: true,
        msg: "Cart fetched successfully",
      });
    } else {
      res.send({ success: false, msg: "Cart Not Found" });
    }
  });
});

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

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`app is running on port${port}`);
});
const stripe = Stripe(
  "sk_test_51NDIgmQY69KQ4gJj7BpV9kB0DVHmcByTZxjH6W0CNWofMoQWPsrkvBYs3VtooB0C0pQfToxq2DeAtwxXU8pEJ1Nq00UhvDUfzz"
);
app.post("/api/checkout", async (req, res) => {
  try {
    const { products, tax, discount, shipping } = req.body;
    console.log("checkout", products);
    const lineItems = products.map((product) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
          images: [product.image_main],
          metadata:{product_id:product.id}
        },
        unit_amount: Math.round(product.stock.small.price * 100),
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
          unit_amount: Math.round(-discount * 100), // negative amount for discount
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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:5173/paymentSuccess?checkout=true",
      cancel_url: "http://localhost:5173/paymentFail",
      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true, // Enable phone number collection
      },
    });

    res.send({ id: session.id });
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
