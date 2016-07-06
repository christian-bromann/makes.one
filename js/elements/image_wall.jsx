/* global fetch */

import React from 'react'
import Masonry from 'react-masonry-component'
import 'whatwg-fetch'

const MASONRY_OPTIONS = {
    transitionDuration: 200,
    gutter: 10,
    itemSelector: 'article.item'
}

class ImageWall extends React.Component {
    get displayName () {
        return 'ImageWall'
    }

    constructor (props) {
        super(props)
        this.url = '/wp-json/posts'
        this.state = { posts: [] }
    }

    componentWillMount () {
        fetch(this.url)
            .then(this.checkStatus)
            .then(this.parseJSON)
            .then((res) => {
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
        const childElements = this.state.posts.map((post) => (
            <article className="item" key={post.ID}>
                <a href={`#!/${post.slug}`}>
                    <img alt={post.title} src={post.featured_image.source} title={post.title}></img>
                </a>
            </article>
        ))

        return (
            <Masonry
                className={'imageWall'}
                disableImagesLoaded={false}
                elementType={'section'}
                options={MASONRY_OPTIONS}
                updateOnEachImageLoad={false}
            >
                {childElements}
            </Masonry>)
    }
}

export default ImageWall
