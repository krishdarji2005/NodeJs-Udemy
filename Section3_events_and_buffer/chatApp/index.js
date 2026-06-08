const ChatRoom = require("./chatRoom.js")

const chat = new ChatRoom(); //obj of that class

chat.on("join",(user)=>{
  console.log(`${user} has joined the chat`);
})

chat.on("message",(user,message)=>{
  console.log(`${user} : ${message}`);
});
chat.on("leave",(user)=>{
  console.log(`${user} has left the chat not world`)
})

//simulating chat
chat.join('Alice')
chat.join('bob')

chat.sendMessage("Alice","Hey bob , hi y'all ")
chat.sendMessage("bob","Hey Alice , hi ")

chat.leave('Alice')
chat.sendMessage("Alice","Hey bob , ilil... ")

