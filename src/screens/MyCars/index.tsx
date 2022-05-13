import React, { useState, useEffect } from 'react';
import { StatusBar, Alert } from 'react-native';
import { useTheme } from 'styled-components';
import { BackButton } from '../../components/BackButton';
import { Car } from '../../components/Car';
import { CarDTO } from '../../dtos/CarDTO';
import { api } from '../../services/api';
import { AntDesign } from '@expo/vector-icons';

import {
    Container,
    Header,
    Title,
    Subtitle,
    Content,
    Appointments,
    AppointmentsTitle,
    AppointmentsQuantity,
    CarList,
    CarWrapper,
    CarFooter,
    CarFooterTitle,
    CarFooterPeriod,
    CarFooterDate,
} from './styles';
import { LoadAnimation } from '../../components/LoadAnimation';

export interface CarProps {
    id: string;
    user_id: number;
    car: CarDTO;
    startDate: string;
    endDate: string;
}

export function MyCars(){
    const [cars, setCars] = useState<CarProps[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const theme = useTheme();

    useEffect(() => {
        async function fetchCars() {
            try {
                const response = await api.get('/schedules_byuser?user_id=1');
                setCars(response.data);
            } catch (error) {
                Alert.alert('Não foi possível recuperar os carros agendados.')
            } finally {
                setIsLoading(false);
            }
        };
        fetchCars();
    }, []);

    return (
        <Container>
            <StatusBar 
               barStyle='light-content'
               translucent
               backgroundColor='transparent'
            />
            <Header>
                <BackButton 
                    color={theme.colors.shape}
                />
                <Title>
                    Seus agendamentos, {'\n'}
                    estão aqui.
                </Title>
                <Subtitle>Conforto, segurança e praticidade.</Subtitle>
            </Header>

            {
                isLoading ? <LoadAnimation />
                : <Content>
                    <Appointments>
                        <AppointmentsTitle>Agendamentos Feitos</AppointmentsTitle>
                        <AppointmentsQuantity>{cars.length}</AppointmentsQuantity>
                    </Appointments>

                    <CarList
                        data={cars}
                        keyExtractor={(item: CarProps) => item.id}
                        renderItem={({ item }: { item: CarProps}) => (
                            <CarWrapper>
                                <Car 
                                    data={item.car} 
                                />
                                <CarFooter>
                                    <CarFooterTitle>Período</CarFooterTitle>
                                    <CarFooterPeriod>
                                        <CarFooterDate>{item.startDate}</CarFooterDate>
                                        <AntDesign 
                                            name='arrowright'
                                            size={20}
                                            color={theme.colors.title}
                                            style={{ marginHorizontal: 10 }}
                                        />
                                        <CarFooterDate>{item.endDate}</CarFooterDate>
                                    </CarFooterPeriod>
                                </CarFooter>
                            </CarWrapper>
                        )}
                        showsVerticalScrollIndicator={false}
                    />
                </Content>

            }
            
        </Container>
    );
};