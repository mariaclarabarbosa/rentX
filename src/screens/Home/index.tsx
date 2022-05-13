import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';

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
import { CarDTO } from '../../dtos/CarDTO';
import { LoadAnimation } from '../../components/LoadAnimation';

export function Home(){
    const navigation = useNavigation();
    const [cars, setCars] = useState<CarDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    function handleCarDetails(car: CarDTO) {
        navigation.navigate('CarDatails', { car });
    };

    useEffect(() => {
        let isMounted = true;
        async function fetchCars(){
            try {            
                const response = await api.get('/cars');
                if (isMounted) {
                    setCars(response.data);
                }
            } catch (error) {
                console.log(error);
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
    }, [])

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
                        keyExtractor={(item: CarDTO) => item.id}
                        renderItem={({ item }: { item: CarDTO}) => 
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
