//export from here to main
exports.upper = (text) => {

    let newArr = [];
    text = text.split(' ');//text as array

    text.forEach(item => {
        item = item.split('');//word as array
        item[0] = item[0].toUpperCase();//1 letter of word to upperCase
        newArr.push(item.join(''))//push elements in array
    });

    return newArr.join(' ')//from array to text
};

exports.fib = (n)=> {
    let prev = 0, next = 1;
    for (let i = 0; i < n; i++) {
        next = prev + next;
        prev = next - prev;
        console.log(next);
    }
};

exports.minus = (arr) => {
    return Array.from(new Set(arr));//create new array from existing
    //set need only unique elements
};

exports.substraction = (one, two) => {

    let sec = (one - two) / 1000;//return in miliseconds , then we divide to 1000
    let num = 604800;
    let days = Math.floor(sec/num);

    console.log(`Тижні: ${days}`);
    console.log(`Дні: ${sec/86400}`);
    console.log(`Секунди: ${sec}`);
};

exports.merge_sort = function (array) {

    function merge(left, right) {
        let result = [];
        let il = 0;
        let ir = 0;
        while (il < left.length && ir < right.length) {
            if (left[il] < right[ir]) {
                result.push(left[il++]);
            } else {
                result.push(right[ir++]);
            }
        }

        return result.concat(left.slice(il)).concat(right.slice(ir));
    }

    function merge_sort(items) {
        //when it is only 1 element
        if (items.length < 2) {
            return items;
        }
        let middle = Math.floor(items.length / 2);
        //create two arrays
        let left = items.slice(0, middle);
        let right = items.slice(middle);
        return merge(merge_sort(left), merge_sort(right));
    }

    return merge_sort(array);
};