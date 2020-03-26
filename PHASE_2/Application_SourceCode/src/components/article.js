import React from 'react'

class Article extends React.Component {
  render() {
    const { params } = this.props.match
    return (
      <div>
        <h1>Article</h1>
        <p> {params.id} </p>
      </div>
    )
  }
}
export default Article;