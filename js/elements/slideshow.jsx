import React from 'react'
import classnames from 'classnames'
import 'whatwg-fetch'

import SVG from './svg.jsx'
import Zoom from '../lib/zoom'
import { checkStatus, parseJSON } from '../utils/request'

const SLIDE_ANIM_TIMEOUT = 500

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
        this.state = { posts: [], displayButtons: false, next: null, in: null, current: 0 }
        this.childElements = []
    }

    toggleZoom (e) {
        if (['svg', 'path'].indexOf(e.target.tagName) > -1) {
            return
        }

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
        this.setState({
            out: this.state.current,
            in: (this.childElements.length + ((this.state.current - 1) % this.childElements.length)) % this.childElements.length
        })
        setTimeout(() => {
            this.setState({
                out: null,
                in: null,
                current: this.state.in
            })
        }, SLIDE_ANIM_TIMEOUT)
    }

    next (e) {
        this.setState({
            out: this.state.current,
            in: (this.childElements.length + ((this.state.current + 1) % this.childElements.length)) % this.childElements.length
        })
        setTimeout(() => {
            this.setState({
                out: null,
                in: null,
                current: this.state.in
            })
        }, SLIDE_ANIM_TIMEOUT)
    }

    render () {
        const itemClasses = classnames(
            { visible: this.props.isVisible || this.props.isActive },
            { active: this.props.isActive },
            'item'
        )

        const posts = this.state.posts.slice()
        posts.unshift({
            file: this.props.post._embedded['wp:featuredmedia'][0].source_url.slice(8),
            image_meta: { title: this.props.post.title.rendered },
            type: 'image'
        })

        this.childElements = posts.map((post, i) => {
            let postContent
            const classNames = ['slide', post.type]
            let direction = this.state.in > this.state.out

            if (Math.abs(this.state.in - this.state.out) !== 1) {
                direction = !direction
            }

            if (i === this.state.current) {
                classNames.push('visible')
            }
            if (i === this.state.out || i === this.state.in) {
                classNames.push('slide' + (direction ? 'Left' : 'Right'))
            }

            switch (post.type) {
            case 'image':
                postContent = <img src={`/assets/${post.file}`} title={post.image_meta.title} />
                break
            default:
                postContent = post.content
            }

            return (
                <a className={classnames(classNames)} href={`#!/${this.props.post.slug}`} key={i}>
                    {postContent}
                </a>
            )
        })

        return (
            <article className={itemClasses} key={this.props.post.id} onClick={this.toggleZoom.bind(this)}>
                {(() => {
                    if (this.childElements.length > 1) {
                        return (
                            <button className={'left'} onClick={this.prev.bind(this)}>
                                <SVG name={'arrow_left'} />
                            </button>
                        )
                    }
                })()}

                <div className={'content'}>
                    {this.childElements}
                </div>

                {(() => {
                    if (this.childElements.length > 1) {
                        return (
                            <button className={'right'} onClick={this.next.bind(this)}>
                                <SVG name={'arrow_right'} />
                            </button>
                        )
                    }
                })()}
            </article>
        )
    }
}
