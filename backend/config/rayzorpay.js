import Rayzorpay from "rayzorpay";

exports.instance = new Rayzorpay({
    key_id: process.env.RAYZORPAY_KEY_ID,
    key_secret: process.env.RAYZORPAY_KEY_SECRET

});