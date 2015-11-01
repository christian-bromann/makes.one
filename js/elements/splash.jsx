import React from 'react'
import classnames from 'classnames'

class SplashScreen extends React.Component {
    constructor (props) {
        super(props)
        this.state = { loaded: false }
    }

    render () {
        let classes = classnames({loaded: this.state.loaded})
        return <div id="splashscreen" className={classes}></div>
    }

    componentDidMount () {
        console.log('uhuhu')
        setTimeout(() => this.setState({loaded: true}), 1000)
    }
}

export default SplashScreen
