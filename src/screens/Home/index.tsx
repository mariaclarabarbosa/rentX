import React, { useEffect, useState } from 'react';
import { StatusBar, Alert } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { useNetInfo } from '@react-native-community/netinfo';

import { synchronize } from '@nozbe/watermelondb/sync';
import { database } from '../../database';
import { Car as ModelCar } from '../../database/model/Car';

import Logo from '../../assets/svg/logo.svg';
import { Car } from '../../components/Car';
import { api } from '../../services/api';

import {
    Container,
    Header,
    HeaderContent,
    TotalCars,
    CarList,
} from './styles';
import { LoadAnimation } from '../../components/LoadAnimation';

export function Home(){
    const navigation = useNavigation();
    const [cars, setCars] = useState<ModelCar[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const netInfo = useNetInfo();

    function handleCarDetails(car: ModelCar) {
        navigation.navigate('CarDatails', { car });
    };

    async function offlineSynchronize() {
        await synchronize({
            database,
            pullChanges: async ({ lastPulledAt }) => {
                const response = await api
                .get(`/cars/sync/pull?lastPulledVersion=${lastPulledAt || 0}`);
                const { changes, latestVersion } = response.data;
                return { changes, timestamp: latestVersion };
            },
            pushChanges: async ({ changes }) => {
                const user = changes.users;
                await api.post('/users/sync', user);
            },
        });
    }

    useEffect(() => {
        let isMounted = true;
        async function fetchCars(){
            try {            
                const carCollections = database.get<ModelCar>('cars');
                const cars = await carCollections.query().fetch();
                if (isMounted) {
                    setCars(cars);
                }
            } catch (error) {
                return Alert.alert('Não foi possível recuperar a listagem de carros');
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };
        fetchCars();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (netInfo.isConnected === true) {
            offlineSynchronize();
        }
    }, [netInfo.isConnected])

    return (
        <Container>
            <StatusBar
                barStyle='light-content' 
                backgroundColor='transparent'
                translucent
            />
            <Header>
                <HeaderContent>
                    <Logo 
                        width={RFValue(108)} 
                        height={RFValue(12)}
                    />
                    {
                        !isLoading && (
                            <TotalCars>
                                Total de {cars.length} carros
                            </TotalCars>
                        )
                    }
                </HeaderContent>
            </Header>
            {
                isLoading ? <LoadAnimation />
                : (
                    <CarList
                        data={cars}
                        keyExtractor={(item: ModelCar) => item.id}
                        renderItem={({ item }: { item: ModelCar}) => 
                            <Car 
                                data={item} 
                                onPress={() => handleCarDetails(item)}
                            />
                        }
                    />
                )
            }
        </Container>
    );
};
