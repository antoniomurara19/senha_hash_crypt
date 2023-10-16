const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('back_ind_2','root','senai',{
    host: 'localhost',
    dialect: 'mysql'
})

// sequelize.authenticate().then(()=>{
//     console.log('Conexão realizada')
// }).catch((error)=>{
//     console.error('Conexão Falha'+error)
// })

module.exports = sequelize