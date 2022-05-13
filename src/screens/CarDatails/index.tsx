import React from 'react';
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
} from './styles';
import { Button } from '../../components/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CarDTO } from '../../dtos/CarDTO';
import { getAccessoryIcon } from '../../utils/getAccessoryIcon';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { useTheme } from 'styled-components/native';

interface Params {
    car: CarDTO;
}

export function CarDatails() {
    const navigation = useNavigation();
    const route = useRoute();
    const theme = useTheme();
    const { car } = route.params as Params;

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
        navigation.navigate('Scheduling', { car });
    };

    return (
        <Container>
            <Animated.View style={headerStyleAnimation}>
                <Header>
                    <BackButton />
                </Header>
                <Animated.View style={sliderCarsStyleAnimation}>
                    <CarImages>
                        <ImageSlider
                            imagesUrl={car.photos}
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

                <About>
                    {car.about}
                </About>
            </Animated.ScrollView>

            <Footer>
                <Button 
                    title='Escolher período do aluguel' 
                    onPress={handleScheduling}
                />
            </Footer>

        </Container>
    );
}