const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bcrypt = require('bcrypt')

const conn = require('./db/conn.js')
const Usuario = require('./models/Usuario.js')

const PORT = 3000
const hostname = 'localhost'

let log = false
/* ------------ Configuração express --------------- */

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static('public'))
/* ------------ Configuração express-handlebars ---- */

app.set('view engine', 'handlebars')
app.engine('handlebars', exphbs.engine())
/* ------------------------------------------------- */

app.get('/logout', (req,res)=>{
    log = false
    res.render('home', {log})
})
app.post('/login', async (req,res)=>{
    const email = req.body.email
    const senha = req.body.senha

    const pesquisa = await Usuario.findOne({raw : true, where : {email:email}})
    
    console.log(pesquisa)
    
    if(pesquisa == null){
        console.log(`Usuário não encontrado`)
        res.status(200).redirect('/')
    }else{
        //Comparando a senha com o hash
        bcrypt.compare(senha, pesquisa.senha, (err,result)=>{
            if(err){
                console.log(`Erro ao comparar a senha ${err}`)
                res.render('home',{log})
            }else if(result){
                log = true
                console.log(`Usuário existe`)
                res.render('home',{log, nome:pesquisa.nome})
            }else{
                console.log(`Senha incorreta`)
            }
        })
    }
})
app.get('/login', (req,res)=>{
    res.render('login',{log})
})
app.post('/cadastro', async (req,res)=>{
    const nome = req.body.nome
    const email = req.body.email
    const telefone = req.body.telefone
    const senha = req.body.senha
    
    console.log(nome,email,telefone,senha)

    bcrypt.hash(senha, 10, async (error,hash)=>{
        if(error){
            console.error(`Erro ao criar a senha devido ao erro ${error}`)
            res.render('home',{log})
            return
        }
        try {
            await Usuario.create({nome:nome, email:email, telefone:telefone, senha:hash})
            console.log(`\n`)
            console.log(`Senha criptografada`)
            console.log(`\n`)

            log = true
            const pesq = await Usuario.findOne({raw:true,where:{nome:nome,senha:hash}})
            console.log(pesq)
            res.render('home',{log})
        } catch (error) {
            console.log(`Erro ao criar a senha ${error}`)
            res.render('home',{log})
        }
    })
})
app.get('/cadastro',(req,res)=>{
    res.render('cadastro',{log})
})
app.get('/logout',(req,res)=>{
    res.render('logout',{log})
})
app.get('/', (req,res)=>{
    res.render('home',{log})
})

/* ------------------------------------------------- */

conn.sync().then(()=>{
    app.listen(PORT,hostname, ()=>{
        console.log(`Servidor Rodando em ${hostname}:${PORT}`)
    })
}).catch((error)=>{
    console.error('Erro de conexão com o banco de dados!')
})