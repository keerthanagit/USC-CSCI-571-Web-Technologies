import React, {Component} from 'react';
import CommentBox from './CommentBox.js';
import LoadingButton from './LoadingButton.js';
import DetailedArticle from './DetailedArticle.js';
import * as ConstantFunctions from '../constants/ConstantFunctions.js';
import * as ConstantVariables from '../constants/ConstantVariables.js';

class ArticleDisplay extends Component {
    constructor() {
        super();
        this.state={
            article : {},
            isLoading : true,
            isGuardian : false
        };
    }

    componentDidMount() {
        const baseUrl=ConstantVariables.BASE_URL;
        let channel="";
        if(this.props.toggleState==="on")
        {
            channel="guardian/article";
            this.setState({isGuardian : true});
        }
        else
        {
            channel="nytimes/article";
            this.setState({isGuardian : false});
        }
        fetch(baseUrl+channel+this.props.location.search)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    article: this.state.isGuardian ? data.response.content : data.response.docs[0],
                    isLoading : false
                })
            })
    }

    render() {
        return (
                    <div>
                        {this.state.isLoading ? <LoadingButton /> : this.displayArticle() }
                    </div>
                );
    }

    displayArticle() {
        let ans=this.state.article;
        let result;
        if(this.state.isGuardian)
        {
           result = <div>
                        <DetailedArticle
                            title={ans.webTitle}
                            imgUrl={ConstantFunctions.getGuardianImageUrl(ans.blocks.main.elements[0].assets)}
                            description={ans.blocks.body[0].bodyTextSummary}
                            date={ans.webPublicationDate}
                            share={ans.webUrl}
                            newsChannel="guardian"
                            query={this.props.location.search}
                            category={ans.sectionId}
                        />
                        <CommentBox id={ans.id}/>
                   </div>
        }
        else
        {
            result = <div>
                         <DetailedArticle
                             title={ans.headline.main}
                             imgUrl={ConstantFunctions.getNytimesImageUrl(ans)}
                             description={ans.abstract}
                             date={ans.pub_date}
                             share={ans.web_url}
                             newsChannel="nytimes"
                             query={this.props.location.search}
                             category={ans.section_name}
                         />
                         <CommentBox id={ans.web_url}/>
                    </div>
        }
        return result;
    }

}

export default ArticleDisplay;