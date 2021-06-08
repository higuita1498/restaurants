import React, {useState} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Input, Button, Icon } from 'react-native-elements'
import { size } from 'lodash'
import {useNavigation} from '@react-navigation/native'

//Imports de mis propias librerias
import { validateEmail } from '../../utils/helpers'
import {addDocumentWithtId, getCurrentUser, getToken, registerUser} from '../../utils/actions'
import Loading from '../Loading'

export default function RegisterForm() {

    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState(defaultFormValues())
    const [errorEmail, setErrorEmail] = useState("")
    const [errorPassword, setErrorPassword] = useState("")
    const [errorConfirm, setErrorConfirm] = useState("")
    const [loading, setLoading] = useState(false)
    
    const navigation = useNavigation()

    const onChange = (e, type) => {
        //colocandole [] decimos que el type es dinamico.
        setFormData({...formData, [type]:e.nativeEvent.text})
    }

    const doRegisterUser = async() => {
        if(!validateData()){
            return
        }
        setLoading(true)
        const result = await registerUser(formData.email, formData.password)
        if(!result.statusRepsonse){
            setLoading(false)
            setErrorEmail(result.error)
            return
        }
        
        const token = await getToken()
        const resultUser = await addDocumentWithtId("users",{token}, getCurrentUser().uid)

        if(!resultUser.statusResponse){
            setLoading(false)
            setErrorEmail(result.error)
            return
        }

        setLoading(false)

        navigation.navigate("account")
    }

    const validateData = () => {
        setErrorEmail("")
        setErrorPassword("")
        setErrorConfirm("")
        let isValid = true

        if(!validateEmail(formData.email))
        {
            setErrorEmail("Debes ingresar un email valido")
            isValid = false
        }

        if(size(formData.password) < 6){
            setErrorPassword("Debes ingresar una contraseña de al menos 6 caracteres")
            isValid = false
        }

        if(size(formData.password) < 6){
            setErrorPassword("Debes ingresar una confirmación de contraseña de al menos 6 caracteres")
            isValid = false
        }

        if(formData.password != formData.confirm){
            setErrorPassword("La contraseña y la confirmacion no son iguales")
            setErrorConfirm("La contraseña y la confirmacion no son iguales")
            isValid = false
        }
        return isValid
    }
    
    return (
        <View style={styles.form}>
            <Input 
                containerStyle={styles.input}
                placeholder="Ingresa tu email..."
                onChange={(e)=> onChange(e,"email")}
                keyboardType="email-address"
                errorMessage={errorEmail}
                defaultValue = {formData.email}
            />
            <Input 
                containerStyle={styles.input}
                placeholder="Ingresa tu contraseña..."
                paassword={true}
                secureTextEntry={!showPassword}
                onChange={(e)=> onChange(e,"password")}
                errorMessage={errorPassword}
                defaultValue = {formData.password}
                rightIcon={
                    <Icon
                    type="material-community"
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    iconStyle={styles.icon}
                    onPress={()=> setShowPassword(!showPassword)} 
                    />
                }
            />
            <Input 
                containerStyle={styles.input}
                placeholder="Confirma tu contraseña..."
                paassword={true}
                secureTextEntry={!showPassword}
                onChange={(e)=> onChange(e,"confirm")}
                errorMessage={errorConfirm}
                defaultValue = {formData.confirm}
                rightIcon={
                <Icon
                    type="material-community"
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    iconStyle={styles.icon}
                    onPress={()=> setShowPassword(!showPassword)} 
                />
                }
            />
            <Button
                title="Registrar nuevo usuario"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn} 
                onPress={()=>doRegisterUser()}            
            />
            <Loading
                isVisible={loading} text="Creando Cuenta..."
            />
        </View>
    )
}

 // Lo hacemos así para llamarlo varias veces
 const defaultFormValues = () => {
    return {
        email:"",
        password:"",
        confirm:""
    }
}

const styles = StyleSheet.create({
    form:{
        marginTop: 30
    },
    input: {
        width: '100%'
    },
    btnContainer:{
        marginTop: 20,
        width: '95%',
        alignSelf: "center"
    },
    btn:{
        backgroundColor:"#442484"
    },
    icon: {
        color:"#c1c1c1"
    }
})
