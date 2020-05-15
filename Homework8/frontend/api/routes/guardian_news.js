const express=require('express');
const request = require('request');
const apikey='82ffd862-7f63-4adf-ab5f-b1166fcd3be4';
const router=express.Router();
const error_message = "Server encountered an internal error."

router.get('/category/', (req, resp, next) => {
    request('https://content.guardianapis.com/search?api-key='+apikey+'&section=(sport|business|technology|politics)&show-blocks=all', { json: true }, (err, res, body) => {
        try{
              if (err) { return console.log(err); }
                    verify_articles(body);
                    resp.status(200).json(body);
        } catch(e) {
            console.log(e);
            return resp.status(500).json(error_message);
        }

    });
});

router.get('/category/:section', (req, resp, next) => {
    const sec=req.params.section;
    request('https://content.guardianapis.com/'+sec+'?api-key='+apikey+'&show-blocks=all', { json: true }, (err, res, body) => {
        try {
            if (err) { return console.log(err); }
            verify_articles(body);
            resp.status(200).json(body);
        } catch(e) {
            console.log(e);
            return resp.status(500).json(error_message);
        }

        });
});

router.get('/article', (req, resp, next) => {
    const id=req.query.id;
    request('https://content.guardianapis.com/'+id+'?api-key='+apikey+'&show-blocks=all', { json: true }, (err, res, body) => {
          try {
                if (err) { return console.log(err); }
                resp.status(200).json(body);
          } catch(e) {
                console.log(e);
                return resp.status(500).json(error_message);
            }
        });
});

router.get('/search', (req, resp, next) => {
    const keyword=req.query.keyword;
    request('https://content.guardianapis.com/search?q='+keyword+'&api-key='+apikey+'&show-blocks=all', { json: true }, (err, res, body) => {
            try {
                if (err) { return console.log(err); }
                verify_articles(body);
                resp.status(200).json(body);
            } catch(e) {
              console.log(e);
              return resp.status(500).json(error_message);
          }
        });
});

function has_title(article) {
    var ans=(article.hasOwnProperty('webTitle') && article.webTitle !=null && article.webTitle != "");
    return ans;
}

function has_image(article) {
    let ans = false;
    if(article.hasOwnProperty('blocks') && article.blocks != null) {
        if(article.blocks.hasOwnProperty('main') && article.blocks.main != null ) {
            if(article.blocks.main.hasOwnProperty('elements') && article.blocks.main.elements != null && article.blocks.main.elements.length != 0  ) {
                if(article.blocks.main.elements[0].hasOwnProperty('assets') && article.blocks.main.elements[0].assets!=null) {
                    ans=true;
                }
            }
        }
    }
    return ans;
}

function has_section(article) {
    var ans= (article.hasOwnProperty('sectionId') && article.sectionId != null && article.sectionId != "");
    return ans;
}

function has_date(article) {
    var ans= (article.hasOwnProperty('webPublicationDate') && article.webPublicationDate != null && article.webPublicationDate != "") ;
    return ans;
}

function has_description(article) {
    let ans = false;
        if(article.hasOwnProperty('blocks') && article.blocks != null) {
            if(article.blocks.hasOwnProperty('body') && article.blocks.body != null && article.blocks.body != 0 ) {
                if(article.blocks.body[0].hasOwnProperty('bodyTextSummary') && article.blocks.body[0].bodyTextSummary != null && article.blocks.body[0].bodyTextSummary != "") {
                    ans=true;
                }
            }
        }
        return ans;
}

function verify_articles(body) {
    var articles=body.response.results;
    var ans=[];
    for(let i = 0; i < articles.length; i++)
    {
        if(has_title(articles[i]) &&
            has_image(articles[i]) &&
            has_section(articles[i]) &&
            has_date(articles[i]) &&
            has_description(articles[i]))
            {
                ans.push(articles[i]);
            }
    }
    body.response.results=ans;
}

module.exports=router;
