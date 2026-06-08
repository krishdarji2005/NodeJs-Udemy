const EventEmitter = require("events")

class ChatRoom extends EventEmitter{
  constructor(){
    super()
    this.users = new Set();
  }

  join(user){
    this.users.add(user);//joined chat
    this.emit('join',user)
  }

  sendMessage(user,message){
    //active user ka part then only allow
    if(this.users.has(user)){
      this.emit('message',user,message)
    }
    else{
      console.log(`${user} is not in chat`);
    }
  }

  leave(user){
    if(this.users.has(user)){
      this.users.delete(user);
      this.emit('left',user)
    }
    else{
      console.log(`${user} is not in chat`)
    }
  }
}

module.exports = ChatRoom