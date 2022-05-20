import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Accessory } from '../../components/Accessory';
import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';

import {
    Container,
    Header,
    CarImages,
    Content,
    Details,
    Description,
    Brand,
    Name,
    Rent,
    Period,
    Price,
    Accessories,
    Footer,
    RentalPeriod,
    CalendarIcon,
    DateInfo,
    DateTitle,
    DateValue,
    RentalPrice,
    RentalPriceLabel,
    RentalPriceDetails,
    RentalPriceQuota,
    RentalPriceTotal,
} from './styles';
import { Button } from '../../components/Button';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CarDTO } from '../../dtos/CarDTO';
import { getAccessoryIcon } from '../../utils/getAccessoryIcon';
import { api } from '../../services/api';
import { format } from 'date-fns';
import { getPlatformDate } from '../../utils/getPlatformDate';
import { useAuth } from '../../hooks/auth';

interface Params {
    car: CarDTO;
    dates: string[];
}

interface RentalPeriod {
    start: string;
    end: string;
}

export function SchedulingDetails(){
    const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod);
    const [loading, setLoading] = useState(false);
    const theme = useTheme();
    const navigation = useNavigation();
    const route = useRoute();
    const { car, dates } = route.params as Params;
    const { user } = useAuth();

    const rentTotal = Number(dates.length * car.price);

    async function handleConfirmRental() {
        try {
            setLoading(true);
           
            await api.post('/rentals', {
                user_id: user.user_id,
                car_id: car.id,
                start_date: new Date(dates[0]),
                end_date: new Date(dates[dates.length - 1]),
                total: rentTotal,
            });

            navigation.navigate('Confirmation', {
                title: 'Carro Alugado!',
                message: `Agora você só precisa ir\naté a concessionária da RENTX\npegar o seu automóvel.`,
                nextScreenRoute: 'Home'
            });
        } catch (error) {
            Alert.alert('Não foi possível confirmar o agendamento.')
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setRentalPeriod({
            start: format(getPlatformDate(new Date(dates[0])), 'dd/MM/yyyy'),
            end: format(getPlatformDate(new Date(dates[dates.length - 1])), 'dd/MM/yyyy'),
        })
    }, []);
    
    return (
        <Container>
            <Header>
                <BackButton />
            </Header>
            <CarImages>
                <ImageSlider
                    imagesUrl={car.photos}
                />
            </CarImages>
            <Content>
                <Details>
                    <Description>
                        <Brand>{car.brand}</Brand>
                        <Name>{car.name}</Name>
                    </Description>
                    <Rent>
                        <Period>{car.period}</Period>
                        <Price>R$ {car.price}</Price>
                    </Rent>
                </Details>

                <Accessories>
                    {
                        car.accessories.map(accessory => (
                            <Accessory
                                key={accessory.type}
                                name={accessory.name}
                                icon={getAccessoryIcon(accessory.type)}
                            />
                        ))
                    }
                </Accessories>

                <RentalPeriod>
                    <CalendarIcon>
                        <Feather 
                            name='calendar'
                            size={RFValue(24)}
                            color={theme.colors.shape}
                        />
                    </CalendarIcon>
                    <DateInfo>
                        <DateTitle>DE</DateTitle>
                        <DateValue>{rentalPeriod.start}</DateValue>
                    </DateInfo>
                    <Feather 
                        name='chevron-right'
                        size={RFValue(10)}
                        color={theme.colors.text}
                    />
                    <DateInfo>
                        <DateTitle>ATÉ</DateTitle>
                        <DateValue>{rentalPeriod.end}</DateValue>
                    </DateInfo>
                </RentalPeriod>

                <RentalPrice>
                    <RentalPriceLabel>TOTAL</RentalPriceLabel>
                    <RentalPriceDetails>
                        <RentalPriceQuota>R$ {car.price} x{dates.length} diárias</RentalPriceQuota>
                        <RentalPriceTotal>R$ {rentTotal}</RentalPriceTotal>
                    </RentalPriceDetails>
                </RentalPrice>

            </Content>

            <Footer>
                <Button 
                    title='Alugar Agora' 
                    color={theme.colors.success} 
                    onPress={handleConfirmRental}
                    loading={loading}
                    disabled={loading}
                />
            </Footer>

        </Container>
    );
}