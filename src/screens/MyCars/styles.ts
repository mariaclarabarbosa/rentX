import { FlatList, FlatListProps } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import { CarProps } from '.';

export const Container = styled.View`
    flex: 1;
    align-items: center;
    background-color: ${({theme}) => theme.colors.background_primary};
`;

export const Header = styled.View`
   width: 100%;
   height: 325px;
    
   background-color: ${({theme}) => theme.colors.header};

   justify-content: center;

   padding: ${getStatusBarHeight() + 32}px 25px 25px;
`

export const Title = styled.Text`
   font-family: ${({theme}) => theme.fonts.secondary_600};
   font-size: ${RFValue(34)}px;
   color: ${({theme}) => theme.colors.shape};

   margin-top: 24px;
`;

export const Subtitle = styled.Text`
    font-family: ${({theme}) => theme.fonts.secondary_400};
    font-size: ${RFValue(15)}px;
    color: ${({theme}) => theme.colors.shape};

    margin-top: 24px;
`;

export const Content = styled.View`
    flex: 1;
    width: 100%;
    padding: 0 16px;
`;

export const Appointments = styled.View`
    width: 100%;

    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    padding: 24px 0;
`;

export const AppointmentsTitle = styled.Text`
    font-family: ${({theme}) => theme.fonts.primary_400};
    font-size: ${RFValue(15)}px;
    color: ${({theme}) => theme.colors.text};
`;

export const AppointmentsQuantity = styled.Text`
    font-family: ${({theme}) => theme.fonts.primary_500};
    font-size: ${RFValue(15)}px;
    color: ${({theme}) => theme.colors.title};
`;

export const CarList = styled(
    FlatList as new (props: FlatListProps<CarProps>) => FlatList<CarProps>
).attrs({
    contentContainerStyle: {
        paddingVertical: 24,
    }
})``;

export const CarWrapper = styled.View`
    margin-bottom: 16px;
`;

export const CarFooter = styled.View`
    width: 100%;
    padding: 12px;

    margin-top: -10px;

    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    background-color: ${({theme}) => theme.colors.background_secondary};
`;

export const CarFooterTitle = styled.Text`
    font-family: ${({theme}) => theme.fonts.secondary_500};
    font-size: ${RFValue(10)}px;
    color: ${({theme}) => theme.colors.text_detail};

    text-transform: uppercase;
`;

export const CarFooterPeriod = styled.View`
    flex-direction: row;
`;

export const CarFooterDate = styled.Text`
    font-family: ${({theme}) => theme.fonts.primary_400};
    font-size: ${RFValue(13)}px;
    color: ${({theme}) => theme.colors.title};
`;

