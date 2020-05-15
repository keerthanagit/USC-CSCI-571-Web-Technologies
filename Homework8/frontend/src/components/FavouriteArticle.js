import React, {Component} from 'react';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import '../custom_css/SearchResult.css';
import ShareArticle from './ShareArticle.js';
import { Redirect } from "react-router-dom";
import {MdDelete} from 'react-icons/md';
import * as ConstantFunctions from '../constants/ConstantFunctions.js';
import Truncate from 'react-truncate';

class FavouriteArticle extends Component {
    constructor() {
        super();
        this.state = {
            redirect : false
        };
        this.handleRedirect=this.handleRedirect.bind(this);
    }

    handleRedirect(event) {
             this.setState({
                        redirect: true
                    });
        }

    render() {
        return(
        this.state.redirect ?
                              <Redirect to={
                                                {
                                                      pathname: "article",
                                                      state: {
                                                          temp: this.props.channel
                                                      },
                                                      search: this.props.query
                                                 }
                                            }
                              />
                            :
                                <Card className="search_result" style={{ width: '18rem' }} onClick={event =>{this.handleRedirect(this.handleRedirect(event))}}>
                                    <Card.Title>
                                        <Truncate width={400} ellipsis={<span>...</span>}>
                                            {this.props.title}
                                        </Truncate>
                                        <ShareArticle
                                            showChannel={true}
                                            channel={this.props.newsChannel}
                                            title={this.props.title}
                                            share={this.props.share}
                                        />
                                        <MdDelete className="delete" onClick={this.props.removeArticle}/>
                                    </Card.Title>
                                  <Card.Body>
                                    <Card.Img className="article_image" variant="top" src={this.props.imgUrl} />
                                 </Card.Body>
                                    <div className="news_article_bottom">
                                      <Card.Text style={{fontStyle : "italic"}}>
                                        {ConstantFunctions.getDate(this.props.date)}
                                      </Card.Text>
                                      <Card.Text >
                                        <Badge variant="primary" style={ConstantFunctions.getSectionStyle(this.props.category)}>{ConstantFunctions.getSectionName(this.props.category)}</Badge>
                                        <Badge variant="primary" style={ConstantFunctions.getSectionStyle(this.props.newsChannel)}>{ConstantFunctions.getSectionName(this.props.newsChannel)}</Badge>
                                      </Card.Text>
                                    </div>
                                </Card>
        );
    }
}

export default FavouriteArticle;