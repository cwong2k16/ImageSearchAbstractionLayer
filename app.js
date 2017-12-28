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
    var relevantData = [];
    client.search(topic, {page: page}).then(function(image){
        for(var i = 0; i < image.length; i++){
            var jsonObj = {
                url: image[i].url,
                text: image[i].description,
                parentPage: image[i].parentPage
            };
            relevantData.push(jsonObj);
        }
        res.json(relevantData);
    });
});

app.listen(8003);