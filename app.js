var express = require('express');
var GoogleImages = require('google-images');
var client = new GoogleImages('001310055279050736320:1rkhztthlfo', 'AIzaSyC7YbQe674pVlTDHaZJN9j4-kASOVNCLiQ');

var app = express();

app.get('/api/GoogleImages/:query', function(req, res){
    var page = req.query.offset;
    if(page == null){
        page = 1;
    }
    var topic = req.params.query;

    client.search(topic, {page: page}).then(function(image){
        res.json(image);
    });
});

app.listen(8003);