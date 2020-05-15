import React, {Component} from 'react';
import Card from 'react-bootstrap/Card';
import '../custom_css/DetailedArticle.css';
import {EmailShareButton, EmailIcon, FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon} from "react-share";
import {FaAngleDown, FaAngleUp} from 'react-icons/fa';
import ArticleBookmark from './ArticleBookmark.js';
import * as ConstantFunctions from '../constants/ConstantFunctions.js';
import ReactTooltip from 'react-tooltip';
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Link, Element,animateScroll as scroll } from 'react-scroll';

class DetailedArticle extends Component {
    constructor() {
        super();
        this.state={
            textCompressed : true
        }
        this.expandExpander = this.expandExpander.bind(this);
        this.compressExpander = this.compressExpander.bind(this);
    }

    render() {
        const hashtag="CSCI_571_NewsApp";
        return(
        <Card className="detailed_article">
            <Container fluid className="no_padding">
              <Card.Body>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} ><Card.Title className="detailed_article_title">{this.props.title}</Card.Title></Col>
                </Row>
                <Row className="detailed_article_elements" >
                    <Col xs={5} sm={8} md={9} lg={9} xl={10} className="no_padding" >
                          <Card.Text className="detailed_article_date">
                            {ConstantFunctions.getDate(this.props.date)}
                          </Card.Text>
                    </Col>
                    <Col xs={5} sm={3} md={2} lg={2} xl={1} className="detailed_article_share_icons no_padding">
                        <FacebookShareButton url={this.props.share} hashtag={hashtag}>
                            <FacebookIcon size={30} round={true} data-tip = "Facebook"/>
                            <ReactTooltip place= 'top' type = 'dark' effect = 'solid' />
                        </FacebookShareButton>
                        <TwitterShareButton url={this.props.share} hashtags={[hashtag]}>
                            <TwitterIcon size={30} round={true} data-tip = "Twitter"/>
                            <ReactTooltip place= 'top' type = 'dark' effect = 'solid' />
                        </TwitterShareButton>
                        <EmailShareButton url={this.props.share} subject={hashtag}>
                            <EmailIcon size={30} round={true} data-tip = "Email"/>
                            <ReactTooltip place= 'top' type = 'dark' effect = 'solid' />
                        </EmailShareButton>
                    </Col>
                    <Col xs={2} sm={1} md={1} lg={1} xl={1} >
                        <ArticleBookmark
                             title={this.props.title}
                             imgUrl={this.props.imgUrl}
                             description={this.props.description}
                             date={this.props.date}
                             share={this.props.share}
                             newsChannel={this.props.newsChannel}
                             query={this.props.query}
                             category={this.props.category}
                        />
                    </Col>
                  </Row>
                <Card.Img className="detailed_article_img" variant="top" src={this.props.imgUrl} />
                {
                    this.state.textCompressed ?
                    <div>
                        <Card.Text className="article_description">
                           {/*<TextTruncate
                              line={6}
                              element="span"
                              truncateText=""
                              text={this.props.description}
                              textTruncateChild={<div><br/><FaAngleDown className="expander" onClick={this.changeExpander}/></div>}
                          />*/}
                          {this.getPara1(this.props.description)}
                          {this.hasMoreText(this.props.description) && <span>...</span>}
                          {this.hasMoreText(this.props.description) &&
                                <div><br/><Link to="para2" spy={true} smooth={true} duration={500} className="para2">
                                                <FaAngleDown className="expander" onClick={this.expandExpander}/>
                                            </Link>
                                </div>}
                          </Card.Text>
                      </div>
                    :
                    <div>
                        <Card.Text className="article_description">
                            {this.getPara1(this.props.description)}
                        </Card.Text>
                        <Element name="para2" className="element">
                            <Card.Text className="article_description">
                                {this.getPara2(this.props.description)}
                            </Card.Text>
                        </Element>
                        <FaAngleUp className="expander" onClick={this.compressExpander}/>
                    </div>
                }
              </Card.Body>
        </Container>
    </Card>
        );
    }

    expandExpander() {
        this.setState({
            textCompressed : !this.state.textCompressed
        });
    }
    compressExpander() {
       this.setState({
           textCompressed : !this.state.textCompressed
       });
       scroll.scrollToTop();
    }

    getPara1(text) {
        var arr=text.split(". ");
        var ans="";
        var size = arr.length >4 ? 4 : arr.length;
        for(let i=0;i<size;i++) {
            ans+=arr[i]+". ";
        }
        return ans.trim();
    }
    getPara2(text) {
        var arr=text.split(". ");
        var ans="";
        if(arr.length >4 ) {
            for(let i=4;i<arr.length;i++) {
                ans+=arr[i]+". ";
            }
        }
        return ans.substring(0,ans.length-2);
    }
    hasMoreText(text) {
        var arr=text.split(".");
        return (arr.length > 4);
    }
}
 export default DetailedArticle;