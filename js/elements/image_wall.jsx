import React from 'react'
import 'whatwg-fetch'

class ImageWall extends React.Component {
    get displayName () {
        return 'ImageWall'
    }

    constructor (props) {
        super(props)
        this.url = '/wp-json/posts'
        this.state = { posts: [] }
    }

    componentDidMount () {
        this.serverRequest = fetch(this.url)
            .then(this.checkStatus)
            .then(this.parseJSON)
            .then((res) => {
                console.log(res)
                this.setState({
                    posts: res
                })
            })
    }

    checkStatus (response) {
        if (response.status >= 200 && response.status < 300) {
            return response
        }

        let error = new Error(response.statusText)
        error.response = response
        throw error
    }

    parseJSON (response) {
        return response.json()
    }

    render () {
        console.log(1, this.state)
        return (
            <section className="imageWall">
                {this.state.posts.map((post) => (
                    <article className="item" key={post.ID}>
                        <a href={`#!/${post.slug}`}>
                            <img alt={post.title} src={post.featured_image.source} title={post.title}></img>
                        </a>
                    </article>)
                )}
            </section>)
    }
}

export default ImageWall
