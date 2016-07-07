import React from 'react'

import Zoom from '../lib/zoom'

class Slideshow extends React.Component {
    get displayName () {
        return 'Slideshow'
    }

    static propTypes () {
        return { post: React.PropTypes.object.isRequired }
    }

    constructor (props) {
        super(props)
        this.zoom = new Zoom()
    }

    toggleZoom (e) {
        this.zoom.to({ element: e.target })
    }

    render () {
        return (
            <article className="item" key={this.props.post.ID} onClick={this.toggleZoom.bind(this)}>
                <a href={`#!/${this.props.post.slug}`}>
                    <img alt={this.props.post.title} src={this.props.post.featured_image.source} title={this.props.post.title}></img>
                </a>
            </article>
        )
    }
}

export default Slideshow
