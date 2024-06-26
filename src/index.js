import dotenv from "dotenv";
import connectDB from "./db/indexDB.js";
import app from "./app.js";
dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5000 , ()=>{
        console.log(`Server is listening on ${process.env.PORT}`)
    })
  })
  .catch((error) => {
    console.log(`Error while connecting to server: `, error);
  });
