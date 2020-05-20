const {minus, fib, substraction, upper, merge_sort} = require('./allTask')
const GoodsAtTheStore = require('./goodsAtthestire');
const Goods = require('./goods');
const Shop = require('./shop');
const Store = require('./stores');


// 1. Реалізувати злиття масиву слів у стрічку. Допустим є написання функцій.
console.log('1. Реалізувати злиття масиву слів у стрічку. Допустим є написання функцій.');

let text = ['My', 'name', 'is', 'Viktoriia'];
text = text.join(' ');
console.log(text);

// 2. Написати функцію, яка першу літеру кожного слова речення переведе у верхній регістр
console.log('2. Написати функцію, яка першу літеру кожного слова речення переведе у верхній регістр')
let newText = 'my name is viktoriia';

console.log(upper(newText));

// 3. Написати функцію, яка порахує перші n числа Фібоначі
console.log('3. Написати функцію, яка порахує перші n числа Фібоначі');
fib(8);

// 4. Написати функцію, яка видалить усі дублі із масиву стрічок
console.log('4. Написати функцію, яка видалить усі дублі із масиву стрічок');

let arr = ['My', 'name', 'is', 'Viktoriia','My', 'name', 'is', 'Viktoriia'];

console.log(minus(arr));

// 5. Написати функцію, яка порахує різницю між датами у днях/тижнях/секундах.
console.log('5. Написати функцію, яка порахує різницю між датами у днях/тижнях/секундах.');

let first = new Date(2020, 11, 12);//month from 0
let second = new Date(2019, 11, 5);


substraction(first, second);

// 6. Написати реалізацію сортування злиттям масиву
console.log('6. Написати реалізацію сортування злиттям масиву');

console.log(merge_sort([100, 4, 8, 2, 14, 5, 7, 9, 435, 7, 68, 78, 45, 34, 23,]));


// 7. Реалізувати з допомогою прототипів або класів такі інформаційні об’єкти

let shops = [new Shop('Viktoriia', 'vv', []), new Shop('Vic', 'ww',[])];
let stores = [new Store(1, 1,  [303]), new Store(2, 120, [])];
let goods = [new Goods('Viv', 3), new Goods('cccc', 46)];
let GoodsAtTheStores = [];


// Додавання нового магазину в колекцію
let addNewShop = (newShop) => {
    shops.push(newShop)
};

// b. Редагування магазину в колекції
let editShop = (shop, newName, newSpac) =>{
    shop.name = newName;
    shop.specialization = newSpac;
};

// c. Видалення магазину з колекції
let deleteShop = (shop) =>{
    shops.forEach((value,index, array) => {
        if(shop.name === value.name &&
            shop.specialization === value.specialization ) array.splice(index, 1)
    })
};

// d. Пошук одного магазину в колекції
let findShop = (shop) =>{
    let aweShop;

    shops.forEach((value,index, array) => {
        if(shop.name === value.name &&
            shop.specialization === value.specialization ) aweShop = value;
    })
};

// e. Додавання товару в колекцію
let addGoods = (newGoods) =>{
    goods.push(newGoods)
};

// f. Редагування товару в колекції
let editGoods = (good, newName, newNumb) =>{
    good.name = newName;
    good.number = newNumb;
};

// g. Видалення товару з колекції
let delateGoods = (goods) =>{
    goods.forEach((value,index, array) => {
        if(goods.name === value.name &&
            goods.number === value.number ) array.splice(index, 1)
    })
};

// h. Пошук одного товару в колекції
let findGoods = (good) =>{
    let aweGoods;

    goods.forEach((value,index, array) => {
        if(good.name === value.name &&
            good.number === value.number ) aweGoods = value;
    })
};

// i. Додавання складу в колекцію
let addStore = (store) =>{
    stores.push(store)
};

// j. Редагування складу в колекції
let editStores = (store, number) =>{
    store.number = number;
};

// k. Видалення складу з колекції
let deleteStore = (store) =>{
    stores.filter((value, index) => {
        if(value === store) stores.splice(index,1)
    })
};
// deleteStore(stores[0]);

// l. Пошук складу в колекції
let findStore = (store) =>{
    stores.filter((value, index) => {
        if(value === store) console.log(`Наш магазин з номером ${value.number}`)
    });
    console.log(store);
};

findStore(stores[0])

// m. Доставка товару на склад
let deliveredGoods = (good, store) =>{
    stores.filter((value, index) => {
        if(value === store) value.goods.push(good.number);
    });
};
deliveredGoods(goods[0], stores[0]);

// n. Видалення товару зі склад
let deleteGoodsInStore = (good, store) =>{
    stores.filter((value, index) => {
        if(value === store) {
            let mas = store.goods;
            mas.forEach((tovar, ind, arr) =>{
                if(tovar === good.number){
                    arr.splice(ind, 1)
                }
            })
        }
    });
};
// deleteGoodsInStore(goods[0], stores[0]);

// o. Трансфер товару із складу на склад
let transverGoods = (fromStore, toStore, good) =>{

    let delivered;

    stores.filter(value => {
        if(value === fromStore) {
            let mas = fromStore.goods;
            mas.forEach((tovar, index, arr) =>{
                if(tovar === good.number)  delivered = arr.splice(index, 1)
            })
        }
    });
    stores.filter(value => {
        if (value === toStore){
            value.goods.push(delivered[0])
        }
    });
};

//transverGoods(stores[0], stores[1], goods[0]);

// p. Відвантаження товару в магазин із складу
let goodsForShop = (shop, store, good) =>{
    let aweGood;

    stores.filter((value, index) => {
        if(value === store) {
            let mas = store.goods;
            mas.forEach((tovar, ind, arr) =>{
                if(tovar === good.number){
                    aweGood = arr.splice(ind, 1)
                }
            })
        }
    });

    shops.filter(value => {
        if(value === shop) shop.goods.push(aweGood[0])
    })

};

goodsForShop(shops[0], stores[0], goods[0]);

