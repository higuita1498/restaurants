import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import { Icon } from 'react-native-elements'

import RestaurantsStack from './RestaurantsStack'
import FavoritesStack from './FavoritesStack'
import SearchStack from './SearchStack'
import AccountStack from './AccountStack'
import TopRestaurantsStack from './TopRestaurantsStack'
import Restaurants from '../screens/restaurants/Restaurants'

//lo creamos en mayuscula por que es un componente "Tab"
const Tab = createBottomTabNavigator()

export default function Navigation() {

    //primer parametro es la ruta a la que le vamos a agregar el icono y el segundo es el color de este.
    const screenOptions = (route,color) => {
        let iconName
        switch (route.name) {
            case "restaurants":
                iconName = "compass-outline"
                break;

            case "favorites":
                iconName = "heart-outline"
                break;

            case "top-restaurants":
                iconName = "star-outline"
                break;
                
            case "search":
                iconName = "magnify"
                break;

            case "account":
            iconName = "home-outline"

            case "account2":
            iconName = "home-outline"
            break;
        }

        return (
            <Icon 
                type="material-community"
                name={iconName}
                size={22}
                color={color}
            />
        )
    } 

    return (
        <NavigationContainer>
            <Tab.Navigator
                //Initialroutname significa por cual de todos los tabs va a iniciar
                initialRouteName="restaurants"
                tabBarOptions={{
                    inactiveTintColor: "#a17dc3",
                    activeTintColor: "#442484"
                }}

                screenOptions={({ route }) => ({
                    tabBarIcon: ({color}) => screenOptions(route, color)
                })}
            >
                <Tab.Screen
                    name="restaurants"
                    //Con este componente le indicamos que queremos reenderizar la vista restaurants.js
                    component={RestaurantsStack}
                    options={{title: "Restaurantes"}}
                />
                <Tab.Screen
                    name="favorites"
                    //Con este componente le indicamos que queremos reenderizar la vista restaurants.js
                    component={FavoritesStack}
                    options={{title: "Favoritos"}}
                />
                <Tab.Screen
                    name="top-restaurants"
                    //Con este componente le indicamos que queremos reenderizar la vista restaurants.js
                    component={TopRestaurantsStack}
                    options={{title: "Top 5"}}
                />
                <Tab.Screen
                    name="search"
                    //Con este componente le indicamos que queremos reenderizar la vista restaurants.js
                    component={SearchStack}
                    options={{title: "Buscar"}}
                />
                <Tab.Screen
                    name="account"
                    //Con este componente le indicamos que queremos reenderizar la vista restaurants.js
                    component={AccountStack}
                    options={{title: "Cuenta"}}
                />
                 <Tab.Screen
                    name="account2"
                    //Con este componente le indicamos que queremos reenderizar la vista restaurants.js
                    component={AccountStack}
                    options={{title: "Cuenta2p"}}
                />
            </Tab.Navigator>
        </NavigationContainer>
    )
}
