// const EventEmitter = require("events")
// //^ Class blueprint (No data storage)

// //V Object instance (Allocates memory/registry for events)
// const emitter = new EventEmitter();

const EventEmitter = require("events")

const eventEmitter = new EventEmitter()

//listener
eventEmitter.on('greet',(dataAccept)=>{
  console.log(`Hello welcome to events in nodejs ${dataAccept} `)
})

eventEmitter.on('sayBye',(takeName)=>{
  console.log(`Bye ${takeName} `)
})

eventEmitter.on('sayBye',(takeName)=>{
  console.log(`Bye Bye ${takeName} `)
})

//this will run only once even if called twice thrice..
eventEmitter.once('pushNotify',()=>{
  console.log("This event will run only once")
})


//emit the event
// eventEmitter.emit('greet') //trigger event or called the event

//passing data when triggering

//emit the event
eventEmitter.emit('greet','krishDataSending')
eventEmitter.emit('greet','TimePassDataSending')
eventEmitter.emit('pushNotify')
eventEmitter.emit('pushNotify')
eventEmitter.emit('greet','JioHotstar')


const myListener = ()=>{
  console.log("I am a test Listener");
}
eventEmitter.on("test",myListener);
eventEmitter.emit("test")
console.log(`On event test listeners are ${eventEmitter.listeners("test")}`)

//removing listener
eventEmitter.removeListener("test",myListener)
console.log(eventEmitter.listeners("test"))
console.log(`On event test listeners are ${eventEmitter.listeners("test")}`)


console.log(`On event test listeners are ${eventEmitter.listeners("greet")}`)


//event say bye has 2 listener
eventEmitter.emit("sayBye","kr")

console.log(eventEmitter.listeners("sayBye"))
