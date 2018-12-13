import React, { Component } from 'react';

import "./Heart1.css";


class Heart1 extends Component {

    render() {

        return (
            <div className="Heart1">
                <a target="_blank" href="https://github.com/tylerhaun/fitbit-service">
                    <div className="heart-container">
                        <div className="heart animated"></div>
                        <div className="heart-overlay">
                            <div className="bpm-text">{this.props.bpm} BPM</div>
                        </div>
                    </div>
                </a>
            </div>
        );
    }
}

export default Heart1;
