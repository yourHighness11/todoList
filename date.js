//exporting module
module.exports.getMyDate =function() {
    
    const myDay = new Date();

    const options = {
        day: 'numeric',
        weekday: 'long',
        month: 'long'

    }

    const day = myDay.toLocaleDateString('en-US', options);
    return day;

}


// //exporting module
// module.exports.getMyDay = function() {
//     const myDay = new Date();

//     const options = {        
//         month: 'long'
//     }

//     const day = myDay.toLocaleDateString('en-US', options);
//     return day;

// }

// console.log(module.exports);



    
