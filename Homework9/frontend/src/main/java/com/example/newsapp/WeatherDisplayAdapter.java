package com.example.newsapp;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.squareup.picasso.Picasso;

import java.text.ParseException;

public class WeatherDisplayAdapter extends RecyclerView.Adapter<WeatherDisplayAdapter.WeatherDisplayViewHolder> {
    private WeatherDisplay mWeatherDisplay;
    private View view;

    public static class WeatherDisplayViewHolder extends RecyclerView.ViewHolder {
        public TextView cityView;
        public TextView stateView;
        public TextView temperatureView;
        public TextView summaryView;

        public WeatherDisplayViewHolder(@NonNull View itemView) {
            super(itemView);
            cityView = itemView.findViewById(R.id.weather_city);
            stateView = itemView.findViewById(R.id.weather_state);
            temperatureView = itemView.findViewById(R.id.weather_temperature);
            summaryView = itemView.findViewById(R.id.weather_summary);
        }
    }

    public WeatherDisplayAdapter(WeatherDisplay weatherDisplay) {
        mWeatherDisplay = weatherDisplay;
    }

    @NonNull
    @Override
    public WeatherDisplayViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        view = LayoutInflater.from(parent.getContext()).inflate(R.layout.weather_display, parent, false);
        WeatherDisplayViewHolder wvh = new WeatherDisplayViewHolder(view);
        return wvh;
    }

    @Override
    public void onBindViewHolder(@NonNull WeatherDisplayViewHolder holder, int position) {
        /*String imageUri = mWeatherDisplay.getImage();
        ImageView ivBasicImage = holder.imageView;
        Picasso.with(view.getContext()).load(imageUri).fit().into(ivBasicImage);*/
        holder.cityView.setText(mWeatherDisplay.getCity());
        holder.stateView.setText(mWeatherDisplay.getState());
        holder.temperatureView.setText(mWeatherDisplay.getTemperature());
        holder.summaryView.setText(mWeatherDisplay.getSummary());

    }

    @Override
    public int getItemCount() {
        return 1;
    }
}
