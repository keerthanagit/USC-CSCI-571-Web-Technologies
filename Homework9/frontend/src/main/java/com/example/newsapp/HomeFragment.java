package com.example.newsapp;

import android.content.res.Resources;
import android.graphics.drawable.Drawable;
import android.location.Address;
import android.location.Geocoder;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.DividerItemDecoration;
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

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class HomeFragment extends Fragment  {
    private RecyclerView recyclerView;
    private RecyclerView.Adapter adapter;
    private RecyclerView.LayoutManager layoutManager;
    private RequestQueue requestQueue;
    private View view;
    private LinearLayout progressBar;
    private SwipeRefreshLayout swipeRefreshLayout;
    private boolean didLoad=false;
    /*public static final int MY_PERMISSIONS_REQUEST_LOCATION = 99;
    LocationManager locationManager;
    String provider;*/
    double latitude,longitude;

    HomeFragment(double latitude,double longitude) {
        this.longitude=longitude;
        this.latitude=latitude;
    }

    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        view = inflater.inflate(R.layout.home_fragment, container, false);
        progressBar=view.findViewById(R.id.progress_bar_layout);
        swipeRefreshLayout=view.findViewById(R.id.refresh);
        swipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                didLoad=true;
                try {
                    displayWeather();
                } catch (IOException e) {
                    e.printStackTrace();
                }
                getNewsArticles();
                swipeRefreshLayout.setRefreshing(false);
                didLoad=false;
            }
        });
        requestQueue= Volley.newRequestQueue(view.getContext());
        try {
            displayWeather();
        } catch (IOException e) {
            e.printStackTrace();
        }
        getNewsArticles();
        recyclerView= view.findViewById(R.id.home_recycler_view);
        recyclerView.setHasFixedSize(true);
        recyclerView.addItemDecoration(new DividerItemDecoration(recyclerView.getContext(), DividerItemDecoration.VERTICAL));
        return view;
    }

    private void displayWeather() throws IOException {
        Geocoder geocoder = new Geocoder(view.getContext(), Locale.getDefault());
        System.out.println("Latitude :"+latitude+"\nLongitude :"+longitude);

        List<Address> addresses = geocoder.getFromLocation(latitude, longitude, 1);
        final String city,state;
        if(addresses!=null && addresses.size()>0) {
            city = addresses.get(0).getLocality();
            state = addresses.get(0).getAdminArea();
        }
        else {
            city="Los Angeles";
            state="California";
        }
        /*city = addresses.get(0).getLocality();
        state = addresses.get(0).getAdminArea();*/
        System.out.println("City : "+city);
        System.out.println("State : "+state);
        JsonObjectRequest req=new JsonObjectRequest(Request.Method.GET, Constants.open_weather_api_url+city+Constants.open_weather_api_parameters, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            double temp=response.getJSONObject("main").getDouble("temp");
                            String temperature= Math.round(temp) +" \u00B0"+"C";
                            JSONArray weatherArr=response.getJSONArray("weather");
                            String summary=weatherArr.getJSONObject(0).getString("main");
                            /*String city="Los Angeles";
                            String state="California";*/

                            TextView cityView=view.findViewById(R.id.weather_city);
                            cityView.setText(city);
                            TextView stateView=view.findViewById(R.id.weather_state);
                            stateView.setText(state);
                            TextView temperatureView=view.findViewById(R.id.weather_temperature);
                            temperatureView.setText(temperature);
                            TextView summaryView=view.findViewById(R.id.weather_summary);
                            summaryView.setText(summary);
                            RelativeLayout rLayout=view.findViewById(R.id.weather_layout);
                            rLayout.setBackground(getSummaryImage(summary));

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

    private void getNewsArticles() {
        final ArrayList<NewsArticle> newsArticles=new ArrayList<>();
        if(!didLoad){
            progressBar.setVisibility(View.VISIBLE);
            swipeRefreshLayout.setVisibility(View.GONE);
        }
        JsonObjectRequest req=new JsonObjectRequest(Request.Method.GET, Constants.guardian_home, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            JSONArray arr=response.getJSONObject("response").getJSONArray("results");
                            for(int i=0 ; i<arr.length();i++) {
                                JSONObject article=arr.getJSONObject(i);
                                String img=article.getJSONObject("fields").getString("thumbnail");
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
                            layoutManager = new LinearLayoutManager(getActivity()){
                                @Override
                                public boolean canScrollVertically() {
                                    return false;
                                }
                            };
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

    private Drawable getSummaryImage(String summary) {
        Resources res = getResources(); //resource handle
        Drawable drawable ;
        switch (summary) {
            case "Clouds":
                drawable = res.getDrawable(R.drawable.cloudy_weather);
                break;
            case "Clear":
                drawable = res.getDrawable(R.drawable.clear_weather);
                break;
            case "Snow":
                drawable = res.getDrawable(R.drawable.snowy_weather);
                break;
            case "Rain":
                drawable = res.getDrawable(R.drawable.rainy_weather);
                break;
            case "Drizzle":
                drawable = res.getDrawable(R.drawable.rainy_weather);
                break;
            case "Thunderstorm":
                drawable = res.getDrawable(R.drawable.thunder_weather);
                break;
            default:
                drawable = res.getDrawable(R.drawable.sunny_weather);
                break;
        }
        return drawable;

    }

    @Override
    public void onResume() {
        super.onResume();
        if(adapter!=null)
            adapter.notifyDataSetChanged();
    }
}
