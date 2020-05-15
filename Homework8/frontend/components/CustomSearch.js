import React, { Component } from "react";
import '../custom_css/CustomSearch.css';
import { withRouter } from 'react-router-dom';
import AsyncSelect from 'react-select/async';
import debounce from 'debounce-promise';

class CustomSearch extends Component {
    constructor() {
        super();
        this.state={
            results : [],
            selectedResult: null
        }
        this.loadOptions= debounce(this.loadOptions.bind(this), 1000);
    }

    async loadOptions(inputValue) {
        if(inputValue === undefined || inputValue === null || inputValue.length === 0 ) return;
        let suggestions="https://api.cognitive.microsoft.com/bing/v7.0/suggestions?q=";
        try {
            const response = await fetch(suggestions+inputValue, {  headers: { "Ocp-Apim-Subscription-Key": "42b035235d5f4b83836c9380ce2434a7" } } );
            const data = await response.json();
            const resRaw = data.suggestionGroups[0].searchSuggestions
            const res = resRaw.map(result =>  ({label : result.displayText}));
            return res;
        }
        catch(error) {
            console.error ('Error fetching search results for '+inputValue);
            return null;
        }
    }

    displaySearchResults(optLabel, optValue) {
        this.props.history.push("/search?keyword="+optLabel);
    }

    render() {
        const searchStyleOptions= {
            option : (provided, state) => ({
                ...provided,
                backgroundColor : state.isFocused ? "#e6f2ff" : "white",
                color : "black"
            })
        }
        return (
                    <AsyncSelect
                        placeholder="Enter keyword .."
                        noOptionsMessage = {() => "No Match"}
                        className="my-search"
                        loadOptions = {this.loadOptions}
                        /*onChange= {opt => this.displaySearchResults(opt.label,opt.value)}*/
                        onChange= {this.props.handleSearch}
                        value = {this.props.search ? ({label : this.props.search}) : null }
                        onInputChange = {(inputValue) => this.props.handleInputChange(inputValue)}
                        styles = {searchStyleOptions}
                    />
        );
    }
}
export default withRouter(CustomSearch);