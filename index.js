require("dotenv").config()
require("express-async-errors");

const express = require("express");
const app =express();
// important pacages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cores = require("cors")
const connectDB = require("./db/connect");

//routers
const authRouter = require("./routes/authRout");

//middleware imports
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(cores()) //for make server rechible to react
// routs call
app.get("/", (req, res)=>{
   
    res.send("E-commers-api");
});
app.get("/api/v1", (req, res) => {
 console.log(req.signedCookies );
  res.send("E-commers-api");
});

app.use("/api/v1/auth", authRouter);


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000
const start = async ()=>{
    try {
       await  connectDB(process.env.MONGO_URI);
        app.listen(port, ()=>{
            console.log("Server is listening on port "+ port);
        })
    } catch (error) {
        console.log(error)
    }
}
start();