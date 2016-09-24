import React from 'react'
import classnames from 'classnames'
import 'whatwg-fetch'

import SVG from './svg.jsx'
import Zoom from '../lib/zoom'
import { checkStatus, parseJSON } from '../utils/request'

export default class Slideshow extends React.Component {
    get displayName () {
        return 'Slideshow'
    }

    static propTypes () {
        return {
            post: React.PropTypes.object.isRequired,
            isActive: React.propTypes.bool.isRequired,
            isVisible: React.propTypes.bool.isRequired,
            setActivePost: React.PropTypes.func.isRequired
        }
    }

    constructor (props) {
        super(props)
        this.zoom = new Zoom()
        this.url = `/wp-json/makes/v1/fields/${this.props.post.id}`
        this.state = { posts: [], displayButtons: false }
    }

    toggleZoom (e) {
        this.props.setActivePost(!this.props.isActive ? this.props.post.id : null)
        this.zoom.to({ element: e.target }).then((hasZoomedOut) => {
            if (!hasZoomedOut) {
                this.setState({ displayButtons: !this.state.displayButtons })
            }

            document.body.parentElement.style.overflow = hasZoomedOut ? 'auto' : 'hidden'
        })

        if (this.state.displayButtons) {
            this.setState({ displayButtons: !this.state.displayButtons })
        }

        /**
         * fetch post data when user zooms in
         * we assert !isActive because we've changed that value before calling this handler
         */
        if (!this.props.isActive && !this.state.posts.length) {
            window.fetch(this.url).then(checkStatus).then(parseJSON).then((res) => {
                this.setState({ posts: res })
            })
        }
    }

    prev (e) {
        e.preventDefault()
        console.log('prev', this.props.post.id)
    }

    next (e) {
        e.preventDefault()
        console.log('next', this.props.post.id)
    }

    render () {
        const itemClasses = classnames(
            { visible: this.props.isVisible || this.props.isActive },
            { active: this.props.isActive },
            'item'
        )

        const childElements = this.state.posts.map((post, i) => {
            let postContent
            switch (post.type) {
            case 'image':
                postContent = <img src={`/assets/${post.file}`} title={post.image_meta.title} />
                break
            default:
                postContent = post.content
            }

            return (
                <a className={`slide ${post.type}`} href={`#!/${this.props.post.slug}`} key={i}>
                    {postContent}
                </a>
            )
        })

        return (
            <article className={itemClasses} key={this.props.post.id} onClick={this.toggleZoom.bind(this)}>
                <button className={'left'} onClick={this.prev.bind(this)}>
                    <SVG name={'arrow_left'} />
                </button>

                <div className={'content'}>
                    <a className={'slide image visible'} href={`#!/${this.props.post.slug}`}>
                        <img alt={this.props.post.title.rendered} src={this.props.post._embedded['wp:featuredmedia'][0].source_url} title={this.props.post.title.rendered}></img>
                    </a>
                    {childElements}
                </div>

                <button className={'right'} onClick={this.prev.bind(this)}>
                    <SVG name={'arrow_right'} />
                </button>
            </article>
        )
    }
}
