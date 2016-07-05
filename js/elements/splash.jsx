import React from 'react'
import classnames from 'classnames'

class SplashScreen extends React.Component {
    get displayName () {
        return 'SplashScreen'
    }

    constructor (props) {
        super(props)
        this.state = { loaded: false, ready: false }
    }

    componentDidMount () {
        setTimeout(() => this.setState({loaded: true}), 5000)
    }

    render () {
        let classes = classnames({loaded: this.state.loaded, ready: this.state.ready})
        return (<div className={classes} id="splashscreen"></div>)
    }
}

export default SplashScreen
