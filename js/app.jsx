import React from 'react'
import ReactDOM from 'react-dom'

/**
 * elements
 */
// import SplashScreen from './elements/splash.jsx'
import ImageWall from './elements/image_wall.jsx'

class App extends React.Component {
    get displayName () {
        return 'App'
    }

    render () {
        return <ImageWall />
    }
}

const APP_NODE = document.getElementById('app')
ReactDOM.render(<App />, APP_NODE)
