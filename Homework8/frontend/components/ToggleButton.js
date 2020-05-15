import React, { Component } from "react";
import Switch from "react-switch";
import { withRouter } from 'react-router-dom';

class ToggleButton extends Component {

  constructor() {
    super();
    this.state = { checked: true };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    //1. Reset the flag in the local storage
    let toggleState = window.localStorage.getItem("newsToggle");
    if(toggleState === "off"){
        window.localStorage.setItem("newsToggle","on");
    }
    else
    {
        window.localStorage.setItem("newsToggle","off");
    }

    //2. Change the state of the toggle
    this.setState(prevState => {
        return {
            checked: !prevState.checked
        }
    })

    //3. Go to the respective home page
    this.props.history.push(this.props.location.pathname);
  }

  componentDidMount() {
    let temp = window.localStorage.getItem("newsToggle");
    if(temp === null || temp === undefined)
    {
        window.localStorage.setItem("newsToggle",JSON.stringify("on"));
        this.setState({
            checked: true
        })
    } else {
        if(temp === "off") {
            this.setState({
                checked: false
            })
        } else {
            this.setState({
                checked: true
            })
        }
    }
  }

  render() {
    return (
        <Switch
            checked={this.state.checked}
            onChange={this.handleChange}
            onColor="#0080ff"
            offColor="#e6e6e6"
            handleDiameter={18}
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
            height={20}
            width={48}
            className="react-switch"
            id="material-switch"
          />
    );
  }
}

export default withRouter(ToggleButton);