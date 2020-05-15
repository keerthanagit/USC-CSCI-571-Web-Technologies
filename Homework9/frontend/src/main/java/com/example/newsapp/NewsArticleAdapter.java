package com.example.newsapp;

import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.squareup.picasso.Picasso;

import java.lang.reflect.Type;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

public class NewsArticleAdapter extends RecyclerView.Adapter<NewsArticleAdapter.NewsArticleViewHolder> {
    private static ArrayList<NewsArticle> articleList;
    private static View view;

    public static class NewsArticleViewHolder extends RecyclerView.ViewHolder {
        SharedPreferences sharedpreferences;
        public ImageView imageView;
        public ImageView bookmarkView;
        public TextView titleView;
        public TextView descriptionView;
        public NewsArticle currentArticle;

        public NewsArticleViewHolder(@NonNull final View itemView) {
            super(itemView);
            imageView = itemView.findViewById(R.id.article_image);
            titleView = itemView.findViewById(R.id.article_title);
            descriptionView = itemView.findViewById(R.id.article_description);
            bookmarkView = itemView.findViewById(R.id.article_bookmark);

            bookmarkView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    addBookmarkFunction(bookmarkView);
                }
            });


            view.setOnLongClickListener(new View.OnLongClickListener() {
                @Override
                public boolean onLongClick(View v) {
                    // custom dialog
                    final Dialog dialog = new Dialog(itemView.getContext());
                    dialog.setContentView(R.layout.share_dialog);
                    dialog.setTitle("Title...");
                    System.out.println(currentArticle.getId());

                    // set the custom dialog components - text, image and button
                    TextView text = dialog.findViewById(R.id.share_article_title);
                    text.setText(currentArticle.getTitle());
                    ImageView image = dialog.findViewById(R.id.share_article_image);
                    String imageUri = currentArticle.getImage();
                    System.out.println("Image uri: "+imageUri);
                    Picasso.with(view.getContext()).load(imageUri).fit().into(image);
                    final ImageView bmarkView = dialog.findViewById(R.id.share_article_bookmark);
                    setBookmarkIcon(bmarkView);
                    bmarkView.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            addBookmarkDialogFunction(bmarkView,bookmarkView);
                        }
                    });
                    final ImageView twitterView=dialog.findViewById(R.id.share_article_twitter);
                    twitterView.setImageResource(R.drawable.bluetwitter);
                    twitterView.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(Constants.twitter_url+"?text=Check out this link :&" +
                                    "url="+currentArticle.getArticleUrl()+"\n&" +
                                    "hashtags=CSCI571NewsSearch"));
                            v.getContext().startActivity(intent);
                        }
                    });
                    dialog.show();
                    return true;
                }
            });

            view.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent intent=new Intent(v.getContext(),DetailedArticleActivity.class);
                    intent.putExtra("id",currentArticle.getId());
                    v.getContext().startActivity(intent);
                }
            });


        }

        public ArrayList<NewsArticle> getStoredArticles() {
            sharedpreferences = view.getContext().getSharedPreferences(Constants.mypreference,
                    Context.MODE_PRIVATE);
            ArrayList<NewsArticle> storedArticles;
            Gson gson = new Gson();
            if(sharedpreferences.contains(Constants.bookmarks_key)) {
                Type type = new TypeToken< ArrayList < NewsArticle >>() {}.getType();
                storedArticles=gson.fromJson(sharedpreferences.getString(Constants.bookmarks_key,""),type);
            }
            else
            {
                storedArticles=new ArrayList<>();
            }
            return storedArticles;
        }

        public void setBookmarkIcon(ImageView bmView) {
            ArrayList<NewsArticle> storedArticles=getStoredArticles();
            boolean isBookmarked=false;
            for(int i=0;i<storedArticles.size();i++) {
                if(storedArticles.get(i).getId().equals(currentArticle.getId())) {
                    isBookmarked=true;
                }
            }
            if (isBookmarked) {
                bmView.setImageResource(R.drawable.ic_bookmark_red_24dp);
            } else {
                bmView.setImageResource(R.drawable.ic_bookmark_border_black_24dp);
            }

        }

        public void addBookmarkFunction(ImageView bmView) {
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
                bmView.setImageResource(R.drawable.ic_bookmark_border_black_24dp);
                Toast.makeText(view.getContext(),currentArticle.getTitle()+" was removed from bookmarks",Toast.LENGTH_SHORT).show();
            } else {
                storedArticles.add(currentArticle);
                bmView.setImageResource(R.drawable.ic_bookmark_red_24dp);
                Toast.makeText(view.getContext(),currentArticle.getTitle()+" was added to bookmarks",Toast.LENGTH_SHORT).show();
            }
            Gson gson = new Gson();
            String json = gson.toJson(storedArticles);
            SharedPreferences.Editor editor = sharedpreferences.edit();
            editor.putString(Constants.bookmarks_key,json);
            editor.apply();

        }

        public void addBookmarkDialogFunction(ImageView bmDialogView, ImageView bmArticleView) {
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
                bmDialogView.setImageResource(R.drawable.ic_bookmark_border_black_24dp);
                bmArticleView.setImageResource(R.drawable.ic_bookmark_border_black_24dp);
                Toast.makeText(view.getContext(),currentArticle.getTitle()+" was removed from bookmarks",Toast.LENGTH_SHORT).show();
            } else {
                storedArticles.add(currentArticle);
                bmDialogView.setImageResource(R.drawable.ic_bookmark_red_24dp);
                bmArticleView.setImageResource(R.drawable.ic_bookmark_red_24dp);
                Toast.makeText(view.getContext(),currentArticle.getTitle()+" was added to bookmarks",Toast.LENGTH_SHORT).show();
            }
            Gson gson = new Gson();
            String json = gson.toJson(storedArticles);
            SharedPreferences.Editor editor = sharedpreferences.edit();
            editor.putString(Constants.bookmarks_key,json);
            editor.apply();

        }

    }

    public NewsArticleAdapter(ArrayList<NewsArticle> newsArticles) {
        articleList = newsArticles;
    }

    @NonNull
    @Override
    public NewsArticleViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        view = LayoutInflater.from(parent.getContext()).inflate(R.layout.news_article, parent, false);
        NewsArticleViewHolder nvh = new NewsArticleViewHolder(view);
        return nvh;
    }

    @Override
    public void onBindViewHolder(@NonNull NewsArticleViewHolder holder, int position) {
        NewsArticle currentItem = articleList.get(position);
        holder.currentArticle=currentItem;
        String imageUri = currentItem.getImage();
        ImageView ivBasicImage = holder.imageView;
        Picasso.with(view.getContext()).load(imageUri).fit().into(ivBasicImage);
        holder.currentArticle.setArticleUrl(currentItem.getArticleUrl());
        holder.titleView.setText(currentItem.getTitle());
        if (isBookmarked(currentItem)) {
            holder.bookmarkView.setImageResource(R.drawable.ic_bookmark_red_24dp);
        } else {
            holder.bookmarkView.setImageResource(R.drawable.ic_bookmark_border_black_24dp);
        }
        try {
            holder.descriptionView.setText(currentItem.getDescription());
        } catch (ParseException e) {
            e.printStackTrace();
        }
    }

    @Override
    public int getItemCount() {
        return articleList.size();
    }

    private boolean isBookmarked(NewsArticle current) {
        SharedPreferences sharedpreferences = view.getContext().getSharedPreferences(Constants.mypreference,
                Context.MODE_PRIVATE);
        ArrayList<NewsArticle> storedArticles;
        Gson gson = new Gson();
        if(sharedpreferences.contains(Constants.bookmarks_key)) {
            Type type = new TypeToken< ArrayList < NewsArticle >>() {}.getType();
            storedArticles=gson.fromJson(sharedpreferences.getString(Constants.bookmarks_key,""),type);
            for(int i=0;i<storedArticles.size();i++) {
                if(storedArticles.get(i).getId().equals(current.getId())) {
                    return true;
                }
            }
        }
        return false;
    }

}
