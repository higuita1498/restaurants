import React from 'react'
import { StyleSheet, Text, View, Image} from 'react-native'
import { Divider } from 'react-native-elements'
import {useNavigation} from '@react-navigation/native'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

import LoginForm from '../../components/account/LoginForm'

export default function Login() {
    
    return (
        <KeyboardAwareScrollView>
            <Image 
            source={require("../../assets/logo.png")}
            resizeMode="contain"
            style={styles.image}
            />
            <View style={styles.container}>
                <LoginForm/>
                <CreateAcctount />
                <RecoverPassword />
            </View>
            <Divider style={styles.divider} />
        </KeyboardAwareScrollView>
    )
}

function CreateAcctount(props){
    const navigation = useNavigation()
    return (
        <Text 
        style={styles.register}
        onPress={() => navigation.navigate("register")}
        >
            ¿Aún no tienes una cuenta?{" "}
            <Text style={styles.btnRegister}>Registrate</Text>
        </Text>
    )
}

function RecoverPassword(){
    const navigation = useNavigation()
    return (
        <Text 
            style={styles.register}
            onPress={() => navigation.navigate("recover-password")}
        >
            ¿Olvidaste tu contraseña?{" "}
            <Text style={styles.btnRegister}>   
                Recupérala
            </Text>
        </Text>
    )
}

const styles = StyleSheet.create({
    image:{
        height:150,
        width:"100%",
        marginBottom: 20
    },
    container:{
        marginHorizontal:40
    },
    divider:{
        backgroundColor:"#442484",
        margin:40
    },
    register:{
        marginTop:15,
        marginHorizontal:10,
        alignSelf:"center"
    },
    btnRegister:{
        color:"#442484",
        fontWeight: "bold"
    }
})
