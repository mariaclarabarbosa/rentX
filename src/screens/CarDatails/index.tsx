import React, { useEffect, useState } from 'react';
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    interpolate,
    Extrapolate,
 } from 'react-native-reanimated';
import { Accessory } from '../../components/Accessory';
import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';

import {
    Container,
    Header,
    CarImages,
    Details,
    Description,
    Brand,
    Name,
    Rent,
    Period,
    Price,
    About,
    Accessories,
    Footer,
    OfflineInfo,
} from './styles';
import { Button } from '../../components/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CarDTO } from '../../dtos/CarDTO';
import { Car as ModelCar } from '../../database/model/Car';
import { getAccessoryIcon } from '../../utils/getAccessoryIcon';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { useTheme } from 'styled-components/native';
import { api } from '../../services/api';
import { useNetInfo } from '@react-native-community/netinfo';
import { LoadAnimation } from '../../components/LoadAnimation';

interface Params {
    car: ModelCar;
}

export function CarDatails() {
    const [carUpdate, setCarUpdate] = useState<CarDTO>({} as CarDTO);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const route = useRoute();
    const theme = useTheme();
    const { car } = route.params as Params;
    const netInfo = useNetInfo();

    const scrollY = useSharedValue(0);
    const scrollHendler = useAnimatedScrollHandler(event => {
        scrollY.value = event.contentOffset.y;
    });

    const headerStyleAnimation = useAnimatedStyle(() => {
        return {
            height: interpolate(
                scrollY.value,
                [0, 200],
                [200, 80],
                Extrapolate.CLAMP,
            ),
        };
    });

    const sliderCarsStyleAnimation = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                scrollY.value,
                [0, 150],
                [1, 0],
                Extrapolate.CLAMP,
            ),
        };
    });

    function handleScheduling() {
        navigation.navigate('Scheduling', { car: carUpdate });
    };

    useEffect(() => {
        async function fetchOnlineData() {
          try {
            const response = await api.get(`cars/${car.id}`);
            setCarUpdate(response.data);
          } catch (error) {
            console.log(error)
          } finally {
            setLoading(false);
          }
        }
    
        fetchOnlineData();
      },[netInfo.isConnected]);

    if (loading) {
        return <LoadAnimation />;
    }

    return (
        <Container>
            <Animated.View style={headerStyleAnimation}>
                <Header>
                    <BackButton />
                </Header>
                <Animated.View style={sliderCarsStyleAnimation}>
                    <CarImages>
                        <ImageSlider
                            imagesUrl={
                                !!carUpdate.photos ? 
                                carUpdate.photos : [{ id: car.thumbnail, photo: car.thumbnail }]
                            }
                        />
                    </CarImages>
                </Animated.View>
            </Animated.View>
            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                onScroll={scrollHendler}
                scrollEventThrottle={16}
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    alignItems: 'center',
                    paddingTop: getStatusBarHeight(),
                    backgroundColor: theme.colors.background_secondary,
                }}
            >
                <Details>
                    <Description>
                        <Brand>{car.brand}</Brand>
                        <Name>{car.name}</Name>
                    </Description>
                    <Rent>
                        <Period>{car.period}</Period>
                        <Price>R$ {netInfo.isConnected === true ? car.price : '...'}</Price>
                    </Rent>
                </Details>

                <Accessories>
                    {
                        carUpdate.accessories ?
                        carUpdate.accessories.map(accessory => (
                            <Accessory
                                key={accessory.type}
                                name={accessory.name}
                                icon={getAccessoryIcon(accessory.type)}
                            />
                        )) : null
                    }
                </Accessories>

                <About>
                    {car.about}
                </About>
            </Animated.ScrollView>

            <Footer>
                <Button 
                    title='Escolher período do aluguel' 
                    onPress={handleScheduling}
                    disabled={netInfo.isConnected === false}
                />
                {
                    netInfo.isConnected === false &&
                    <OfflineInfo>
                        Conecte-se a internet para ver mais detalhes e dar prosseguimento ao agendamento.
                    </OfflineInfo>
                }
            </Footer>

        </Container>
    );
}