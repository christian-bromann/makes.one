/* global fetch */

import React from 'react'
import Masonry from 'react-masonry-component'
import 'whatwg-fetch'

import Slideshow from './slideshow.jsx'

const MASONRY_OPTIONS = {
    isAnimated: true,
    columnWidth: 1,
    itemSelector: 'article.item'
}

class ImageWall extends React.Component {
    get displayName () {
        return 'ImageWall'
    }

    constructor (props) {
        super(props)
        this.url = '/wp-json/posts'
        this.state = { posts: [], activePost: null }
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

    setActivePost (id) {
        this.setState({ activePost: id })
    }

    render () {
        const childElements = this.state.posts.map((post) => {
            return (
                <Slideshow
                    isActive={this.state.activePost === post.ID}
                    isVisible={this.state.activePost === null}
                    key={post.ID}
                    post={post}
                    setActivePost={this.setActivePost.bind(this)}
                />
            )
        })

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
