const express=require('express');
const request = require('request');
const googleTrends = require('google-trends-api');
const router=express.Router();
const error_message = "Server encountered an internal error."

router.get('/:searchTerm', (req, resp, next) => {
    /*var url="https://content.guardianapis.com/search?order-by=newest&show-fields=starRating,headline,thumbnail,short-url&api-key="+apikey;
    request(url, { json: true }, (err, res, body) => {
        try{
              if (err) { return console.log(err); }
                    verify_articles(body);
                    resp.status(200).json(body);
        } catch(e) {
            console.log(e);
            return resp.status(500).json(error_message);
        }

    });*/
    var searchTerm=req.params.searchTerm;
    googleTrends.interestOverTime({keyword: searchTerm, startTime: new Date('2019-06-01')})
    .then(function(results){
        resp.status(200).json(JSON.parse(results));
      //console.log(results);
    })
    .catch(function(err){
      console.error(err);
    });
});

module.exports=router;
