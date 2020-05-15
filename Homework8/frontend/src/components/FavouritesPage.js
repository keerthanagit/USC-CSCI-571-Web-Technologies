import React, {Component} from 'react';
import FavouriteArticle from './FavouriteArticle.js';
import LoadingButton from './LoadingButton.js';
import '../custom_css/SearchResults.css';
import '../custom_css/FavouritesPage.css';
import '../custom_css/ToastMessage.css';
import { toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

class FavouritesPage extends Component {

    constructor() {
        super();
        this.state={
                    articles : [],
                    isLoading : true
                };
        this.handleDeletion= this.handleDeletion.bind(this);
    }

    displayToastMessage(article_title) {
        toast.configure({
                    autoClose: 2000,
                    hideProgressBar: true,
                    transition : Zoom
        });
        toast('Removing '+article_title, {
             position: toast.POSITION.TOP_CENTER
       });
    }

    handleDeletion(event, article_id, article_title) {
        this.displayToastMessage(article_title);
        var data = JSON.parse(localStorage.getItem("myData")).filter(article => article.id !== article_id);
        window.localStorage.setItem("myData",JSON.stringify(data));
        this.setState({
            isLoading: false,
            articles: data
        });
        event.preventDefault();
        event.stopPropagation();
    }

    componentDidMount() {
        let data =JSON.parse( window.localStorage.getItem("myData"));
        if(data!=null)
        {
            this.setState({
                articles: data,
                isLoading : false
            });
        }
        else
        {
            let d = [];
            window.localStorage.setItem("myData",JSON.stringify(d));
            this.setState({
                articles: [],
                isLoading : false
            });
        }
    }

    getArticles() {
        let ans;
        const articles=this.state.articles;

           ans = articles.map( result =>
                                <Col key={result.id} xs={12} sm={12} md={6} lg={4} xl={3}>
                                    <FavouriteArticle
                                        imgUrl={result.imgUrl}
                                        title={result.title}
                                        description={result.description}
                                        date={result.date}
                                        category={result.category}
                                        share={result.share}
                                        newsChannel={result.newsChannel}
                                        query={result.query}
                                        id={result.id}
                                        key  ={result.id}
                                        removeArticle={event => this.handleDeletion(event, result.id, result.title)}/>
                                </Col>
                        );
        return ans;
    }

    render() {
        const articles=this.getArticles();
        return(
            <div>
                {this.state.isLoading ? <LoadingButton />
                :
                (articles.length === 0) ?
                    <h3 className="no_articles">You have no saved articles</h3>
                    :
                    <div>
                        <Container fluid>
                            <Row>
                                <Col xs={12} sm={12} md={12} lg={12} xl={12} ><h1>Favorites</h1></Col>
                            </Row>
                            <div className="search_results">
                                <Row>
                                    {this.getArticles()}
                                </Row>
                            </div>
                        </Container>
                     </div>

              }
            </div>
        );
    }
}

export default FavouritesPage;