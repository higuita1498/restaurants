import React from 'react'
import { StyleSheet, Text, ScrollView, Image } from 'react-native'
import  {Button} from 'react-native-elements'

import {useNavigation} from '@react-navigation/native'


export default function UserGuest() {
    const navigation = useNavigation()

    return (
        <ScrollView
            centerContent
            style={styles.viewBody}
        >
            <Image
                source={require("../../assets/logo.png")}
                resizeMode="contain"
                style={styles.image}
            />
            <Text style={styles.title}>Consulta tu perfil en restaurantes</Text>
            <Text style={styles.description}>
                ¿Cómo describirias tu mejor restaurante? Busca y visualiza los mejores restaurantes
                de una forma sencilla y vota cual te ha gustado mas y comenta cual ha sido tu experiencia
            </Text>
            <Button 
                buttonStyle={styles.button}
                title="Ver tu perfil"
                //navigation es una constante que instaciamos y le decimos que vamos a navegar al name="login"
                onPress = {( ) => navigation.navigate("login")}
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    viewBody:{
        marginHorizontal:30
    },
    image:{
        height:300,
        width: "100%",
        marginBottom:10
    },
    title:{
        fontWeight: "bold",
        fontSize: 19,
        marginVertical:10,
        textAlign: "center"
    },
    description:{
        textAlign: "justify",
        marginBottom: 20,
        color: "#a65273"
    },
    button:{
        backgroundColor:"#442484"
    }
})
