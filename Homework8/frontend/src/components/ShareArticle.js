import React, {Component} from 'react';
import {EmailShareButton, EmailIcon, FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon} from "react-share";
import Modal from 'react-bootstrap/Modal';
import {MdShare} from 'react-icons/md';
import '../custom_css/ShareArticle.css';

class ShareArticle extends Component {

    constructor() {
        super();
        this.state={
            show : false
        };
        this.handleClick=this.handleClick.bind(this);
        this.handleClose=this.handleClose.bind(this);
    }

    handleClick(event){
        event.preventDefault();
        this.setState({show : true});
    }

    handleClose() {
       this.setState({show : false});
    }

    handleHide(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    getChannelName() {
        if(this.props.channel === "guardian")
            return "Guardian";
        else
            return "NYTimes";
    }

    render() {
        const hashtag="CSCI_571_NewsApp";
        const subject="#CSCI_571_NewsApp";
        return(
            <div className="share_div" onClick={(event) => this.handleHide(event)}>
                <MdShare
                    className="share_icon"
                    onClick={(event) => this.handleClick(event)}
                />
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {this.props.showChannel && <h2>{this.getChannelName()}</h2>}
                            <p>{this.props.title}</p>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4 className="share_via">Share via</h4>
                        <div className="search_result_share_icons">
                            <FacebookShareButton url={this.props.share} hashtag={subject}>
                                <FacebookIcon size={60} round={true}/>
                            </FacebookShareButton>
                            <TwitterShareButton url={this.props.share} hashtags={[hashtag]}>
                                <TwitterIcon size={60} round={true}/>
                            </TwitterShareButton>
                            <EmailShareButton url={this.props.share} subject={subject}>
                                <EmailIcon size={60} round={true}/>
                            </EmailShareButton>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default ShareArticle;