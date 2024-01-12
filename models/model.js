var connection = require('../db.js');
function createConnection(){
   
  connection.connect((err)=>{
    if(err)console.log(err);
  });

  var createUserTableQuery = `
        CREATE TABLE IF NOT EXISTS url (
          session_id varchar(100),
          shortID VARCHAR(200) ,
          redirecturl VARCHAR(300) ,
          visithistory INT,
          unique key(shortID)
      );
      `;

    connection.query(createUserTableQuery, function (error) {
      if (error) throw error;
      console.log('SCHEMA CREATED ');
    });
    createUserTableQuery = `create table if not exists users(
      username varchar(100) unique NOT NULL,
      password varchar(20) NOT NULL,
      session_id varchar(100),
      primary key(session_id)
    );`;
    connection.query(createUserTableQuery, function (error) {
      if (error) throw error;
      console.log('SCHEMA CREATED ');
    });
}
module.exports = {createConnection};
