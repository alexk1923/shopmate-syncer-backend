import pg from 'pg';

function connectToDatabase() {

  const client = new pg.Client({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: Number(process.env.POSTGRES_PORT),
  })
  
  
  client.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

}



export default connectToDatabase;