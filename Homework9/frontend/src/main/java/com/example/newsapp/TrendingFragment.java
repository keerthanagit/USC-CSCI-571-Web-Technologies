package com.example.newsapp;

import android.graphics.Color;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.github.mikephil.charting.charts.LineChart;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.github.mikephil.charting.interfaces.datasets.ILineDataSet;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class TrendingFragment extends Fragment {
    private RequestQueue requestQueue;
    private View view;
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        view = inflater.inflate(R.layout.trending_fragment, container, false);
        requestQueue= Volley.newRequestQueue(view.getContext());
        displayTrends();
        return view;
    }
    private void displayTrends() {
        final EditText editText=view.findViewById(R.id.search_term);
        editText.setOnKeyListener(new View.OnKeyListener() {
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                // If the event is a key-down event on the "enter" button
                if ((event.getAction() == KeyEvent.ACTION_DOWN) &&
                        (keyCode == KeyEvent.KEYCODE_ENTER)) {
                    // Perform action on key press
                    sendRequest(editText.getText().toString());
                    return true;
                }
                return false;
            }
        });
        //For default action on opening the page
        sendRequest(editText.getText().toString());
    }

    private void sendRequest(String text) {
        final List<Entry> entries = new ArrayList<>();
        final String searchValue= text.equals("") ? "Coronavirus" : text;
        JsonObjectRequest req=new JsonObjectRequest(Request.Method.GET, Constants.google_trending_api+searchValue, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            JSONArray arr=response.getJSONObject("default").getJSONArray("timelineData");
                            for(int i=0 ; i<arr.length();i++) {
                                JSONObject obj=arr.getJSONObject(i);
                                int value=obj.getJSONArray("value").getInt(0);
                                //System.out.println(value);
                                entries.add(new Entry(i,value));
                            }
                            LineDataSet dataSet = new LineDataSet(entries, "Trending Chart for "+searchValue);
                            dataSet.setColor(Color.parseColor("#BB86FC"));
                            dataSet.setCircleColor(Color.parseColor("#9900ff"));
                            dataSet.setCircleHoleColor(Color.parseColor("#9900ff"));
                            //Render the chart
                            List<ILineDataSet> dataSets = new ArrayList<>();
                            dataSets.add(dataSet);
                            LineData data = new LineData(dataSets);
                            LineChart chart = (LineChart) view.findViewById(R.id.trends_chart);
                            chart.getLegend().setTextColor(Color.BLACK);
                            chart.getLegend().setTextSize(12f);
                            chart.setData(data);
                            chart.invalidate(); // refresh
                            chart.getAxisLeft().setDrawAxisLine(false);
                            chart.getAxisLeft().setDrawGridLines(false);
                            chart.getXAxis().setDrawGridLines(false);
                            chart.getAxisRight().setDrawGridLines(false);
                            chart.getLegend().setTextSize(18f);
                            chart.getLegend().setYOffset(18f);

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
}
