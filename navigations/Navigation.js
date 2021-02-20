import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'

import RestaurantsStack from './RestaurantsStack'
import FavoritesStack from './FavoritesStack'
import SearchStack from './SearchStack'
import AccountStack from './AccountStack'
import TopRestaurantsStack from './TopRestaurantsStack'

//lo creamos en mayuscula por que es un componente "Tab"
const Tab = createBottomTabNavigator()

export default function Navigation() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
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
            </Tab.Navigator>
        </NavigationContainer>
    )
}
