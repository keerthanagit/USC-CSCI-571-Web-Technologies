import React, {Component} from 'react';
import SearchResult from './SearchResult.js';
import {Link} from 'react-router-dom';
import '../custom_css/SearchResults.css';
import * as ConstantFunctions from '../constants/ConstantFunctions.js';
import * as ConstantVariables from '../constants/ConstantVariables.js';
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

class SearchPage extends Component {

    constructor() {
        super();
        this.state={
                    articles : [],
                    isGuardian : false
                };
    }

    componentDidMount() {
        const baseUrl=ConstantVariables.BASE_URL;
        let channel="";
        if(this.props.toggleState==="on")
        {
            channel="guardian/search/";
            this.setState({isGuardian : true});
        }
        else
        {
            channel="nytimes/search/";
            this.setState({isGuardian : false});
        }
        fetch(baseUrl+channel+this.props.location.search)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    articles: this.state.isGuardian ? data.response.results : data.response.docs,
                })
            })
    }

    getArticles() {
        let ans;
        if(this.state.isGuardian)
        {
            ans= this.state.articles.map( result =>
                                                <Col key={result.id} xs={12} sm={12} md={6} lg={4} xl={3}>
                                                    <Link className="news_article_link" to={"/article?id="+result.id} key={result.id}>
                                                            <SearchResult
                                                                imgUrl={ConstantFunctions.getGuardianImageUrl(result.blocks.main.elements[0].assets)}
                                                                title={result.webTitle}
                                                                description={result.blocks.body[0].bodyTextSummary}
                                                                date={result.webPublicationDate}
                                                                category={result.sectionId}
                                                                share={result.webUrl}/>
                                                    </Link>
                                                </Col>
                                       );
        }
        else
        {
            ans= this.state.articles.map( result =>
                                            <Col key={result.id} xs={12} sm={12} md={6} lg={4} xl={3}>
                                                <Link className="news_article_link" to={"/article?id="+result.web_url} key={result.web_url}>
                                                   <SearchResult
                                                       imgUrl={ConstantFunctions.getNytimesImageUrl(result)}
                                                       title={result.headline.main}
                                                       description={result.abstract}
                                                       date={result.pub_date}
                                                       category={result.news_desk}
                                                       share={result.web_url}/>
                                                </Link>
                                             </Col>
                                              )
        }
        return ans;
    }

    render() {
        return(
                <div>
                    <Container fluid>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12} ><h1>Results</h1></Col>
                        </Row>
                        <div className="search_results">
                            <Row>
                                {this.getArticles()}
                            </Row>
                        </div>
                    </Container>
                 </div>
        );
    }
}

export default SearchPage;