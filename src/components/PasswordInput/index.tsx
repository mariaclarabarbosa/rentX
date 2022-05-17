import React, { useState } from 'react';
import { TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from 'styled-components';

import {
   Container,
   IconContainer,
   InputText,
   ChangePasswordVisibilityButton,
} from './styles';

interface Props extends TextInputProps {
   iconName: React.ComponentProps<typeof Feather>['name'];
   value?: string;
}

export function PasswordInput({
   iconName,
   value,
   ...rest
}: Props){
   const [isPasswordInvisible, setIsPasswordInvisible] = useState(true);
   const [isFocused, setIsFocused] = useState(false);
   const [isFilled, setIsFilled] = useState(false);
   const theme = useTheme();

   function handleChangePasswordVisibility() {
      setIsPasswordInvisible((previous) => !previous);
   };

   function handleInputFocus() {
      setIsFocused(true);
   };

   function handleInputBlur() {
      setIsFocused(false);
      setIsFilled(!!value);
   }

   return (
      <Container>
         <IconContainer isFocused={isFocused}>
            <Feather
               name={iconName}
               color={(isFocused || isFilled) ? theme.colors.main : theme.colors.text_detail}
               size={24}
            />
         </IconContainer>
         <InputText
            {...rest}
            secureTextEntry={isPasswordInvisible}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            isFocused={isFocused}
            autoCorrect={false}
         />
         <ChangePasswordVisibilityButton
            onPress={handleChangePasswordVisibility}
         >
            <IconContainer isFocused={isFocused}>
               <Feather
                  name={isPasswordInvisible ? 'eye' : 'eye-off'}
                  color={theme.colors.text_detail}
                  size={24}
               />
            </IconContainer>
         </ChangePasswordVisibilityButton>
      </Container>
   );
}