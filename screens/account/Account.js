import React, { useState, useEffect,useCallback } from 'react'
import { StyleSheet } from 'react-native'
import { getCurrentUser,isUserLogged } from '../../utils/actions'
import firebase from 'firebase/app'
import Loading from '../../components/Loading'
import { useFocusEffect } from '@react-navigation/native'

import UserGuest from './UserGuest'
import UserLogged from './UserLogged'


export default function Account() {

    //significa que el usuario no estará logueado
    const [login, setLogin] = useState(null)

    useFocusEffect(
        //Cadqa que carguemos esta pantalla nos va a checkar si elusuario esta logueado o on esta logueado
        //importamos useCallback y el useFocusEffect
        useCallback(() => {
            const user = getCurrentUser()
            user ? setLogin(true) : setLogin(false)
        }, [])
    )


   

    if(login == null){
        return <Loading isVisible={true} text="Cargando..." />
    }

    return login ? <UserLogged/> : <UserGuest/>
}

const styles = StyleSheet.create({})
