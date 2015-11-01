import React from 'react'
import ReactDOM from 'react-dom'
import SplashScreen from './elements/splash.jsx'

class App extends React.Component {
    get displayName () {
        return 'App'
    }

    render () {
        return <SplashScreen />
    }
}

const APP_NODE = document.getElementById('app')
ReactDOM.render(<App />, APP_NODE)
