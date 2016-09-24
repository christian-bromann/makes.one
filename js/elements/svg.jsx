import React from 'react'

const ARROW_SIZE = {width: '100%'}
const SVGs = {
    arrow_left: <svg style={ARROW_SIZE} viewBox={'0 0 143.5 127.3'} x={'0px'} y={'0px'}><path d="M0,63.6L63.6,0l14.3,14.6l-38,38.8h103.5v20.5H39.9l38,38.8l-14.3,14.6L0,63.6z"></path></svg>,
    arrow_right: <svg style={ARROW_SIZE} viewBox={'0 0 143.5 127.3'} x={'0px'} y={'0px'}><path d="M79.8,127.3l-14.3-14.6l38-38.8H0V53.4h103.5l-38-38.8L79.8,0l63.6,63.6L79.8,127.3z"></path></svg>
}

export default class SVG extends React.Component {
    get displayName () {
        return 'SVG'
    }

    static propTypes () {
        return {
            name: React.PropTypes.string.isRequired
        }
    }

    constructor (props) {
        super(props)
    }

    render () {
        return SVGs[this.props.name]
    }
}
