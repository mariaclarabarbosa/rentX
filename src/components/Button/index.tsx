import React from 'react';
import { TouchableOpacityProps, ActivityIndicator } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';

import {
    Container,
    Title,
} from './styles';

interface Props extends TouchableOpacityProps {
   title: string;
   color?: string;
   loading?: boolean;
   light?: boolean;
}

export function Button({
   title,
   color,
   disabled = false,
   loading = false,
   light = false,
   ...rest
}: Props){
    const theme = useTheme();
    return (
        <Container 
            {...rest}
            color={color}
            disabled={disabled}
            style={{ opacity: disabled || loading ? 0.5 : 1 }}
        >
            {
                loading 
                ?   <ActivityIndicator
                        color={theme.colors.shape}
                        size={RFValue(22)}
                    />
                : <Title light={light}>{title}</Title>
            }
        </Container>
    );
}