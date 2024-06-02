const mysql = require("mysql")

var mysqlConnection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Sourav@2000',
    database: 'productapp',
    port: 3306
})


mysqlConnection.connect((err)=>{
    if(!err){
        console.log("Connection done");
    }else{
        console.log("Connection failed"+JSON.stringify(err))
    }
})

module.exports = mysqlConnection;