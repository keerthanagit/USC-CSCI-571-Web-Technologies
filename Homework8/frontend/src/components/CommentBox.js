import React, {Component} from 'react';
import commentBox from 'commentbox.io';

class CommentBox extends Component {
    constructor() {
        super();
        this.state={};
    }

    componentDidMount() {
        this.removeCommentBox = commentBox('5762378692034560-proj');
    }

    componentWillUnmount() {
        this.removeCommentBox();
    }

    render() {
        return (
            <div className="commentbox" id={this.props.id}/>
        );
    }
}

export default CommentBox;