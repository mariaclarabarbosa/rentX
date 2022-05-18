import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { useAuth } from '../hooks/auth';
import { AuthRoute } from './auth.routes';
import { AppTabRoutes } from './app.tab.routes';
import { LoadAnimation } from '../components/LoadAnimation';

export function Routes(){
    const { user, loading } = useAuth();
    return (
        loading ? <LoadAnimation /> : 
        <NavigationContainer>
           {user.id ? <AppTabRoutes /> : <AuthRoute />}
        </NavigationContainer>
    );
}