const {Sequelize} = require('sequelize');

const sequelize = new Sequelize("jetchat", "root", "jetimob1", {
    host: "localhost",
    dialect: "mysql"
});

sequelize.authenticate().then(function(){
    console.log("Conectado com sucesso!");
}).catch(function(erro){
    console.log("Falha ao se conectar");
});
    

module.exports = sequelize;