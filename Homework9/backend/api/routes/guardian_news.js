const express=require('express');
const request = require('request');
const apikey='82ffd862-7f63-4adf-ab5f-b1166fcd3be4';
const router=express.Router();
const error_message = "Server encountered an internal error."

router.get('/category/', (req, resp, next) => {
    var oldUrl="https://content.guardianapis.com/search?api-key="+apikey+"&section=(sport|business|technology|politics)&show-blocks=all";
    var url="https://content.guardianapis.com/search?order-by=newest&show-fields=starRating,headline,thumbnail,short-url&api-key="+apikey;
    request(url, { json: true }, (err, res, body) => {
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
            verify_section_articles(body);
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
                verify_detailed_article(body);
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
                verify_section_articles(body);
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
    if(article.hasOwnProperty('fields') && article.fields != null) {
        if(article.fields.hasOwnProperty('thumbnail') && article.fields.thumbnail != null ) {
            ans=true;
        }
        else
        {
            article.fields["thumbnail"]="https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png";
            ans=true;
        }

    }
    return ans;
}

function has_section_image(article) {
    let ans = false;
    var img="";
    if(article.hasOwnProperty('blocks') && article.blocks != null) {
        if(article.blocks.hasOwnProperty('main') && article.blocks.main != null ) {
            if(article.blocks.main.hasOwnProperty('elements') && article.blocks.main.elements != null && article.blocks.main.elements.length != 0  ) {
                if(article.blocks.main.elements[0].hasOwnProperty('assets') && article.blocks.main.elements[0].assets!=null && article.blocks.main.elements[0].assets.length != 0) {
                    //img=article.blocks.main.elements[0].assets[0].file;
                    ans=true;
                }
                else
                {
                    var assets=[];
                    var imgObj={
                        "file" : "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png"
                    };
                    assets.push(imgObj);
                    article.blocks.main.elements[0]["assets"]=assets;
                    ans=true;
                }
            }
            else {
                var elements=[];
                var element={
                                "assets" : [
                                    {
                                        "file" : "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png"
                                    }
                                ]
                            }
                elements.push(element);
                article.blocks.main["elements"]=elements;
                ans=true;
            }
        }
        else {
            var main={
                         "elements" : [
                             {
                                 "assets" : [
                                     {
                                         "file" : "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png"
                                     }
                                 ]
                             }
                         ]
                     };
            article.blocks["main"]=main;
            ans=true;
        }
    }
    /*if(!ans)
        img="https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png";


    var articleImg={
        "blocks" : {
            "main" : {
                "elements" : [
                    {
                        "assets" : [
                            {
                                "file" : img
                            }
                        ]
                    }
                ]
            }
        }
    }*/
    return ans;
}

function has_section(article) {
    var ans= (article.hasOwnProperty('sectionName') && article.sectionId != null && article.sectionId != "");
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
            has_date(articles[i]) )
            {
                ans.push(articles[i]);
            }
    }
    body.response.results=ans;
}

function verify_section_articles(body) {
    var articles=body.response.results;
    var ans=[];
    for(let i = 0; i < articles.length; i++)
    {
        if(has_title(articles[i]) &&
            has_section_image(articles[i]) &&
            has_section(articles[i]) &&
            has_date(articles[i]) )
            {
                ans.push(articles[i]);
            }
    }
    body.response.results=ans;
}

function verify_detailed_article(body) {
    var article=body.response.content;
    var ans=false;
    if(has_title(article) &&
                has_section_image(article) &&
                has_section(article) &&
                has_date(article) )
                {
                    ans=true;
                }
    body.response.content=article;
}

module.exports=router;
