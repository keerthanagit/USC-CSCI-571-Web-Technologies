const express=require('express');
const app=express();
const cors = require('cors')
const guardian_news_routes=require('./api/routes/guardian_news');
const nytimes_news_routes=require('./api/routes/nytimes_news');
const google_trends_routes=require('./api/routes/google_trends');
app.use(cors());
app.use('/guardian',guardian_news_routes);
app.use('/nytimes',nytimes_news_routes);
app.use('/trends',google_trends_routes);
module.exports=app;
