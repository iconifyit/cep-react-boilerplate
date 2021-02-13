// const fetch = require('node-fetch');

// let url = 'https://api.iconfinder.com/v4/icons/search';

// let options = {
//   method: 'GET',
//   qs: {query: 'arrow', count: '10'},
//   headers: {
//     Authorization: 'Bearer X0vjEUN6KRlxbp2DoUkyHeM0VOmxY91rA6BbU5j3Xu6wDodwS0McmilLPBWDUcJ1'
//   }
// };

// fetch(url, options)
//   .then(res => res.json())
//   .then(json => console.log(json))
//   .catch(err => console.error('error:' + err));

const Iconfinder = require('iconfinder');

Iconfinder
    .search({
        query : "avatar",
        count : 10,
        offset : 0,
        minimum_size : 1,
        maximum_size : 48
    })
    .then((data) => {
        getDetails(data.icons[0].icon_id)
    })
    .catch((err) => {
        console.error(err);
    });

const getDetails = (iconId) => {
    Iconfinder
        .info(iconId)
        .then(function(data){
            console.log(data);
        })
        .catch(function(err){
            console.error(err);
        });    
}