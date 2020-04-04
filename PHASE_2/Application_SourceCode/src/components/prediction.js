import React from 'react'

class Prediction extends React.Component {
  render() {
    const { params } = this.props.match
    return (
      <div>
        <h1>place</h1>
        <p> {params.id} </p>
      </div>
    )
  }
}
export default Prediction;