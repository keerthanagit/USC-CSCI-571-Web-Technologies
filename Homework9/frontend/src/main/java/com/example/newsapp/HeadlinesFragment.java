package com.example.newsapp;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;
import androidx.viewpager.widget.ViewPager;

import com.google.android.material.tabs.TabItem;
import com.google.android.material.tabs.TabLayout;

import java.io.IOException;

public class HeadlinesFragment extends Fragment {

    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.headlines_fragment, container, false);
        TabLayout tabLayout=view.findViewById(R.id.headlines_navigation);
        /*TabItem worldTab=view.findViewById(R.id.headlines_world);
        TabItem businessTab=view.findViewById(R.id.headlines_business);
        TabItem politicsTab=view.findViewById(R.id.headlines_politics);
        TabItem sportsTab=view.findViewById(R.id.headlines_sports);
        TabItem technologyTab=view.findViewById(R.id.headlines_technology);
        TabItem scienceTab=view.findViewById(R.id.headlines_science);*/
        final ViewPager viewPager=view.findViewById(R.id.headlines_viewpager);

        HeadlinesPagerAdapter pagerAdapter=new HeadlinesPagerAdapter(getChildFragmentManager(),tabLayout.getTabCount());
        viewPager.setAdapter(pagerAdapter);
        viewPager.addOnPageChangeListener(new TabLayout.TabLayoutOnPageChangeListener(tabLayout));
        tabLayout.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                viewPager.setCurrentItem(tab.getPosition());
            }

            @Override
            public void onTabUnselected(TabLayout.Tab tab) {

            }

            @Override
            public void onTabReselected(TabLayout.Tab tab) {

            }
        });
        return view;
    }
}
