const express=require('express');
const request = require('request');
const apikey='UYN6R3BhD3H9YOA2adjNeZGXsvyTEPll';
const router=express.Router();
const error_message = "Server encountered an internal error."

router.get('/category', (req, resp, next) => {
    request('https://api.nytimes.com/svc/topstories/v2/home.json?api-key='+apikey, { json: true }, (err, res, body) => {
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

router.get('/category/:section', (req, resp, next) => {
    const sect=req.params.section;
    let sec;
    if(sect === "sport")
        sec="sports";
    else
        sec=sect;
    request('https://api.nytimes.com/svc/topstories/v2/'+sec+'.json?api-key='+apikey, { json: true }, (err, res, body) => {
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
    request('https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=web_url:("'+id+'") &api-key='+apikey, { json: true }, (err, res, body) => {
          try {
                if (err) { return console.log(err); }
                verify_article(body);
                resp.status(200).json(body);
            } catch(e) {
                  console.log(e);
                  return resp.status(500).json(error_message);
              }
        });
});

router.get('/search', (req, resp, next) => {
    const keyword=req.query.keyword;
    request('https://api.nytimes.com/svc/search/v2/articlesearch.json?q='+keyword+'&api-key='+apikey, { json: true }, (err, res, body) => {
          try {
                if (err) { return console.log(err); }
                resp.status(200).json(body);
            } catch(e) {
              console.log(e);
              return resp.status(500).json(error_message);
          }
        });
});
function has_title(article) {
    var ans=(article.hasOwnProperty('title') && article.title !=null && article.title != "");
    return ans;
}

function has_image(article) {
    let ans = false;
    if(article.hasOwnProperty('multimedia') && article.multimedia != null && article.multimedia.length != 0) {
        let mm = [];
        for(let i=0; i<article.multimedia.length ; i++) {
            if(article.multimedia[i].hasOwnProperty('url') && article.multimedia[i].url != null && article.multimedia[i].url != "" && article.multimedia[i].width>= 2000 ) {
                if(!article.multimedia[i].url.startsWith('http'))
                    article.multimedia[i].url='https://nyt.com/' + article.multimedia[i].url;
                mm.push(article.multimedia[i]);
                console.log(article.multimedia[i].width+"\n");
            }
        }
        article.multimedia=mm;
        ans=true;
    }
    return ans;
}

function has_section(article) {
    var ans= (article.hasOwnProperty('section') && article.section != null && article.section != "");
    return ans;
}

function has_date(article) {
    var ans= (article.hasOwnProperty('published_date') && article.published_date != null && article.published_date != "") ;
    return ans;
}

function has_description(article) {
    var ans= (article.hasOwnProperty('abstract') && article.abstract != null && article.abstract != "") ;
    return ans;
}

function has_search_title(article) {
    var ans=false;
    if(article.hasOwnProperty('headline') && article.headline !=null) {
        if(article.headline.hasOwnProperty('main') && article.headline.main !=null && article.headline.main != "") {
            ans=true;
        }
    }
    return ans;
}

function has_search_image(article) {
    let ans = false;
    if(article.hasOwnProperty('multimedia') && article.multimedia != null && article.multimedia.length != 0) {
        let mm = [];
        for(let i=0; i<article.multimedia.length ; i++) {
            if(article.multimedia[i].hasOwnProperty('url') && article.multimedia[i].url != null && article.multimedia[i].url != ""&& article.multimedia[i].width>= 2000 ) {
                if(!article.multimedia[i].url.startsWith('http'))
                    article.multimedia[i].url='https://nyt.com/' + article.multimedia[i].url;
                mm.push(article.multimedia[i]);
            }
        }
        article.multimedia=mm;
        ans=true;
    }
    return ans;
}

function has_search_section(article) {
    var ans= (article.hasOwnProperty('news_desk') && article.news_desk != null && article.news_desk != "");
    return ans;
}

function has_search_date(article) {
    var ans= (article.hasOwnProperty('pub_date') && article.pub_date != null && article.pub_date !="") ;
    return ans;
}

function verify_articles(body) {
    var articles=body.results;
    var size= articles.length > 10 ? 10 : articles.length;
    var ans=[];
    for(let i = 0; i < size; i++)
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
    body.results=ans;
}

function verify_article(body) {
    var article=body.response.docs[0];
    var ans=false;
    if(has_search_title(article) &&
        has_image(article) &&
        has_section(article) &&
        has_date(article) &&
        has_description(article))
        {
            ans=true;
        }
    body.response.docs[0]=article;
}

function verify_search_results(body) {
    var articles=body.response.docs;
    var size= articles.length > 10 ? 10 : articles.length;
    var ans=[];
    for(let i = 0; i < size; i++)
    {
        if(has_search_title(articles[i]) &&
            has_search_image(articles[i]) &&
            has_search_section(articles[i]) &&
            has_search_date(articles[i]))
            {
                ans.push(articles[i]);
            }
    }
    body.response.docs=ans;
}

module.exports=router;
