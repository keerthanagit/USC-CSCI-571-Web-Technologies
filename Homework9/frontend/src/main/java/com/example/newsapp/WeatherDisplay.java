package com.example.newsapp;

public class WeatherDisplay {
    private String image;
    private String city;
    private String state;
    private String temperature;
    private String summary;

    public WeatherDisplay(/*String imageResource,*/ String cityResource, String stateResource, String temperatureResource, String summaryResource) {
        //image=imageResource;
        city=cityResource;
        state=stateResource;
        temperature=temperatureResource;
        summary=summaryResource;
    }

    public String getImage() {
       return image;
    }

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

    public String getTemperature() {
        return temperature;
    }

    public String getSummary() {
        return summary;
    }
}
