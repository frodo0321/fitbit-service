import React, { Component } from 'react';
import heart from "./heart.svg";

import "./Heart2.css";


class Heart2 extends Component {

    render() {

        return (
            <div className="Heart2">
                <a target="_blank" href="https://github.com/tylerhaun/fitbit-service">
                    <img className="heart-svg .animated" width="50" src={heart} />
                    <div className="heart-container">
                        <div className="heart-overlay">
                            <div className="bpm-text">{this.props.bpm} BPM</div>
                        </div>
                    </div>
                </a>
            </div>
        );
    }
}

export default Heart2;

