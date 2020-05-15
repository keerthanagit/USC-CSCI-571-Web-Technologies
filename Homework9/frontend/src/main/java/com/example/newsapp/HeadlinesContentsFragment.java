package com.example.newsapp;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;
import androidx.viewpager.widget.ViewPager;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.RetryPolicy;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.material.tabs.TabItem;
import com.google.android.material.tabs.TabLayout;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;

public class HeadlinesContentsFragment extends Fragment {
    private RecyclerView recyclerView;
    private RecyclerView.Adapter adapter;
    private RecyclerView.LayoutManager layoutManager;
    private RequestQueue requestQueue;
    private View view;
    private LinearLayout progressBar;
    private SwipeRefreshLayout swipeRefreshLayout;
    private boolean didLoad=false;

    private int sectionId;
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        view = inflater.inflate(R.layout.headlines_contents_fragment, container, false);
        progressBar=view.findViewById(R.id.progress_bar_layout);
        swipeRefreshLayout=view.findViewById(R.id.refresh);
        swipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                didLoad=true;
                getNewsArticles();
                swipeRefreshLayout.setRefreshing(false);
                didLoad=false;
            }
        });
        requestQueue= Volley.newRequestQueue(view.getContext());
        recyclerView= view.findViewById(R.id.headlines_recycler_view);
        layoutManager = new LinearLayoutManager(getActivity());
        recyclerView.setHasFixedSize(true);
        recyclerView.addItemDecoration(new DividerItemDecoration(recyclerView.getContext(), DividerItemDecoration.VERTICAL));
        getNewsArticles();
        return view;
    }
    public HeadlinesContentsFragment(int sectionId) {
        this.sectionId=sectionId;
    }
    private void getNewsArticles() {
        final ArrayList<NewsArticle> newsArticles=new ArrayList<>();
        if(!didLoad){
            progressBar.setVisibility(View.VISIBLE);
            swipeRefreshLayout.setVisibility(View.GONE);
        }
        String url="";
        switch (sectionId) {
            case 0:
                url=Constants.guardian_home+Constants.guardian_world;
                break;
            case 1:
                url=Constants.guardian_home+Constants.guardian_business;
                break;
            case 2:
                url=Constants.guardian_home+Constants.guardian_politics;
                break;
            case 3:
                url=Constants.guardian_home+Constants.guardian_sports;
                break;
            case 4:
                url=Constants.guardian_home+Constants.guardian_technology;
                break;
            case 5:
                url=Constants.guardian_home+Constants.guardian_science;
                break;
        }
        JsonObjectRequest req=new JsonObjectRequest(Request.Method.GET, url, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            //System.out.println("Response is :\n"+response);
                            JSONArray arr=response.getJSONObject("response").getJSONArray("results");
                            int size= Math.min(arr.length(), 10);
                            for(int i=0 ; i<size;i++) {
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
    @Override
    public void onResume() {
        super.onResume();
        if(adapter!=null)
            adapter.notifyDataSetChanged();
    }
}
