import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
dotenv.config();  
import apiRoute from "./routes/index.js"


const app = express();
app.use(express.json()); // <-- parses JSON body
app.use(express.urlencoded({ extended: true })); // <-- parses form data

app.use(cors());

const uploadFolder = path.join(process.cwd(), "src", "uploads");
app.use("/api/uploads", express.static(uploadFolder));

app.get("/", (req, res) => {
  res.send("Your api is working")
})

app.use("/api", apiRoute);

app.listen(process.env.PORT,() => {
  console.log(`app is listening on Port: ${process.env.PORT}`);
})