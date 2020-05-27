const express = require('express');
const pug = require('pug');
const path = require('path');
const mongoose = require("mongoose");
const app = express();
const {Storages} = require("./models/storage");
const {Good} = require("./models/good");
const {Shops} = require("./models/shop");
const cors = require('cors');


const bodyParser = require('body-parser');

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

const url = "mongodb://localhost:27017/shop";

const connect = mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.set('view engine', 'pug');


app.get('/', (req, res) => {
    res.render('index')
});


app.post('/addShop', (req, res) => {
    let info = req.body;

    (async () => {
        Shops.create({
            name: info.name,
            address: info.address,
            storage: []
        })

        let spops = await Shops.find({})

        res.send(200)
    })();



});

app.post('/editShop/:id', (req, res) => {
    let info = req.body;

    (async () => {
        await Shops.findOneAndUpdate({_id: req.params.id}, {$set:{
                name: info.name,
                address: info.address
            }
        })


        res.send(200)
    })();
});

app.post('/addGoods', (req, res) => {
    let info = req.body;


    (async () => {
        let some = await Good.find({})

        let check = some.some(value => {
           return  value.code === +info.code
        })

        if(check){
            res.send(200)
        } else {
            Good.create({
                code: info.code,
                name: info.name,
                country: info.country
            })

            res.send(200)
        }


    })();

});

app.post('/deleteGoodId/:id', ((req, res) => {
    (async () => {
        await Good.findOneAndDelete({_id: req.params.id})

        res.send(200)

    })();
}))

app.post('/editGoods/:id', (req, res) => {
    let info = req.body;

    (async () => {
        let some = await Good.findOne({_id: req.params.id});
        await Good.findOneAndUpdate({_id: req.params.id}, {$set:{
                name: info.name,
                country: info.country,
                code: some.code
            }
        })


        res.send(200)
    })();
});



app.post('/addStorage', (req, res) => {
    let info = req.body;


    (async () => {
        let some = await Storages.find({})

        let good = await Good.find({})

        let check = some.some(value => {
            return  value.code === +info.number
        })

        if(check){
            res.send(200)
        } else {
            Storages.create({
                number: info.number,
                capacity: info.capacity,
                goods: []
            })
            res.send(200)
        }
    })();

});
app.post('/deleteStorage/:id', ((req, res) => {
    (async () => {
        await Storages.findOneAndDelete({_id: req.params.id})

        res.send(200)

    })();
}))

app.get('/allShops', (req, res)=>{
    (async () => {

        let spops = await Shops.find({})
        console.log(spops);
        res.send(spops)
    })();
});

app.post('/deleteBtId/:id', ((req, res) => {
    (async () => {

        await Shops.findOneAndDelete({_id: req.params.id})
        let some = await Shops.find({})
        console.log(some);
        res.send(200)
    })();
}))

app.get('/allGoods', (req, res)=>{
    (async () => {

        let some = await Good.find({})
        res.send(some)
    })();

});

app.get('/allStorage', (req, res)=>{
    (async () => {

        let good = await Good.find({})
        let some = await Storages.find({})
        res.send(some)
    })();

});

app.post('/addGoodsToStorage/:id', ((req, res) => {
    let info = req.body;

    (async () => {
        console.log(req.params.id);
        let needStorage = await Storages.findOne({_id: req.params.id});
        if(needStorage.capacity === needStorage.goods.length){
            res.send(200)
        } else {
            let index = req.body.index

            let good = await Good.find({})
            await Storages.update({_id: req.params.id},{ $push: { goods: good[index] } })
            res.send(200)
        }


    })();

}));



app.listen(3000, () => {
    console.log(3000)
});
