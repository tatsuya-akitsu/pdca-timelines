import React, { Component } from 'react';

class SuccessBaloon extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const className = this.props.className;
    const name = this.props.name;
    const items = this.props.items;
    return (
      <p className={`${className} ${name}`}>
        {items.map((item, i) => {
          return (
            <span className="success-inlineText" key={i}><i className="fas fa-check"></i>{item}</span>
          )
        })}
      </p>
    )
  }
}

export default SuccessBaloon
