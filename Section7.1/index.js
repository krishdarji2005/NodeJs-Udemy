const db = require('./db')
const {userTable}=require('./drizzle/schema')




async function getAllUsers(){
  const users = await db.select().from(userTable);
  console.log('users in DB\n',users);
  
  return users;
}

async function createUser({id,name,email}) {
  await db.insert(userTable).values({
    id,
    name,
    email
  })
  
}
getAllUsers();
// createUser({id:1,name:'Krish',email:'krish@example.com'});
// createUser({id:2,name:'Iron',email:'iron@example.com'});