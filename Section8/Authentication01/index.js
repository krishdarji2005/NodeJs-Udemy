import { error } from "console";
import express from "express";
const app = express();

const PORT = 8000;

app.use(express.json());

const DIARY = {};
const EMAILS = new Set();

app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  if (EMAILS.has(email)) {
    return res.status(400).json({ error: "Email is already present in DB" });
  }
  //else create a token for user

  const token = `${Date.now()}`;
  DIARY[token] = { name, email, password }; //do entry in diary
  EMAILS.add(email);

  return res.json({ status: "sucess", token });
});

app.post('/me',(req,res)=>{
  const {token}=req.body;
  if(!token){
    return res.status(400).json({error:'Missing token'});
  }
  if(!(token in DIARY)){
    return res.status(400).json({error:'Invalid token '});
  }
  const entry = DIARY[token];

  return res.json({data: entry })  
})
app.post('/private-data',(req,res)=>{
  const {token}=req.body;

  if(!token){
    return res.status(400).json({error:'Missing token'})
  }
  if(!(token in DIARY)){
    return res.status(400).json({error:"Invalid token"});
  }

  return res,json({data: {privateData:"Access Granted"}})

})
app.listen(PORT, () => {
  console.log(`App is listening on PORT ${PORT}`);
});
