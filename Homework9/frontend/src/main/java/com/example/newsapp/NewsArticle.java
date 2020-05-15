package com.example.newsapp;

import java.text.ParseException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

public class NewsArticle {
    private String id;
    private String image;
    private String title;
    private String date;
    private String section;
    private String description;
    private String articleUrl;

    public NewsArticle(String idResource,String imageResource, String titleResource, String dateResource, String sectionResource) {
        id=idResource;
        image=imageResource;
        title=titleResource;
        date=dateResource;
        section=sectionResource;
    }

    public String getImage() {
       return image;
    }

    public String getId() {
       return id;
    }

    public String getTitle() {
        return title;
    }

    public void setDescription(String descriptionResource) {
        this.description=descriptionResource;
    }

    public void setArticleUrl(String articleUrlResource) {
        this.articleUrl=articleUrlResource;
    }

    public String getDescriptionText() {
        return this.description;
    }

    public String getArticleUrl() {
        return this.articleUrl;
    }

    public String getDescription() throws ParseException {
        return getDate()+" | "+section;
    }

    public String getDate()  {
         String ans="";
         if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
             ZoneId zoneId= ZoneId.of( "America/Los_Angeles" );

             //Convert article date to zonal date
             ZonedDateTime zArticleDate = ZonedDateTime.parse(this.date).withZoneSameInstant(zoneId);

             //Convert current date to zonal date
             LocalDateTime current= LocalDateTime.now();
             ZonedDateTime zCurrent = current.atZone( zoneId );

             long yearDiff=zCurrent.getYear()-zArticleDate.getYear();
             long dayDiff=zCurrent.getDayOfYear()-zArticleDate.getDayOfYear();
             long hourDiff=zCurrent.getHour()-zArticleDate.getHour();
             long minDiff=zCurrent.getMinute()-zArticleDate.getMinute();
             long secDiff=zCurrent.getSecond()-zArticleDate.getSecond();

             if(yearDiff > 0 )
             {
                 ans=(365-zArticleDate.getDayOfYear()) + zCurrent.getDayOfYear() + "d ago";
             }
             else if (dayDiff > 0)
             {
                 ans=dayDiff+"d ago";
             }
             else if(hourDiff>0)
             {
                 ans=hourDiff+"h ago";
             }
             else if(minDiff>0) {
                 ans=minDiff+"m ago";
             }
             else
             {
                 ans=secDiff+"s ago";
             }


         }

         return ans;
     }

    @Override
    public String toString() {
        return "NewsArticle{" +
                "id='" + id + '\'' +
                ", image='" + image + '\'' +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", articleUrl='" + articleUrl + '\'' +
                '}';
    }
}
