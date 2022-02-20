let counter = 0;

for (let i = 0; i < 5; i++) {
    let str = i + '=>'
    for (let j = 0; j < i; j++) {
        str += counter + ' '
        counter++;
    }
    console.log(str);
}