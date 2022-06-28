var express = require('express')
const async = require('hbs/lib/async')
var app = express()

app.set('view engine', 'hbs')
app.use(express.urlencoded({extended:true}))

const { ObjectId } = require('mongodb')
//duong dan den database
var url = 'mongodb+srv://TLaD27:minhduc030702@cluster0.va74tgn.mongodb.net/test'
//import thu vien mongodb
var MongoClient = require('mongodb').MongoClient;
app.get('/',async (req, res)=>{
    //1.ket noi den database server voi dia chi la url
    let client= await MongoClient.connect(url);
    //2.truy cap database ATNToys
    let dbo = client.db("Product");
    //tra ve toan bo bang product
    let products = await dbo.collection("goods").find().toArray()
    res.render('home',{'products': products})
})

app.post('/addProduct', async (req,res)=>{
    let name = req.body.txtName
    let price = parseInt(req.body.txtPrice)
    let picture = req.body.txtPicture
    let product = {
        'name': name,
        'price': price,
        'picture': picture
    }
    //insert product vao database
    //1.ket noi den database server voi dia chi la url
    let client = await MongoClient.connect(url);
    //2.truy cap database
    let dbo = client.db("Product");
    //3.insert product vao database ATNToys, trong table product
    await dbo.collection("goods").insertOne(product);
    res.redirect('/')
})
app.get('/add',(req,res)=>{
    res.render('addProduct')
})

app.post('/search',async (req, res)=>{
    let nameSearch = req.body.txtName
    let client = await MongoClient.connect(url);
    let dbo = client.db("Product");
    let products = await dbo.collection("goods").find({'name': new RegExp(nameSearch,'i')}).toArray()
    res.render('home',{'products': products})
})

app.get('/Sortalphabet', async(req,res)=>{
    //1.ket noi den database server voi dia chi la url
    let client= await MongoClient.connect(url);
    //2.truy cap database ATNToys
    let dbo = client.db("Product");
    //tra ve toan bo bang product
    let products = await dbo.collection("goods").find().sort({name: 1}).toArray()
    res.render('home',{'products': products})
})
app.get('/Sortprice', async(req,res)=>{
    //1.ket noi den database server voi dia chi la url
    let client= await MongoClient.connect(url);
    //2.truy cap database ATNToys
    let dbo = client.db("Product");
    //tra ve toan bo bang product
    let products = await dbo.collection("goods").find().sort({'price': -1}).toArray()
    res.render('home',{'products': products})
})

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log("Server is running!")