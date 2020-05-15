import React, {Component} from 'react';
import Card from 'react-bootstrap/Card';
import '../custom_css/NewsArticle.css';
import TextTruncate from 'react-text-truncate';
import Badge from 'react-bootstrap/Badge';
import ShareArticle from './ShareArticle.js';
import * as ConstantFunctions from '../constants/ConstantFunctions.js';
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

class NewsArticle extends Component {

    constructor() {
        super();
        this.state={};
    }

    render() {
        return(
            <Card className="news_article" >
                <Container fluid>
                    <Row xs={12} sm={12}>
                        <Col xs={12} sm={12} md={4} lg={4} xl={3}>
                            <Card.Img className="news_article_image" src={this.props.imgUrl} />
                        </Col>

                        <Col xs={12} sm={12} md={8} lg={8} xl={9}>
                          <Card.Body className="news_article_content">
                                <Card.Title className="news_article_title">
                                    {this.props.title}
                                    <ShareArticle
                                        title={this.props.title}
                                        share={this.props.share}
                                    />
                                 </Card.Title>
                            <Card.Text>
                                <TextTruncate
                                    line={3}
                                    element="span"
                                    truncateText="…"
                                    text={this.props.description}
                                />
                            </Card.Text>
                            <div className="news_article_bottom">
                              <Card.Text style={{fontStyle : "italic"}}>
                                {ConstantFunctions.getDate(this.props.date)}
                              </Card.Text>
                              <Card.Text>
                                <Badge variant="primary" style={ConstantFunctions.getSectionStyle(this.props.category)}>{ConstantFunctions.getSectionName(this.props.category)}</Badge>
                              </Card.Text>
                            </div>
                          </Card.Body>
                      </Col>
                 </Row>
             </Container>
        </Card>
        );
    }
}

export default NewsArticle;