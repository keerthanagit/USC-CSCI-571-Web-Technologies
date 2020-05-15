package com.example.newsapp;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

public class Constants {
    public static final String backend_base= "https://newsapp-27186-backend-hw9.wl.r.appspot.com/";
    public static final String guardian_home= backend_base+"guardian/category/";
    public static final String guardian_detailed_article= backend_base+"guardian/article";
    public static final String guardian_search= backend_base+"guardian/search?keyword=";
    public static final String guardian_world="world/";
    public static final String guardian_business="business/";
    public static final String guardian_politics="politics/";
    public static final String guardian_sports="sport/";
    public static final String guardian_technology="technology/";
    public static final String guardian_science="science/";
    public static final String open_weather_api_url= "https://api.openweathermap.org/data/2.5/weather?q=";
    public static final String open_weather_api_parameters= "&units=metric&appid=d04fbf50a1b28924d8e057ded9d60371";
    public static final String google_trending_api= backend_base+"trends/";
    public static final String mypreference = "news_articles_data";
    public static final String bookmarks_key = "bookmarks";
    public static final String twitter_url = "https://twitter.com/intent/tweet";
    public static final String bing_url = "https://api.cognitive.microsoft.com/bing/v7.0/suggestions?q=";
    public static final String bing_subscription_key_name = "Ocp-Apim-Subscription-Key";
    public static final String bing_subscription_key_value = "42b035235d5f4b83836c9380ce2434a7";

    public static String getZoneDate(String date) {
        String ans="";
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            ZoneId zoneId= ZoneId.of( "America/Los_Angeles" );

            //Convert article date to zonal date
            ZonedDateTime zArticleDate = ZonedDateTime.parse(date).withZoneSameInstant(zoneId);

            /*DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy");
            ZonedDateTime dateTime = ZonedDateTime.parse(zArticleDate.toString(), formatter);*/
            SimpleDateFormat formatter = new SimpleDateFormat("dd MMM yyyy");
            ans = formatter.format(Date.from(zArticleDate.toInstant()));
            //ans=dateTime.toString();

        }

        return ans;
    }
}
