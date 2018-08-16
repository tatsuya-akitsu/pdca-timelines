import React, { Component } from 'react';

class ErrBaloon extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const className = this.props.className;
    const name = this.props.name;
    const items = this.props.items;
    return (
      <p className={`${className} ${name}`}>
        {items.map((err, i) => {
          return (
            <span className="err-text" key={i}><i className="fas fa-exclamation-triangle"></i>{err}</span>
          )
        })}
      </p>
    )
  }
}

export default ErrBaloon
