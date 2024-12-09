import nodemailer from "nodemailer";

export async function sendOrderConfirmationEmail(products, email='zakwanalam07@gmail.com') {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        secure: true,
        port: 465,
        auth: {
            user: "zakwanalam07@gmail.com",
            pass: "sjjc nwls uqxr nqjs",
        },
    });

    try {
        // Generate the product rows dynamically
        const productRows = products
            .map((product) => {
                const totalPrice = (product.price * product.quantity).toFixed(2);
                return `
                    <tr style="border-bottom: 1px solid #ddd;">
                        <td style="padding: 10px 15px;">
                            <img src="${product.image_main}" alt="${product.name}" style="width: 50px; height: 50px; margin-right: 10px; vertical-align: middle;">
                            <span style="vertical-align: middle;">${product.name}</span>
                        </td>
                        <td style="padding: 10px 15px; vertical-align: middle;">${product.quantity}</td>
                        <td style="padding: 10px 15px; vertical-align: middle;">$${product.price.toFixed(2)}</td>
                        <td style="padding: 10px 15px; text-align: right; vertical-align: middle;">$${totalPrice}</td>
                    </tr>
                `;
            })
            .join("");

        // Calculate total
        const subtotal = products.reduce(
            (acc, product) => acc + product.price * product.quantity,
            0
        );
        const shippingCost = 10; // Flat rate shipping
        const tax = subtotal * 0.13; // Example tax rate: 13%
        const total = (subtotal + tax + shippingCost).toFixed(2);

        const info = await transporter.sendMail({
            to: email,
            subject: "Foot Finesse - Order Confirmation",
            html: `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Product Order Confirmation</title>
                </head>
                <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0; color: #333;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f9f9f9">
                        <tr>
                            <td align="center" valign="top">
                                <table cellpadding="0" cellspacing="0" border="0" width="600" bgcolor="#ffffff" style="border: 1px solid #ddd; border-radius: 10px; padding: 20px;">
                                    <tr>
                                        <td align="center" style="padding-bottom: 20px;">
                                            <h1 style="color: #600CF7;">Thank You for Your Order!</h1>
                                            <p>Your order has been successfully placed.</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <h2>Order Details:</h2>
                                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border: 1px solid #ddd; border-radius: 10px; padding: 10px;">
                                                <thead>
                                                    <tr style="background-color: #f5f5f5;">
                                                        <th style="padding: 10px; text-align: left;">Product</th>
                                                        <th style="padding: 10px; text-align: left;">Quantity</th>
                                                        <th style="padding: 10px; text-align: left;">Unit Price</th>
                                                        <th style="padding: 10px; text-align: right;">Total Price</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    ${productRows}
                                                </tbody>
                                                <tfoot>
                                                    <tr>
                                                        <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Subtotal</td>
                                                        <td style="padding: 10px; text-align: right;">$${subtotal.toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Shipping</td>
                                                        <td style="padding: 10px; text-align: right;">$${shippingCost.toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Tax</td>
                                                        <td style="padding: 10px; text-align: right;">$${tax.toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Total(after gst)</td>
                                                        <td style="padding: 10px; text-align: right; font-weight: bold;">$${total}</td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>`,
        });

        console.log("Message sent: %s", info.messageId);
        return { success: true, message: "Order confirmation email sent successfully." };
    } catch (error) {
        console.error(error, "Error in sending order confirmation email");
        return { success: false, message: "Failed to send order confirmation email." };
    }
}
