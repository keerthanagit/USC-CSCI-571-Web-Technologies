import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './components/PageNavbar';
import PageBody from './components/PageBody';
import { Route, Switch, withRouter } from 'react-router-dom';
import ArticleDisplay from './components/ArticleDisplay';
import SearchPage from './components/SearchPage';
import FavouritesPage from './components/FavouritesPage';
import './App.css';

class App extends Component {
    getToggleState() {
        let ts = window.localStorage.getItem("newsToggle");
        if(ts === null) {
            window.localStorage.setItem("newsToggle","on");
        }
        return window.localStorage.getItem("newsToggle");
    }

    constructor() {
        super();
        this.state = {
            searchString : ""
        }
        this.handleInputChange=this.handleInputChange.bind(this);
        this.handleSearch= this.handleSearch.bind(this);
    }

    handleSearch(obj) {
        this.setState({
            searchString : obj.label
        })
        this.props.history.push("/search?keyword="+obj.label);
    }

    handleInputChange = (searchWord) => {
        if(searchWord === null || searchWord === undefined || searchWord.length === 0) return;
        console.log("searchWord: " + searchWord);
        this.setState({
            searchString : searchWord
        })
    }

    render() {
        return (
            <div>
                <Switch>
                    <Route exact path="/" render={(routeProps) => (
                        <>
                           <PageNavbar
                                displayToggle={true}
                                inBookmarksPage={false}
                                handleInputChange={(inputValue) => this.handleInputChange(inputValue)}
                                handleSearch={(obj) => this.handleSearch(obj)}
                             />
                           <PageBody {...routeProps} toggleState={this.getToggleState()} section="" />
                        </>
                    )} />
                    <Route exact path="/world" render={(routeProps) => (
                        <>
                            <PageNavbar
                                displayToggle={true}
                                inBookmarksPage={false}
                                handleInputChange={(inputValue) => this.handleInputChange(inputValue)}
                                handleSearch={(obj) => this.handleSearch(obj)}
                            />
                            <PageBody {...routeProps} toggleState={this.getToggleState()} section="world"/>
                        </>
                    )} />
                    <Route path="/politics" render={(routeProps) => (
                        <>
                            <PageNavbar
                                displayToggle={true}
                                inBookmarksPage={false}
                                handleInputChange={(inputValue) => this.handleInputChange(inputValue)}
                                handleSearch={(obj) => this.handleSearch(obj)}
                            />
                            <PageBody {...routeProps} toggleState={this.getToggleState()} section="politics"/>
                        </>
                    )}/>
                    <Route path="/business" render={(routeProps) => (
                        <>
                            <PageNavbar
                                displayToggle={true}
                                inBookmarksPage={false}
                                handleInputChange={(inputValue) => this.handleInputChange(inputValue)}
                                handleSearch={(obj) => this.handleSearch(obj)}
                            />
                            <PageBody {...routeProps} toggleState={this.getToggleState()} section="business"/>
                        </>
                    )}/>
                    <Route path="/technology" render={(routeProps) => (
                        <>
                            <PageNavbar
                                displayToggle={true}
                                inBookmarksPage={false}
                                handleInputChange={(inputValue) => this.handleInputChange(inputValue)}
                                handleSearch={(obj) => this.handleSearch(obj)}
                            />
                            <PageBody {...routeProps} toggleState={this.getToggleState()} section="technology"/>
                        </>
                    )}/>
                    <Route path="/sports" render={(routeProps) => (
                        <>
                            <PageNavbar
                                displayToggle={true}
                                inBookmarksPage={false}
                                handleInputChange={(inputValue) => this.handleInputChange(inputValue)}
                                handleSearch={(obj) => this.handleSearch(obj)}
                            />
                            <PageBody {...routeProps} toggleState={this.getToggleState()} section="sport"/>
                        </>
                    )}/>
                    <Route path="/article" render={(routeProps) => (
                        <>
                            <PageNavbar
                                displayToggle={false}
                                inBookmarksPage={false}
                                handleInputChange={(inputValue) => this.handleInputChange(inputValue)}
                                handleSearch={(obj) => this.handleSearch(obj)}
                            />
                            <ArticleDisplay {...routeProps} toggleState={this.getToggleState()}  />
                        </>
                    )}/>
                    <Route path="/search"  render={(routeProps) => (
                        <>
                            <PageNavbar
                                displayToggle={false}
                                inBookmarksPage={false}
                                search={this.state.searchString}
                                handleInputChange={(inputValue) => this.handleInputChange(inputValue)}
                                handleSearch={(obj) => this.handleSearch(obj)}
                            />
                            <SearchPage {...routeProps} key={window.location.search} toggleState={this.getToggleState()} />
                        </>
                    )}/>
                    <Route path="/favourites" render={(routeProps) => (
                        <>
                            <PageNavbar
                                displayToggle={false}
                                inBookmarksPage={true}
                                handleInputChange={(inputValue) => this.handleInputChange(inputValue)}
                                handleSearch={(obj) => this.handleSearch(obj)}
                            />
                            <FavouritesPage {...routeProps} />
                        </>
                    )}/>
                </Switch>
            </div>
        )
    }
}
export default withRouter(App);
