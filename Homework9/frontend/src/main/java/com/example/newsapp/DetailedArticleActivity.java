package com.example.newsapp;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.text.Html;
import android.text.method.LinkMovementMethod;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.ActionMenuView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.RetryPolicy;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.github.mikephil.charting.charts.LineChart;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.github.mikephil.charting.interfaces.datasets.ILineDataSet;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.squareup.picasso.Picasso;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

public class DetailedArticleActivity extends AppCompatActivity {
    private RequestQueue requestQueue;
    Toolbar toolbar;
    Context context;
    SharedPreferences sharedPreferences;
    NewsArticle currentArticle;
    String toolbarTitle;
    Menu menu;
    private LinearLayout progressBar;
    private boolean didLoad=false;


    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            this.finish();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        setTheme(R.style.AppTheme);
        super.onCreate(savedInstanceState);
        setContentView(R.layout.detailed_article);
        Intent intent=getIntent();
        final String id=intent.getExtras().getString("id");
        progressBar=findViewById(R.id.progress_bar_layout);
        requestQueue= Volley.newRequestQueue(this);
        context=this;
        displayDetailedArticle(id);
        toolbar = findViewById(R.id.detailed_article_header);
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setHomeButtonEnabled(true);
    }
    @RequiresApi(api = Build.VERSION_CODES.M)
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.detailed_article_toolbar, menu);
        this.menu=menu;
        menu.findItem(R.id.detailed_article_bookmark_filled).setOnMenuItemClickListener(new MenuItem.OnMenuItemClickListener() {
            @Override
            public boolean onMenuItemClick(MenuItem item) {
                addBookmarkFunction();
                return true;
            }
        });
        menu.findItem(R.id.detailed_article_bookmark_unfilled).setOnMenuItemClickListener(new MenuItem.OnMenuItemClickListener() {
            @Override
            public boolean onMenuItemClick(MenuItem item) {
                addBookmarkFunction();
                return true;
            }
        });
        menu.findItem(R.id.detailed_article_twitter).setOnMenuItemClickListener(new MenuItem.OnMenuItemClickListener() {
            @Override
            public boolean onMenuItemClick(MenuItem item) {
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(Constants.twitter_url+"?text=Check out this link :&" +
                        "url="+currentArticle.getArticleUrl()+"\n&" +
                        "hashtags=CSCI571NewsSearch"));
                startActivity(intent);
                return true;
            }
        });
        return true;
    }

    private void displayDetailedArticle(String id) {
        String url=Constants.guardian_detailed_article+"?id="+id;
        if(!didLoad){
            progressBar.setVisibility(View.VISIBLE);
        }
        JsonObjectRequest req=new JsonObjectRequest(Request.Method.GET, url, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            //System.out.println("Response : "+response);
                            JSONObject article=response.getJSONObject("response").getJSONObject("content");
                            String img=article.getJSONObject("blocks")
                                    .getJSONObject("main")
                                    .getJSONArray("elements")
                                    .getJSONObject(0)
                                    .getJSONArray("assets")
                                    .getJSONObject(0)
                                    .getString("file");
                            String title=article.getString("webTitle");
                            int desSize=article.getJSONObject("blocks")
                                    .getJSONArray("body").length();
                            String description="";
                            for(int i=0; i<desSize;i++)
                            description+=article.getJSONObject("blocks")
                                    .getJSONArray("body")
                                    .getJSONObject(i)
                                    .getString("bodyHtml");
                            String date=Constants.getZoneDate(article.getString("webPublicationDate"));
                            String section=article.getString("sectionName");
                            String id=article.getString("id");
                            final String articleUrl="<a href='"+article.getString("webUrl")+"'>View Full Article</a>";
                            String twitterShareUrl=article.getString("webUrl");

                            //set data

                            //getSupportActionBar().setTitle(title);
                            ImageView imageView=findViewById(R.id.detailed_article_image);
                            Picasso.with(context).load(img).fit().into(imageView);
                            TextView titleView=findViewById(R.id.detailed_article_title);
                            titleView.setText(title);
                            TextView sectionView=findViewById(R.id.detailed_article_section);
                            sectionView.setText(section);
                            TextView dateView=findViewById(R.id.detailed_article_date);
                            dateView.setText(date);
                            TextView descriptionView=findViewById(R.id.detailed_article_description);
                            descriptionView.setText(Html.fromHtml(description));
                            /*TextView headingView=findViewById(R.id.detailed_article_heading);
                            headingView.setText(title);*/
                            toolbarTitle=title;
                            getSupportActionBar().setTitle(title);
                            MenuItem bookmarkFilled=menu.findItem(R.id.detailed_article_bookmark_filled);
                            MenuItem bookmarkUnfilled=menu.findItem(R.id.detailed_article_bookmark_unfilled);
                            MenuItem bookmarkTwitter=menu.findItem(R.id.detailed_article_twitter);
                            if (isBookmarked(id)) {
                                bookmarkFilled.setVisible(true);
                                bookmarkUnfilled.setVisible(false);
                            } else {
                                bookmarkFilled.setVisible(false);
                                bookmarkUnfilled.setVisible(true);
                            }
                            TextView linkView=findViewById(R.id.detailed_article_link);
                            linkView.setText(Html.fromHtml(articleUrl));
                            linkView.setClickable(true);
                            linkView.setMovementMethod(LinkMovementMethod.getInstance());

                            currentArticle=new NewsArticle(id,img,title,article.getString("webPublicationDate"),section);
                            currentArticle.setDescription(description);
                            currentArticle.setArticleUrl(twitterShareUrl);

                            if(!didLoad){
                                progressBar.setVisibility(View.GONE);
                                bookmarkTwitter.setVisible(true);
                            }


                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                error.printStackTrace();
            }
        });
        req.setRetryPolicy(new RetryPolicy() {
            @Override
            public int getCurrentTimeout() {
                return 50000;
            }

            @Override
            public int getCurrentRetryCount() {
                return 50000;
            }

            @Override
            public void retry(VolleyError error) throws VolleyError {

            }
        });
        requestQueue.add(req);
    }

    private boolean isBookmarked(String id) {
        sharedPreferences = context.getSharedPreferences(Constants.mypreference,
                Context.MODE_PRIVATE);
        ArrayList<NewsArticle> storedArticles;
        Gson gson = new Gson();
        if(sharedPreferences.contains(Constants.bookmarks_key)) {
            Type type = new TypeToken< ArrayList < NewsArticle >>() {}.getType();
            storedArticles=gson.fromJson(sharedPreferences.getString(Constants.bookmarks_key,""),type);
            for(int i=0;i<storedArticles.size();i++) {
                if(storedArticles.get(i).getId().equals(id)) {
                    return true;
                }
            }
        }
        return false;
    }

    public ArrayList<NewsArticle> getStoredArticles() {
        sharedPreferences = context.getSharedPreferences(Constants.mypreference,
                Context.MODE_PRIVATE);
        ArrayList<NewsArticle> storedArticles;
        Gson gson = new Gson();
        if(sharedPreferences.contains(Constants.bookmarks_key)) {
            Type type = new TypeToken< ArrayList < NewsArticle >>() {}.getType();
            storedArticles=gson.fromJson(sharedPreferences.getString(Constants.bookmarks_key,""),type);
        }
        else
        {
            storedArticles=new ArrayList<>();
        }
        return storedArticles;
    }

    public void addBookmarkFunction() {
        MenuItem bookmarkFilled=menu.findItem(R.id.detailed_article_bookmark_filled);
        MenuItem bookmarkUnfilled=menu.findItem(R.id.detailed_article_bookmark_unfilled);
        int bookmarkedIndex=0;
        ArrayList<NewsArticle> storedArticles=getStoredArticles();
        boolean isBookmarked=false;
        for(int i=0;i<storedArticles.size();i++) {
            if(storedArticles.get(i).getId().equals(currentArticle.getId())) {
                isBookmarked=true;
                bookmarkedIndex=i;
            }
        }
        if(isBookmarked) {
            storedArticles.remove(bookmarkedIndex);
            bookmarkFilled.setVisible(false);
            bookmarkUnfilled.setVisible(true);
            Toast.makeText(context,currentArticle.getTitle()+" was removed from bookmarks",Toast.LENGTH_SHORT).show();
        } else {
            storedArticles.add(currentArticle);
            bookmarkFilled.setVisible(true);
            bookmarkUnfilled.setVisible(false);
            Toast.makeText(context,currentArticle.getTitle()+" was added to bookmarks",Toast.LENGTH_SHORT).show();
        }
        Gson gson = new Gson();
        String json = gson.toJson(storedArticles);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString(Constants.bookmarks_key,json);
        editor.apply();

    }
}
