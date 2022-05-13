import { TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

interface ContainerProps {
   color?: string;
}

interface TitleProps {
   light?: boolean;
}

export const Container = styled(TouchableOpacity)<ContainerProps>`
   width: 100%;

   padding: 19px;
   justify-content: center;
   align-items: center;

   background-color: ${({ theme, color }) => 
      color ? color : theme.colors.main
   };

   margin-bottom: 8px;
`;

export const Title = styled.Text<TitleProps>`
   font-family: ${({ theme }) => theme.fonts.primary_500};
   font-size: ${RFValue(15)}px;
   color: ${({ theme, light }) =>
      light ? theme.colors.header : theme.colors.background_secondary
   };
`;