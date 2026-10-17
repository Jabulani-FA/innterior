const express = require ('express')
const mongoose = require ('mongoose')
const cors = require ('cors')
const fs = require('fs')
const morgan = require ('morgan')
const bodyParser = require ('body-parser')
require('dotenv').config()
const auth = require("./routes/auth")
const category = require("./routes/category")
const cloudinary = require("./routes/cloudinary")
const coupon = require("./routes/coupon")
const product = require("./routes/product")
const sub = require("./routes/Sub")
const roomDesign = require("./routes/roomDesign")
const application = require("./routes/application")

const allowOrigins = [
    "https://innterior.vercel.app",
  "https://innteriors.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  ...(process.env.CLIENT_ORIGINS || "").split(",").map((origin) => origin.trim()).filter(Boolean),
]

const app = express()

//db
// mongoose.connect(process.env.DATABASE)
// .then(() => console.log("DB CONNECTED"))
// .catch((err) => console.log("DB CONNECTION ERR:", err))


//middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like curl or Postman)
        if (!origin || allowOrigins.includes(origin)) {
            callback(null, true);
        }else{
            callback(new Error("CORS not allowed from this origin"))
        }
    },
    credentials: true
}))

app.get("/", (req, res) => {
  res.json("Welcome to the server");
});
// app.use("/api/birthday", birthday);
// app.use("/api/upload", cloudinary);

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("CONNECTED TO DB"))
  .catch((err) => console.log("FAILED CONNECTING TO DB -->", err));


//routes
// fs.readdirSync('./routes').map((r)=>app.use('/api', require('./routes/'+ r)))
app.use("/api", auth)
app.use("/api", category)
app.use("/api", sub)
app.use("/api", cloudinary)
app.use("/api", coupon)
app.use("/api", product)
app.use("/api", roomDesign)
app.use("/api", application)

//port
const port = process.env.PORT || 8000;

app.listen(port, console.log(`server is running on port ${port}`))