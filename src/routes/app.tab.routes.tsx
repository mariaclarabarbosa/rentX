import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MyCars } from '../screens/MyCars';
import { AppStackRoutes } from './app.stack.routes';

import ProfileSVG from '../assets/svg/people.svg';
import CarSVG from '../assets/svg/car.svg';
import HomeSVG from '../assets/svg/home.svg';
import { useTheme } from 'styled-components';
import { Platform } from 'react-native';
import { Profile } from '../screens/Profile';

const Tab = createBottomTabNavigator();

export function AppTabRoutes() {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.main,
        tabBarInactiveTintColor: theme.colors.text_detail,
        tabBarShowLabel: false,
        tabBarStyle: {
          paddingVertical: Platform.OS === 'ios' ? 20 : 0,
          height: 78,
          backgroundColor: theme.colors.background_primary,
        },
      }}
      initialRouteName='Home'
    >
      <Tab.Screen 
        name="Home" 
        component={AppStackRoutes} 
        options={{
          tabBarIcon: (({ color }) => (
            <HomeSVG 
              width={24} 
              height={24} 
              fill={color}
            />
          ))
        }}
      />
      <Tab.Screen 
        name="MyCars" 
        component={MyCars} 
        options={{
          tabBarIcon: (({ color }) => (
            <CarSVG 
              width={24} 
              height={24} 
              fill={color}
            />
          ))
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile} 
        options={{
          tabBarIcon: (({ color }) => (
            <ProfileSVG 
              width={24} 
              height={24} 
              fill={color}
            />
          ))
        }}
      />
    </Tab.Navigator>
  );
}