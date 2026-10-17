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
const dns = require("node:dns/promises");

const allowOrigins = [
  "https://innterior-compact-ten.vercel.app",
  "https://innterior.vercel.app",
  "https://innterior-transpire.vercel.app",
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

// mongoose
//   .connect(process.env.DATABASE, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("CONNECTED TO DB"))
//   .catch((err) => console.log("FAILED CONNECTING TO DB -->", err));


app.use(
  bodyParser.json({
    limit: "10mb",
  }),
);

app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "10mb",
  }),
);

// Sanitize connection URI to remove unsupported query options
const connectWithSanitizedUri = async () => {
  let uri = process.env.DATABASE;
  try {
    const parsed = new URL(uri);
    // remove deprecated/unsupported options if present
    parsed.searchParams.delete("useNewUrlParser");
    parsed.searchParams.delete("useUnifiedTopology");
    // use cleaned URI
    uri = parsed.toString();
  } catch (e) {
    // If URL parsing fails (unlikely), fall back to original URI
  }

  try {
    dns.setServers(["1.1.1.1", "8.8.8.8"]);
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Initial MongoDB connect error:", error);
    // If SRV DNS lookup was refused, attempt a mongodb:// seed-list fallback
    if (
      error &&
      error.code === "ECONNREFUSED" &&
      error.syscall === "querySrv" &&
      uri &&
      uri.startsWith("mongodb+srv://")
    ) {
      try {
        const parsed = new URL(uri);
        // known shard hosts for this cluster (will work for many Atlas clusters with same naming)
        const fallbackHosts = [
          "cluster0-shard-00-00.gq7yj.mongodb.net:27017",
          "cluster0-shard-00-01.gq7yj.mongodb.net:27017",
          "cluster0-shard-00-02.gq7yj.mongodb.net:27017",
        ];

        let auth = "";
        if (parsed.username) {
          auth = encodeURIComponent(parsed.username);
          if (parsed.password)
            auth += ":" + encodeURIComponent(parsed.password);
          auth += "@";
        }

        const dbPath = parsed.pathname || "/";
        // ensure TLS/SSL and common Atlas options for seed-list connection
        if (
          !parsed.searchParams.has("ssl") &&
          !parsed.searchParams.has("tls")
        ) {
          parsed.searchParams.set("tls", "true");
        }
        if (!parsed.searchParams.has("authSource")) {
          parsed.searchParams.set("authSource", "admin");
        }
        if (!parsed.searchParams.has("retryWrites")) {
          parsed.searchParams.set("retryWrites", "true");
        }
        if (!parsed.searchParams.has("w")) {
          parsed.searchParams.set("w", "majority");
        }

        const fallbackUri = `mongodb://${auth}${fallbackHosts.join(",")}${dbPath}${parsed.search ? parsed.search : ""}`;
        console.log(
          "Attempting fallback MongoDB URI:",
          fallbackUri.replace(/:[^:@]+@/, ":*****@"),
        );
        await mongoose.connect(fallbackUri);
        console.log("Connected to MongoDB via fallback seed-list");
        return;
      } catch (fallbackErr) {
        console.error("Fallback MongoDB connect error:", fallbackErr);
      }
    }
    process.exit(1);
  }
};

connectWithSanitizedUri();



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