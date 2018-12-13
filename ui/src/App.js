import React, { Component } from 'react';
import axios from "axios";

//import Heart1 from "./Heart1";
//import Heart2 from "./Heart2";
import beatingHeart from "./beating-heart.gif";

import './App.css';

console.log("betingHEart", beatingHeart);
console.log("betingHEart", typeof(beatingHeart));
console.log("betingHEart", beatingHeart);

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {bpm: ""};
    
    }

    componentDidMount() {
        console.log("env", process.env);
        var apiUrl = process.env.REACT_APP_API_URL || "";
        var url = apiUrl + "/latest-heart-rate"
        axios.get(url)
            .then(response => {
                console.log("response", response);
                var newState = Object.assign({}, this.state, {bpm: response.data.latestHeartRate})
                this.setState(newState);
            })
    }

    render() {

        var sideLength = 50
        var width = sideLength;
        var height = sideLength;
        var heartHeightMultiplier = 2;
        var offsetMultiplier = sideLength / 1.7;
        var heartHeightOffset = (heartHeightMultiplier * offsetMultiplier) - offsetMultiplier;

        return (
            <div className="App">
                <a style={{display: "inline-block"}} target="_blank" href="https://github.com/tylerhaun/fitbit-service">
                    <div
                        className="heart-container"
                        style={{
                            width: width + "px",
                            height: height + "px"
                        }}
                    >
                        <img
                            src={beatingHeart}
                            style={{
                                top: -heartHeightOffset + "px",
                                height: height * heartHeightMultiplier + "px"
                            }}
                        />
                        <div
                            className="heart-overlay"
                        >
                            <div className="bpm-text">{this.state.bpm} BPM</div>
                        </div>
                    </div>
                </a>
            </div>
        );
    }
}

export default App;
