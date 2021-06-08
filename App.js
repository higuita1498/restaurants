import React, {useEffect, useRef} from 'react'
import Navigation from './navigations/Navigation'
import {LogBox} from 'react-native'

import { startNotifications } from './utils/actions'

//Pasaba cuando se hacia una demoracion que se demoraba mucho
LogBox.ignoreAllLogs()

export default function App() { 
    const notificationListener = useRef()
    const responseListener = useRef()

    //manera de arrancar las notifiaciones.
    useEffect(() => {
      startNotifications(notificationListener, responseListener)
    }, [])

    return (
      <Navigation />
    );
}
