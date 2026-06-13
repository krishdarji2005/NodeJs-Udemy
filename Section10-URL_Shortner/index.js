import express from 'express';
import userRouter from './routes/user.routes.js'
import {authenticationMiddleware} from './middlewares/auth.middleware.js'
import urlRouter from './routes/url.routes.js'
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());
app.use(authenticationMiddleware);
// app.use('/',(req,res)=>{
//   res.json({success:"rout is / "})
// })
app.use('/user',userRouter);
app.use(urlRouter);

app.listen(PORT,()=>{
  console.log(` server is Up and Running on PORT ${PORT}`);
})