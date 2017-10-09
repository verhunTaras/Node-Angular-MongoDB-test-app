var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var session = require('express-session');
var cookieParser = require('cookie-parser');

mongoose.Promise = global.Promise;
mongoose.connect(
    'mongodb://localhost/avtoparts', 
    { useMongoClient: true }
);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log("Connected!!!")
});
app.use(cookieParser());
app.use(express.static('front-end'));
app.use(bodyParser.json());
app.use(session({
    key: 'user_sid',
    secret: 'Ldsgsadggfasdndad',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});
var preAuth = function(req, resp, next){
    if(req.session && req.session.user){
        return next();
    }else{
        return resp.sendStatus(401);
    }
}

var shopSchema = mongoose.Schema({
    name:String,
    address:String,
    phone:String
});
var Shop = mongoose.model('shops', shopSchema);

var userSchema = mongoose.Schema({
    login:String,
    password:String
});
var User = mongoose.model('user', userSchema);

var carSchema = mongoose.Schema({
    name:String,
    model:String,
    year:String,
    shopId:String,
    engine:String
});
var Car = mongoose.model('cars', carSchema);

var partSchema = mongoose.Schema({
    name:String,
    code:String,
    additionals:String,
    shopId:String,
    price:Number,
    carId:String
});
var Part = mongoose.model('parts', partSchema);



app.post('/login', function(req, resp){
    User.findOne({login:req.body.login}).exec().then(
        res=>{
            var hash = res.password;
            var password = req.body.password;
            if(bcrypt.compareSync(password, hash)){
                req.session.user = res;
                resp.sendStatus(204);
            }else{
                resp.sendStatus(401);
            }
        },
        err=>{
            console.log(err);
            resp.sendStatus(401);
        }
    );
});

app.post('/registration', function(req, resp){
    var salt = bcrypt.genSaltSync();
    req.body.password = bcrypt.hashSync(req.body.password, salt);
    new User(req.body).save().then(
        res=>resp.sendStatus(204),
        err=>resp.sendStatus(500)
    );
});

app.get('/shops', function(req, resp){
    Shop.find().exec().then(
        res=>resp.json(res),
        err=>resp.sendStatus(500)
    );
});
app.post('/shops', function(req,resp){
    new Shop(req.body).save().then(
        res=>resp.sendStatus(204),
        err=>resp.sendStatus(500)
    );
});
app.delete('/shops/:id', function(req, resp){
    Shop.remove({_id: req.params.id}).then(
        res=>resp.sendStatus(204),
        err=>resp.sendStatus(500)
    );
});
app.put('/shops/:id', function(req, resp){
    Shop.update(
        {_id: req.params.id},
        {$set:{name:req.body.name,
              address:req.body.address,
              phone:req.body.phone}}
    ).then(
        res=>resp.sendStatus(204),
        err=>resp.sendStatus(500)
    );
});
app.get('/cars/:id', function(req, resp){
    Car.find({shopId:req.params.id}).exec().then(
        res=>resp.json(res),
        err=>resp.sendStatus(500)
    );
});
app.post('/cars', function(req,resp){
    new Car(req.body).save().then(
        res=>resp.sendStatus(204),
        err=>resp.sendStatus(500)
    );
});
app.put('/cars/:id', function(req, resp){
    Car.update(
        {_id: req.params.id},
        {$set:{name:req.body.name,
              engine:req.body.engine,
              year:req.body.years,
              model:req.body.model}}
    ).then(
        res=>resp.sendStatus(204),
        err=>resp.sendStatus(500)
    );
});
app.delete('/cars/:id', function(req, resp){
    Car.remove({_id: req.params.id}).then(
        res=>resp.sendStatus(204),
        err=>resp.sendStatus(500)
    );
});
app.get('/cars/:shopId/parts/:carId', function(req, resp){
    Part.find({shopId:req.params.shopId,carId:req.params.carId}).exec().then(
        res=>resp.json(res),
        err=>resp.sendStatus(500)
    );
});
app.post('/parts', function(req,resp){
    console.log(req.body);
    new Part(req.body).save().then(
        res=>resp.sendStatus(204),
        err=>{console.log(err);resp.sendStatus(500);}
    );
});
app.put('/parts/:id', function(req, resp){
    Part.update(
        {_id: req.params.id},
        {$set:{name:req.body.name,
              code:req.body.code,
              additionals:req.body.additionals,
              price:req.body.price}}
    ).then(
        res=>resp.sendStatus(204),
        err=>resp.sendStatus(500)
    );
});
app.delete('/parts/:id', function(req, resp){
    Part.remove({_id: req.params.id}).then(
        res=>resp.sendStatus(204),
        err=>resp.sendStatus(500)
    );
});

app.listen(3000, function(){
    console.log('Connected, Taras')
})