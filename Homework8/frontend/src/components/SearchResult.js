import React, {Component} from 'react';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import '../custom_css/SearchResult.css';
import ShareArticle from './ShareArticle.js';
import * as ConstantFunctions from '../constants/ConstantFunctions.js';
import Truncate from 'react-truncate';

class SearchResult extends Component {

    render() {
        return(
            <Card className="search_result" style={{ width: '18rem' }}>
                <Card.Title>
                    <Truncate width={400} ellipsis={<span>...</span>}>
                        {this.props.title}
                    </Truncate>
                    <ShareArticle
                        title={this.props.title}
                        share={this.props.share}
                    />
                </Card.Title>
              <Card.Body>
                <Card.Img className="article_image" variant="top" src={this.props.imgUrl} />
             </Card.Body>
                <div className="news_article_bottom">
                  <Card.Text style={{fontStyle : "italic"}}>
                    {ConstantFunctions.getDate(this.props.date)}
                  </Card.Text>
                  <Card.Text>
                    <Badge variant="primary" style={ConstantFunctions.getSectionStyle(this.props.category)}>{ConstantFunctions.getSectionName(this.props.category)}</Badge>
                  </Card.Text>
                </div>
            </Card>
        );
    }
}

export default SearchResult;