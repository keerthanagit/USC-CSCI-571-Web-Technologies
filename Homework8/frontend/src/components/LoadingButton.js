import React from "react";
import { css } from "@emotion/core";
import BounceLoader from "react-spinners/BounceLoader";
import '../custom_css/LoadingButton.css';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

class LoadingButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  render() {
    return (
      <div className="loading">
        <BounceLoader
          size={50}
          color={"#123abc"}
          loading={this.state.loading}
        />
        <p> Loading </p>
      </div>
    );
  }
}

export default LoadingButton;