import React from 'react'

import Navigation from './navigations/Navigation'
import {LogBox} from 'react-native'

//Pasaba cuando se hacia una demoracion que se demoraba mucho
LogBox.ignoreAllLogs()

export default function App() { 
  return (
    <Navigation />
  );
}
