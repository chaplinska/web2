const express = require('express');
const pug = require('pug');
const path = require('path');
const mongoose = require("mongoose");
const app = express();
const {Storages} = require("./models/storage");
const {Good} = require("./models/good");
const {Shops} = require("./models/shop");

app.use(express.json());
app.use(express.urlencoded());

const url = "mongodb://localhost:27017/shop";

const connect = mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'static', 'views', 'pages'));


class Shop {
    constructor(name, address, goodsInShop) {
        this.name = name;
        this.address = address;
        this.goodsInShop = goodsInShop;
    }
}
class Goods {
    constructor(code, name, country) {
        this.name = name;
        this.code = code;
        this.country = country;
    }
}
class Storage {
    constructor(number, magazine, capacity, goodsInStorage) {
        this.number = number;
        this.magazine = magazine;
        this.capacity = capacity;
        this.goodsInStorage = goodsInStorage;
    }
}
let accountant = (storage) => {
    let mas = [];
    storage.forEach(value => {
        let obj = {
            storage: value.number,
            goodsInStorage: value.goodsInStorage.length,
            goods: {},
            allGoods: value.capacity
        };

        value.goodsInStorage.forEach(goods => {
            obj.goods[goods.code] = obj.goods[goods.code] + 1 || 1;
        });

        mas.push(obj)
    });

    return mas
};
let shops = [new Shop('Пячерочка', 'Russia', []), new Shop('KeBab Nazzar', 'German', []),
    new Shop('Silpo', 'Ukraine', [])];
let goods = [new Goods(123, 'Meet', "usa"), new Goods(987, 'Apple', 'Ukraine'),
    new Goods(654, 'beef', 'OAE')];
let storage = [new Storage(1, shops[0], 12, [goods[0], goods[2]]),
    new Storage(2, shops[0], 12, [goods[1], goods[1]]),
    new Storage(3, shops[1], 5, [goods[2], goods[2]]),
    new Storage(4, shops[2], 12, [goods[0], goods[0]])];



app.get('/', (req, res) => {
    res.render('index')
});

app.get('/shop', (req, res) => {

    res.render('shop', {dataShop: shops})
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

        res.redirect('/allShops')
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


        res.redirect('/allShops')
    })();
});



app.get('/goods', (req, res) => {
    res.render('goods', {goods: goods})
});

app.post('/addGoods', (req, res) => {
    let info = req.body;


    (async () => {
        let some = await Good.find({})

        let check = some.some(value => {
           return  value.code === +info.code
        })

        if(check){
            res.render('collection/allGoods', {data: some})
        } else {
            Good.create({
                code: info.code,
                name: info.name,
                country: info.country
            })

            res.redirect('/allGoods')
        }


    })();

});

app.post('/deleteGoodId/:id', ((req, res) => {
    (async () => {
        await Good.findOneAndDelete({_id: req.params.id})

        res.redirect('/allGoods')

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


        res.redirect('/allGoods')
    })();
});

app.post('/editGoods', (req, res) => {
    let info = req.body;
    let index = info.index[0];

    goods[index] = new Goods(goods[index].code, info.name, info.country);
    res.render('goods', {goods: goods})
});

app.post('/deleteGoods', (req, res) => {
    let info = req.body;
    let index = info.index[0];

    goods.splice(index, 1);

    res.render('goods', {goods: goods, info: 'Товар видаленно!'})
});

app.post('/findGoods', (req, res) => {
    let info = req.body;

    let meet = goods.filter(value => {
        return value.code === +info.code
    });

    if (meet.length === 0) {
        res.render('goods', {goods: goods, find: 'Товар не знайдено!'})
    } else {
        res.render('goods', {goods: goods, find: `Товар ${JSON.stringify(meet[0])} знайдено!`})
    }
});

app.get('/storage', (req, res) => {
    res.render('storage', {data: storage, dataShop: shops})
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
            res.render('collection/allStorage', {data: some, goods: good})
        } else {
            Storages.create({
                number: info.number,
                capacity: info.capacity,
                goods: []
            })
            res.redirect('/allStorage')
        }
    })();

});
app.post('/deleteStorage/:id', ((req, res) => {
    (async () => {
        await Storages.findOneAndDelete({_id: req.params.id})

        res.redirect('/allStorage')

    })();
}))


app.post('/deleteStorage', (req, res) => {
    let info = req.body;
    let index = info.index[0];

    storage.splice(index, 1);

    res.render('storage', {data: storage, dataShop: shops, delets: 'Склад видалено'})
});

app.post('/findStorage', (req, res) => {
    let info = req.body;

    let meet = storage.filter(value => {
        return value.number === +info.number
    });

    if (meet.length === 0) {
        res.render('storage', {data: storage, dataShop: shops, find: 'Склад видалено'})
    } else {
        res.render('storage', {data: storage, dataShop: shops, find: `Склад ${JSON.stringify(meet[0])} знайдено!`})
    }
});

app.get('/workGoods', (req, res) => {

    res.render('workGoods', {goods: goods, data: storage, acc: accountant(storage)})
});

app.post('/addGoodsOnStorage', (req, res) => {
    let info = req.body;
    let indexGoods = info.indexGoods[0];
    let indexSt = info.index[0];

    if (storage[indexSt].goodsInStorage.length === storage[indexSt].capacity) {
        res.render('workGoods', {
            goods: goods,
            data: storage,
            info: `Товар не додано перевірте Місткість`,
            acc: accountant(storage)
        })
    } else {
        storage[indexSt].goodsInStorage.push(goods[indexGoods]);
        res.render('workGoods', {
            goods: goods, data: storage, acc: accountant(storage),
            info: `Товар ${goods[indexGoods].name} додано на склад N ${storage[indexSt].number}`
        })
    }

});

app.post('/deleteGoodsOnStorage', (req, res) => {
    let info = req.body;
    let indexGoods = info.indexGoods[0];
    let indexSt = info.index[0];
    let checker = 0;

    storage[indexSt].goodsInStorage.forEach((value, index, arr) => {
        if (value.code === goods[indexGoods].code && checker === 0) {
            arr.splice(index, 1);
            checker++;
        }
    });

    res.render('workGoods', {goods: goods, data: storage, acc: accountant(storage)})
});

app.get('/report', (req, res) => {
    res.render('report', {acc: accountant(storage)})
});

let storageChecker = (storage) => {
    let inStorage = accountant(storage);
    let end = [];

    inStorage.forEach((value, index) => {
        let conclusion = (value.goodsInStorage / value.allGoods) * 100;
        if (conclusion < 20) end.push(storage[index])
    });

    return end
};

app.post('/report', (req, res) => {
    console.log(storageChecker(storage));
    res.render('report', {acc: accountant(storage), data: storageChecker(storage)})
});

app.get('/goodsToShop', (req, res) => {
    console.log(storageRouter(storage, shops));
    res.render('goodsToShop', {data: storageRouter(storage, shops)})
});

let storageRouter = (storage, shops) => {
    let mas = [];
    shops.forEach(value => {
        let obj = {
            shop: value,
            storage: [],
            allGoods: []
        };

        let ok = storage.filter(stor => {
            return stor.magazine.name === value.name
        });

        ok.forEach((need, index) => {
            obj.storage.push(need);
            obj.allGoods.push(need.goodsInStorage)
        });

        let end = obj.allGoods.flat(2);
        obj.allGoods = end;

        mas.push(obj)

    });
    return mas
};
// req.params.id
app.get('/shops/:id', function (req, res, next) {
    res.render('info', {
        data: storageRouter(storage, shops)[req.params.id],
        shopka: shops[req.params.id],
        fix: req.params.id
    });
});

app.post('/shops/:id', (req, res) => {
    let body = req.body;

    let firstIndex = body.indexSt[0];
    let secondIndex = body.indexGoods[0];

    let shop = storageRouter(storage, shops)[req.params.id];

    shop.storage[firstIndex].goodsInStorage.forEach((value, index, arr) => {
        if (value.code === shop.allGoods[secondIndex].code) {

            shops[req.params.id].goodsInShop.push(arr.splice(index, 1));
            shops[req.params.id].goodsInShop = shops[req.params.id].goodsInShop.flat(2)
            console.log(shops[req.params.id].goodsInShop);
            res.render('info', {
                data: storageRouter(storage, shops)[req.params.id],
                shopka: shops[req.params.id],
                fix: req.params.id
            })
        } else res.render('info', {
            data: storageRouter(storage, shops)[req.params.id],
            shopka: shops[req.params.id],
            fix: req.params.id
        })
    })
    res.render('info', {
        data: storageRouter(storage, shops)[req.params.id],
        shopka: shops[req.params.id],
        fix: req.params.id
    })
});

app.get('/shops/:id/transfer', function (req, res, next) {
    res.render('transfer', {
        data: storageRouter(storage, shops)[req.params.id],
        shopka: shops[req.params.id],
        fix: req.params.id
    });
});

app.post('/shops/:id/transfer', ((req, res) => {
    let body = req.body;

    let from = body.indexOne[0];
    let to = body.indexTwo[0];
    let good = body.indexGoods[0];

    let shop = storageRouter(storage, shops)[req.params.id];

    shop.storage[from].goodsInStorage.forEach((value, index, arr) => {
        if (value.code === shop.allGoods[good].code) {

            shop.storage[to].goodsInStorage.push(arr.splice(index, 1));
            shop.storage[to].goodsInStorage = shop.storage[to].goodsInStorage.flat(2);
            res.render('transfer', {
                data: storageRouter(storage, shops)[req.params.id],
                shopka: shops[req.params.id],
                fix: req.params.id
            });
        } else res.render('transfer', {
            info: 'Помилка! Перевірте наявність товару',
            data: storageRouter(storage, shops)[req.params.id], shopka: shops[req.params.id], fix: req.params.id
        });
    });


}));

app.get('/allShops', (req, res)=>{
    (async () => {

        let spops = await Shops.find({})
        console.log(spops);
        res.render('collection/allShops', {data: spops})
    })();
});



app.post('/deleteBtId/:id', ((req, res) => {
    (async () => {

        await Shops.findOneAndDelete({_id: req.params.id})
        let some = await Shops.find({})
        console.log(some);
        res.render('collection/allShops', {data: some})
    })();
}))

app.get('/allGoods', (req, res)=>{
    (async () => {


        let some = await Good.find({})
        res.render('collection/allGoods', {data: some})
    })();

});

app.get('/allStorage', (req, res)=>{
    (async () => {

        let good = await Good.find({})
        let some = await Storages.find({})
        res.render('collection/allStorage', {acc: some, goods: good})
    })();

});

app.post('/addGoodsToStorage/:id', ((req, res) => {
    let info = req.body;

    (async () => {
        let needStorage = await Storages.findOne({_id: req.params.id});
        if(needStorage.capacity === needStorage.goods.length){
            res.redirect('/allStorage')
        } else {
            let index = info.indexGoods.split(':')[0]

            let good = await Good.find({})
            await Storages.update({_id: req.params.id},{ $push: { goods: good[index] } })
            res.redirect('/allStorage')
        }


    })();

}));


app.listen(3000, () => {
    console.log(3000)
});
