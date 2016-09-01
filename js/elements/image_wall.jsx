/* global fetch */

import React from 'react'
import Masonry from 'react-masonry-component'
import 'whatwg-fetch'

import Slideshow from './slideshow.jsx'
import { checkStatus, parseJSON } from '../utils/request'

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
        this.url = '/wp-json/wp/v2/posts?_embed=featured_media'
        this.state = { posts: [], activePost: null }
    }

    componentWillMount () {
        fetch(this.url).then(checkStatus).then(parseJSON).then((res) => {
            this.setState({ posts: res })
        })
    }

    setActivePost (id) {
        this.setState({ activePost: id })
    }

    render () {
        const childElements = this.state.posts.map((post) => {
            return (
                <Slideshow
                    isActive={this.state.activePost === post.id}
                    isVisible={this.state.activePost === null}
                    key={post.id}
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
