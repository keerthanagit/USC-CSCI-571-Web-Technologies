package com.example.newsapp;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

public class BookmarksFragment extends Fragment {
    SharedPreferences sharedpreferences;
    private RecyclerView recyclerView;
    private RecyclerView.Adapter adapter;
    private RecyclerView.LayoutManager layoutManager;
    private RequestQueue requestQueue;
    private View view;
    private View empty_bm;
    private ArrayList<NewsArticle> storedArticles;
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
//        empty_bm=inflater.inflate(R.layout.empty_bookmarks_fragment, container, false);
        storedArticles = new ArrayList<>();
        view = inflater.inflate(R.layout.bookmarks_fragment, container, false);
        recyclerView= view.findViewById(R.id.bookmarks_recycler_view);
        empty_bm=view.findViewById(R.id.empty_bookmarks);

        layoutManager = new GridLayoutManager(view.getContext(),2) {
            @Override
            public void onLayoutCompleted(RecyclerView.State state) {
                super.onLayoutCompleted(state);
                if(storedArticles==null || storedArticles.size() == 0)
                    empty_bm.setVisibility(View.VISIBLE);
            }
        };
        getNewsArticles();
        ItemOffsetDecoration itemDecoration = new ItemOffsetDecoration(view.getContext(), R.dimen.item_offset);
        recyclerView.addItemDecoration(itemDecoration);
        recyclerView.setHasFixedSize(true);
        recyclerView.addItemDecoration(new DividerItemDecoration(recyclerView.getContext(), DividerItemDecoration.VERTICAL));

        return view;
    }
    private void getNewsArticles() {
        storedArticles = new ArrayList<>();
        sharedpreferences = view.getContext().getSharedPreferences(Constants.mypreference, Context.MODE_PRIVATE);
        Gson gson = new Gson();
        if(sharedpreferences.contains(Constants.bookmarks_key)) {
            Type type = new TypeToken< List < NewsArticle >>() {}.getType();
            storedArticles=gson.fromJson(sharedpreferences.getString(Constants.bookmarks_key,null),type);
            System.out.println(storedArticles);
            if(storedArticles == null || storedArticles.size()==0)
            {
                empty_bm.setVisibility(View.VISIBLE);
                //return empty_bm;
            }
            adapter=new BookmarkArticleAdapter(storedArticles);
            recyclerView.setLayoutManager(layoutManager);
            recyclerView.setAdapter(adapter);

            //return recyclerView;

        }
        else
        //return empty_bm;
            empty_bm.setVisibility(View.VISIBLE);
    }
    @Override
    public void onResume() {
        super.onResume();
        Gson gson = new Gson();
        Type type = new TypeToken< List < NewsArticle >>() {}.getType();
        storedArticles=gson.fromJson(sharedpreferences.getString(Constants.bookmarks_key,null),type);
        adapter=new BookmarkArticleAdapter(storedArticles);

        if(adapter!=null && recyclerView != null) {
            recyclerView.setAdapter(adapter);
            adapter.notifyDataSetChanged();

        }
    }
}
