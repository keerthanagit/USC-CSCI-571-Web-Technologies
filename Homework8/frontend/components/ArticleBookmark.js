import React, {Component} from 'react';
import {FaRegBookmark, FaBookmark} from 'react-icons/fa';
import '../custom_css/ArticleBookmark.css';
import { toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../custom_css/ToastMessage.css';
import ReactTooltip from 'react-tooltip';

class ArticleBookmark extends Component {

    constructor() {
        super();
        this.state={
            isMarked : false
        };
        this.changeState  = this.changeState.bind(this);
        this.addBookmark=this.addBookmark.bind(this);
    }

    changeState() {
            if(this.state.isMarked)
            {
                this.setState({isMarked : false});
                this.removeBookmark();
            }
            else
            {
                this.setState({isMarked : true});
                this.addBookmark();

            }
        }

    displayToastMessage(article_title, isAdd) {
        toast.configure({
                    autoClose: 2000,
                    hideProgressBar: true,
                    transition : Zoom
        });
        if(isAdd) {
            toast('Saving '+article_title, {
                 position: toast.POSITION.TOP_CENTER
           });
       }
       else {
            toast('Removing '+article_title, {
                 position: toast.POSITION.TOP_CENTER
           });
       }
    }

    addBookmark() {
        this.displayToastMessage(this.props.title, true);
        let temp = window.localStorage.getItem("myData");
        let d;
        if(temp == null)
        {
            d = [];
            window.localStorage.setItem("myData",JSON.stringify(d));
        }
        let bm = {
                    title : this.props.title,
                    imgUrl : this.props.imgUrl,
                    description : this.props.description,
                    date : this.props.date,
                    share : this.props.share,
                    newsChannel : this.props.newsChannel,
                    query : this.props.query,
                    category : this.props.category,
                    id : this.props.query.substring(4)
                }
        let data = JSON.parse(window.localStorage.getItem("myData"));
        data.push(bm);
        window.localStorage.setItem("myData",JSON.stringify(data));

    }

    removeBookmark() {
        this.displayToastMessage(this.props.title, false);
        var data = JSON.parse(localStorage.getItem("myData")).filter(article => article.id !== this.props.query.substring(4));
        window.localStorage.setItem("myData",JSON.stringify(data));
    }
    articleBookmarked() {
        let temp = window.localStorage.getItem("myData");
        let d;
        if(temp == null)
        {
            d = [];
            window.localStorage.setItem("myData",JSON.stringify(d));
        }
        var data = JSON.parse(localStorage.getItem("myData")).filter(article => article.id === this.props.query.substring(4));
        if(data !== null && data.length !== 0 )
            return true;
        return false;
    }

    render() {
        return(
            this.articleBookmarked() ?
            <>
                <FaBookmark className="bookmark" onClick={this.changeState} data-tip = "Bookmark" />
                <ReactTooltip place= 'top' type = 'dark' effect = 'solid' />
            </>
             :
             <>
                <FaRegBookmark className="bookmark" onClick={this.changeState} data-tip = "Bookmark" />
                <ReactTooltip place= 'top' type = 'dark' effect = 'solid' id="exp_page1" />
             </>

        );
    }

}
export default ArticleBookmark;