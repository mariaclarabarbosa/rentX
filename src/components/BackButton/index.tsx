import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'styled-components';
import { useNavigation } from '@react-navigation/native';

import {
    Container,
    Icon,
} from './styles';
import { TouchableOpacityProps } from 'react-native';

interface Props extends TouchableOpacityProps {
    color?: string;
}

export function BackButton({ color, ...rest }: Props) {
    const theme = useTheme();
    const navigation = useNavigation();

    function handleGoBack() {
        navigation.goBack();
    };

    return (
        <Container {...rest} onPress={handleGoBack}>
            <Icon 
                name='chevron-left' 
                size={24} 
                color={color ? color : theme.colors.text} 
            />
        </Container>
    );
}