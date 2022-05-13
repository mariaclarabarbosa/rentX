import React, { useState } from 'react';
import { useTheme } from 'styled-components';
import { BackButton } from '../../components/BackButton';
import { useNavigation, useRoute } from '@react-navigation/native';

import ArrowSvg from '../../assets/svg/arrow.svg';

import {
    Container,
    Header,
    Title,
    RentalPeriod,
    DateInfo,
    DateTile,
    DateValue,
    Content,
    Footer,
} from './styles';
import { StatusBar } from 'react-native';
import { Button } from '../../components/Button';
import { Calendar, DayProps, generateInterval, MarkedDatesProps } from '../../components/Calendar';
import { getPlatformDate } from '../../utils/getPlatformDate';
import { format } from 'date-fns';
import { CarDTO } from '../../dtos/CarDTO';

interface RentalPeriod {
    startFormatted: string;
    endFormatted: string;
};

interface Params {
    car: CarDTO;
}

export function Scheduling(){
    const [lastSelectedDate, setLastSelectedDate] = useState<DayProps>({} as DayProps);
    const [markedDates, setMarkedDates] = useState<MarkedDatesProps>({} as MarkedDatesProps);
    const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod);
    const theme = useTheme();
    const navigation = useNavigation();
    const route = useRoute();
    const { car } = route.params as Params;

    function handleSchedulingDetails() {
        navigation.navigate('SchedulingDetails', {
            car,
            dates: Object.keys(markedDates),
        });
    };

    function handleChangeDate(date: DayProps) {
        let start = !lastSelectedDate.timestamp ? date : lastSelectedDate;
        let end = date;

        if (start.timestamp > end.timestamp){
            start = end;
            end = start;
        }

        setLastSelectedDate(end);

        const interval = generateInterval(start, end);
        setMarkedDates(interval);

        const firstDate = Object.keys(interval)[0];
        const endDate = Object.keys(interval)[Object.keys(interval).length - 1]; 
        setRentalPeriod({
            startFormatted: format(getPlatformDate(new Date(firstDate)), 'dd/MM/yyyy'),
            endFormatted: format(getPlatformDate(new Date(endDate)), 'dd/MM/yyyy'),
        });
    };

    return (
        <Container>
           <StatusBar 
               barStyle='light-content'
               translucent
               backgroundColor='transparent'
           />
           <Header>
              <BackButton 
                  onPress={() => {}}
                  color={theme.colors.shape}
               />
              <Title>
                  Escolha uma {'\n'}
                  data de início e {'\n'}
                  fim do aluguel
              </Title>
              <RentalPeriod>
                    <DateInfo>
                        <DateTile>DE</DateTile>
                        <DateValue selected={!!rentalPeriod?.startFormatted}>
                            {rentalPeriod?.startFormatted}
                        </DateValue>
                    </DateInfo>

                    <ArrowSvg />

                    <DateInfo>
                        <DateTile>ATÉ</DateTile>
                        <DateValue selected={!!rentalPeriod?.endFormatted}>
                            {rentalPeriod?.endFormatted}
                        </DateValue>
                    </DateInfo>
              </RentalPeriod>
           </Header>

           <Content>
                <Calendar
                    markedDates={markedDates}
                    onDayPress={handleChangeDate}
                />
           </Content>

           <Footer>
                <Button 
                    title='Confirmar'
                    onPress={handleSchedulingDetails}
                    disabled={!rentalPeriod.endFormatted}
                />
            </Footer>
        </Container>
    );
}