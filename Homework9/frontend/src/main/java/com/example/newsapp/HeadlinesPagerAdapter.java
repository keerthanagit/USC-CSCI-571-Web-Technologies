package com.example.newsapp;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentPagerAdapter;

public class HeadlinesPagerAdapter extends FragmentPagerAdapter {
    private int numOfTabs;

    public HeadlinesPagerAdapter(FragmentManager fm, int numOfTabs) {
        super(fm);
        this.numOfTabs=numOfTabs;
    }

    @NonNull
    @Override
    public Fragment getItem(int position) {
        return new HeadlinesContentsFragment(position);
    }

    @Override
    public int getCount() {
        return numOfTabs;
    }
}
