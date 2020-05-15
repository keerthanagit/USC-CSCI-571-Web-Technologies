package com.example.newsapp;

import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.google.gson.Gson;
import com.squareup.picasso.Picasso;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Iterator;

public class BookmarkArticleAdapter extends RecyclerView.Adapter<BookmarkArticleAdapter.BookmarkArticleViewHolder> {
    private static ArrayList<NewsArticle> articleList;
    private static View view;
    SharedPreferences sharedpreferences;

    public static class BookmarkArticleViewHolder extends RecyclerView.ViewHolder {
        SharedPreferences sharedpreferences;
        public ImageView imageView;
        public ImageView bookmarkView;
        public TextView titleView;
        public TextView descriptionView;
        public NewsArticle currentArticle;

        public BookmarkArticleViewHolder(@NonNull final View itemView) {
            super(itemView);
            imageView = itemView.findViewById(R.id.bookmark_image);
            titleView = itemView.findViewById(R.id.bookmark_title);
            descriptionView = itemView.findViewById(R.id.bookmark_description);
            bookmarkView = itemView.findViewById(R.id.bookmark_icon);
        }

    }

    public void addBookmarkDialogFunction(NewsArticle currentArticle, int position) {
        Iterator iterator = articleList.iterator();
        while (iterator.hasNext()) {
            NewsArticle article = (NewsArticle) iterator.next();
            if (article.getId().equals(currentArticle.getId())) {
                iterator.remove();
                break;
            }
        }
        Gson gson = new Gson();
        String json = gson.toJson(articleList);
        sharedpreferences = view.getContext().getSharedPreferences(Constants.mypreference,
                Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedpreferences.edit();
        editor.putString(Constants.bookmarks_key, json);
        editor.apply();
        notifyItemRemoved(position);
        Toast.makeText(view.getContext(), currentArticle.getTitle() + " was removed from bookmarks", Toast.LENGTH_SHORT).show();
    }

    public BookmarkArticleAdapter(ArrayList<NewsArticle> newsArticles) {
        articleList = newsArticles;
    }

    @NonNull
    @Override
    public BookmarkArticleViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        view = LayoutInflater.from(parent.getContext()).inflate(R.layout.bookmark_article, parent, false);
        BookmarkArticleViewHolder nvh = new BookmarkArticleViewHolder(view);
        return nvh;
    }

    @Override
    public void onBindViewHolder(@NonNull final BookmarkArticleViewHolder holder, final int position) {
        final NewsArticle currentItem = articleList.get(position);
        holder.currentArticle = currentItem;
        holder.currentArticle.setArticleUrl(currentItem.getArticleUrl());
        String imageUri = currentItem.getImage();
        ImageView ivBasicImage = holder.imageView;
        Picasso.with(view.getContext()).load(imageUri).fit().into(ivBasicImage);
        holder.titleView.setText(currentItem.getTitle());
        holder.bookmarkView.setImageResource(R.drawable.ic_bookmark_red_24dp);
        try {
            holder.descriptionView.setText(currentItem.getDescription());
        } catch (ParseException e) {
            e.printStackTrace();
        }

        holder.bookmarkView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sharedpreferences = v.getContext().getSharedPreferences(Constants.mypreference,
                        Context.MODE_PRIVATE);
                SharedPreferences.Editor editor = sharedpreferences.edit();
                Iterator iterator = articleList.iterator();
                while (iterator.hasNext()) {
                    NewsArticle article = (NewsArticle) iterator.next();
                    if (article.getId().equals(currentItem.getId())) {
                        iterator.remove();
                        break;
                    }
                }
                holder.bookmarkView.setImageResource(R.drawable.ic_bookmark_border_black_24dp);
                Gson gson = new Gson();
                String json = gson.toJson(articleList);
                editor.putString(Constants.bookmarks_key, json);
                editor.apply();
                Toast.makeText(view.getContext(), currentItem.getTitle() + " was removed from bookmarks", Toast.LENGTH_SHORT).show();
                notifyItemRemoved(position);
            }
        });


        view.setOnLongClickListener(new View.OnLongClickListener() {
            @Override
            public boolean onLongClick(View v) {

                // custom dialog
                System.out.println("currentItem:" + currentItem);
                final Dialog dialog = new Dialog(holder.itemView.getContext());
                dialog.setContentView(R.layout.share_dialog);
                dialog.setTitle("Title...");

                // set the custom dialog components - text, image and button
                TextView text = (TextView) dialog.findViewById(R.id.share_article_title);
                text.setText(currentItem.getTitle());
                ImageView image = (ImageView) dialog.findViewById(R.id.share_article_image);
                String imageUri = currentItem.getImage();
                Picasso.with(view.getContext()).load(imageUri).fit().into(image);
                final ImageView bmarkView = dialog.findViewById(R.id.share_article_bookmark);
                bmarkView.setImageResource(R.drawable.ic_bookmark_red_24dp);
                bmarkView.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        dialog.dismiss();
                        addBookmarkDialogFunction(currentItem, position);

                    }
                });
                final ImageView twitterView = dialog.findViewById(R.id.share_article_twitter);
                twitterView.setImageResource(R.drawable.bluetwitter);
                twitterView.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(Constants.twitter_url + "?text=Check out this link :&" +
                                "url=" + currentItem.getArticleUrl() + "\n&" +
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
                Intent intent = new Intent(v.getContext(), DetailedArticleActivity.class);
                intent.putExtra("id", currentItem.getId());
                v.getContext().startActivity(intent);
            }
        });
    }

    @Override
    public int getItemCount() {
        return articleList.size();
    }

}
