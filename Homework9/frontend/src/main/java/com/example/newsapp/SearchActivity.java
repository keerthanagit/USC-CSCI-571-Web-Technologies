package com.example.newsapp;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.widget.LinearLayout;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class SearchActivity extends AppCompatActivity {
    private RecyclerView recyclerView;
    private RecyclerView.Adapter adapter;
    private RecyclerView.LayoutManager layoutManager;
    private RequestQueue requestQueue;
    private String query;
    private Context context;
    private LinearLayout progressBar;
    private SwipeRefreshLayout swipeRefreshLayout;
    private boolean didLoad=false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        setTheme(R.style.AppTheme);
        super.onCreate(savedInstanceState);
        setContentView(R.layout.search_fragment);
        Intent intent=getIntent();
        query=intent.getStringExtra("q");

        Toolbar myToolbar = (Toolbar) findViewById(R.id.search_tool_bar);
        String title = "Search Results for " + this.query;
        myToolbar.setTitle(title);
        setSupportActionBar(myToolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setHomeButtonEnabled(true);
        progressBar=findViewById(R.id.progress_bar_layout);
        swipeRefreshLayout=findViewById(R.id.refresh);
        swipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                didLoad=true;
                getNewsArticles();
                swipeRefreshLayout.setRefreshing(false);
                didLoad=false;
            }
        });
        requestQueue= Volley.newRequestQueue(this);
        context=this;
        getNewsArticles();
        recyclerView= findViewById(R.id.search_recycler_view);
        recyclerView.setHasFixedSize(true);
    }
    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            this.finish();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
    private void getNewsArticles() {
        final ArrayList<NewsArticle> newsArticles=new ArrayList<>();
        if(!didLoad){
            progressBar.setVisibility(View.VISIBLE);
            swipeRefreshLayout.setVisibility(View.GONE);
        }
        JsonObjectRequest req=new JsonObjectRequest(Request.Method.GET, Constants.guardian_search+query, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            JSONArray arr=response.getJSONObject("response").getJSONArray("results");
                            for(int i=0 ; i<arr.length();i++) {
                                JSONObject article=arr.getJSONObject(i);
                                String img=article.getJSONObject("blocks")
                                        .getJSONObject("main")
                                        .getJSONArray("elements")
                                        .getJSONObject(0)
                                        .getJSONArray("assets")
                                        .getJSONObject(0)
                                        .getString("file");
                                String title=article.getString("webTitle");
                                String time=article.getString("webPublicationDate");
                                String section=article.getString("sectionName");
                                String id=article.getString("id");
                                String twitterShareUrl=article.getString("webUrl");
                                NewsArticle newsArticle=new NewsArticle(id,img, title, time,section);
                                newsArticle.setArticleUrl(twitterShareUrl);
                                newsArticles.add(newsArticle);
                            }
                            if(!didLoad){
                                progressBar.setVisibility(View.GONE);
                                swipeRefreshLayout.setVisibility(View.VISIBLE);
                            }
                            adapter=new NewsArticleAdapter(newsArticles);
                            layoutManager = new LinearLayoutManager(context);
                            recyclerView.setLayoutManager(layoutManager);
                            recyclerView.setAdapter(adapter);
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
        requestQueue.add(req);
    }

    @Override
    protected void onResume() {
        super.onResume();
        if(adapter!=null)
            adapter.notifyDataSetChanged();
    }
}