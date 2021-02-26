import React, { useState, useEffect } from 'react'
import { StyleSheet } from 'react-native'
import { isUserLogged } from '../../utils/actions'


import UserGuest from './UserGuest'
import UserLogged from './UserLogged'
import firebase from 'firebase/app'
import Loading from '../../components/Loading'


export default function Account() {

    //significa que el usuario no estará logueado
    const [login, setLogin] = useState(null)


    //Usamos esta variable para al cargar la panatlla saber si el usuario esta logueado
    useEffect(() => {
            setLogin(isUserLogged())
    }, [])

    if(login == null){
        return <Loading isVisible={true} text="Cargando..." />
    }

    return login ? <UserLogged/> : <UserGuest/>
}

const styles = StyleSheet.create({})
