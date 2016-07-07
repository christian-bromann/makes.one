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
        this.props.setActivePost(this.props.post.ID)
        this.zoom.to({ element: e.target }).then(() => {
            this.props.setActivePost(null)
        })
    }

    render () {
        let classes = classnames({visible: this.props.isVisible || this.props.isActive}, 'item')

        return (
            <article className={classes} key={this.props.post.ID} onClick={this.toggleZoom.bind(this)}>
                <a href={`#!/${this.props.post.slug}`}>
                    <img alt={this.props.post.title} src={this.props.post.featured_image.source} title={this.props.post.title}></img>
                </a>
            </article>
        )
    }
}

export default Slideshow
