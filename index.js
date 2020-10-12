var express = require('express')
var shortid = require('shortid');
var cookieParser = require('cookie-parser')
var app = express()
var port = 3000;
var userRoute = require('./route/user_route')
var productRoute = require('./route/product_route')
var cartRoute = require('./route/cart_route');
const bodyParser = require('body-parser')

const { sql, createPool } = require('slonik');
const { connection } = require('pg');
const { render } = require('ejs');
const pool = createPool('postgres://postgres:12394nph@localhost:5432/project_ecommerce');

app.set('view engine', 'ejs');
app.set('views', './view/browser')

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.static('view/browser'));
app.use(cookieParser())
app.use('/account', userRoute);
app.use('/product', productRoute);
app.use('/cart', cartRoute);


app.get('/home', (req, res) => {
  if(req.cookies.user_id){
  pool.connect(async (connection) => {
    const result = await connection.query(sql`select user_name from public.user where user_id = ${req.cookies.user_id}`);
    res.render('index', {
      userId: result.rows[0].user_name,
    })
  })}else{
    res.render('index',{
      userId:"",
    })
  }
});

app.get('/logOut', (req, res) => {
  res.clearCookie('user_id');
  console.log('cookie`s deleted')
  res.redirect('/home')
})


app.listen(port, (req, res) => {
  console.log('connect sucessfully, lisening to ' + port);
})