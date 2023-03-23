const stripe = require("stripe")(process.env.STRIPE_API_KEY);

const calculateOrderAmount = (items) => {
  // compare on the database
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return items.total_amount + items.shipping_fee;
};

const stripeController = async (req, res) => {
  const { purchase, total_amount, shipping_fee } = req.body;

  const paymentIntents = await stripe.paymentIntents.create({
    amount: calculateOrderAmount({ total_amount, shipping_fee }),
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.json({ clientSecret: paymentIntents.client_secret });
};

module.exports = stripeController;
