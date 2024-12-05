import mongoose from "mongoose";
dotenv.config();

exports.connect = () => {
    mongoose
        .connect(process.env.MONGO_URL,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }

        )
        .then(() => console.log("Database connected"))
        .catch((err) => console.log(err));
};
