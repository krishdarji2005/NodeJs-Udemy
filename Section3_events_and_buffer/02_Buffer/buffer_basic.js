const { Buffer } = require("buffer");

// const buf = Buffer.alloc(4); // allocates a Node.js Buffer of length 4 bytes and assigns it to the constant binding named buf.(allocated memort to you )

// console.log(buf);//<Buffer 00 00 00 00>

const buf = Buffer.from("krishdarji")
// console.log(buf);
// console.log(`to string is ${buf.toString()}`);

// const bufTwo = Buffer.allocUnsafe(110) // The contents of the newly created Buffer are unknown and may contain sensitive data
// console.log(bufTwo.toString());

const buf3 = Buffer.alloc(10);//10 bytes
buf3.write('Hell')
console.log(buf3.toString());

const moji = Buffer.from('😂');
console.log(moji.toString());


const trybuf = Buffer.from("krish darji")
console.log(trybuf.toString());
console.log(trybuf.toString('utf-8',0,5));//0 to 5 index

//can change also buf[0]= 0x48

const one = Buffer.from("Krish");
const two = Buffer.from("Darji");
const merged = [[one,two]];
console.log(merged);
console.log(merged.toString());

