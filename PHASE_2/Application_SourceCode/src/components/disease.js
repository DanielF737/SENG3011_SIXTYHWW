import React from 'react'

class Disease extends React.Component {
  render() {
    const { params } = this.props.match
    return (
      <div>
        <h1>disease</h1>
        <p> {params.id} </p>
      </div>
    )
  }
}
export default Disease;