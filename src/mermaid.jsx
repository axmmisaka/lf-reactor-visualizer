import React from "react";
import mermaid from "mermaid";
import PropTypes from 'prop-types';

mermaid.initialize({
    startOnLoad: true,
    theme: 'default',
    securityLevel: 'loose',
    fontFamily: 'monospace',
});
export class Mermaid extends React.Component {
    componentDidMount() {
        mermaid.contentLoaded();
    }
    // https://codesandbox.io/s/react-with-mermaid-rendering-problem-forked-pv7znp?file=/src/index.js:261-494
    // https://stackoverflow.com/a/73058017
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.chart !== this.props.chart) {
          document
            .getElementById("mermaid-chart")
            .removeAttribute("data-processed");
          mermaid.contentLoaded();
        }
      }

    static get propTypes() {
        return {
            chart: PropTypes.string,
        }
    }

    render() {
        return <div id="mermaid-chart" className="mermaid">{this.props.chart}</div>;
    }
}