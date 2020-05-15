import React, {Component} from 'react';
import NewsArticle from './NewsArticle.js';
import LoadingButton from './LoadingButton.js';
import {Link} from 'react-router-dom';
import '../custom_css/PageBody.css';
import * as ConstantFunctions from '../constants/ConstantFunctions.js';
import * as ConstantVariables from '../constants/ConstantVariables.js';
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

class PageBody extends Component {

    constructor() {
            super();
            this.state={
                articles : [],
                isLoading : true,
                isGuardian : false
            };
        }

    componentWillUnmount() {
        this.setState({
            isLoading: true,
            articles: []
        })
    }

    componentDidUpdate(prevProps) {
        if(prevProps.section !== this.props.section || prevProps.toggleState !== this.props.toggleState) {
                    this.setState({isLoading: true});
                    const baseUrl=ConstantVariables.BASE_URL;
                    let channel="";
                    if(this.props.toggleState==="on")
                    {
                        channel="guardian/category/";
                        this.setState({isGuardian : true});
                    }
                    else
                    {
                        channel="nytimes/category/";
                        this.setState({isGuardian : false});
                    }
                    fetch(baseUrl+channel+this.props.section)
                        .then(response => response.json())
                        .then(data => {
                            this.setState({
                                articles: this.state.isGuardian ? (data.response ? data.response.results : []): data.results,
                                isLoading : false
                            })
                        })
        }

    }

    componentWillReceiveProps(prevProps) {
        if(prevProps.toggleState !== this.props.toggleState) {
            this.setState({
                isLoading: true,
                articles: []
            })
        }
    }

    componentDidMount() {
        this.setState({isLoading: true});
        const baseUrl=ConstantVariables.BASE_URL;
        let channel="";
        if(this.props.toggleState==="on")
        {
            channel="guardian/category/";
            this.setState({isGuardian : true});
        }
        else
        {
            channel="nytimes/category/";
            this.setState({isGuardian : false});
        }
        fetch(baseUrl+channel+this.props.section)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    articles: this.state.isGuardian ? data.response.results : data.results,
                    isLoading : false
                })
            })
    }

    render() {
        return (
            <div className="page_body">
                <Container fluid>
                    <Row>
                        {this.state.isLoading ? <LoadingButton /> : this.getArticles() }
                    </Row>
                </Container>
            </div>
        );
    }

    getArticles() {
        let ans;
        if(this.state.isGuardian)
        {
            if(this.state.articles === null || this.state.articles === undefined || this.state.articles.length === 0) {
                return <LoadingButton />
            }
            ans= this.state.articles.map( result =>
                                <Row key={result.id}>
                                    <Link className="news_article_link" to={"/article?id="+result.id} key={result.id}>
                                        <NewsArticle
                                            imgUrl={ConstantFunctions.getGuardianImageUrl(result.blocks.main.elements[0].assets)}
                                            title={result.webTitle}
                                            description={result.blocks.body[0].bodyTextSummary}
                                            date={result.webPublicationDate}
                                            category={result.sectionId}
                                            share={result.webUrl}/>
                                    </Link>
                                </Row>
                                       );
        }
        else
        {
            if(this.state.articles === null || this.state.articles === undefined || this.state.articles.length === 0) {
                return <LoadingButton />
            }
            ans= this.state.articles.map( result =>
                                        <Row key={result.id}>
                                            <Link className="news_article_link" to={"/article?id="+result.url} key={result.url}>
                                               <NewsArticle
                                                   imgUrl={ConstantFunctions.getNytimesImageUrl(result)}
                                                   title={result.title}
                                                   description={result.abstract}
                                                   date={result.published_date}
                                                   category={result.section}
                                                   share={result.url}/>
                                               </Link>
                                           </Row>
                                              )
        }
        return ans;
    }
}

export default PageBody;