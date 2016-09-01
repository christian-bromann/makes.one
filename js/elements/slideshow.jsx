import React from 'react'
import classnames from 'classnames'

import Zoom from '../lib/zoom'

class Slideshow extends React.Component {
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
    }

    toggleZoom (e) {
        this.props.setActivePost(this.props.post.id)
        this.zoom.to({ element: e.target }).then(() => {
            this.props.setActivePost(null)
        })

        /**
         * fetch post data when user zooms in
         */
        if (!this.props.isActive) {
            return
        }
    }

    render () {
        let classes = classnames({visible: this.props.isVisible || this.props.isActive}, 'item')

        return (
            <article className={classes} key={this.props.post.id} onClick={this.toggleZoom.bind(this)}>
                <a href={`#!/${this.props.post.slug}`}>
                    <img alt={this.props.post.title} src={this.props.post._embedded['wp:featuredmedia'][0].source_url} title={this.props.post.title}></img>
                </a>
            </article>
        )
    }
}

export default Slideshow
