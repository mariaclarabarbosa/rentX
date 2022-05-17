import React, { useState } from 'react';
import { useTheme } from 'styled-components';
import { BackButton } from '../../components/BackButton';
import { Feather } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import * as ImagePicker from 'expo-image-picker';

import {
   Container,
   Header,
   HeaderTop,
   HeaderTitle,
   LogoutButton,
   PhotoContainer,
   Photo,
   PhotoButton,
   Content,
   Options,
   Option,
   OptionTitle,
   Section,
} from './styles';
import { 
   Keyboard, 
   KeyboardAvoidingView, 
   StatusBar, 
   TouchableWithoutFeedback,  
} from 'react-native';
import { Input } from '../../components/Input';
import { PasswordInput } from '../../components/PasswordInput';
import { useAuth } from '../../hooks/auth';

export function Profile(){
   const { user, signOut } = useAuth();
   const [option, setOption] = useState<'dataEdit' | 'passwordEdit'>('dataEdit');
   const [name, setName] = useState('');
   const [driverLicense, setDriverLicense] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [avatar, setAvatar] = useState(user.avatar);
   const theme = useTheme();

   function handleOptionChange(optionSelected: 'dataEdit' | 'passwordEdit') {
      setOption(optionSelected);
   }

   async function handleAvatarSelect() {
      const result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.Images,
         allowsEditing: true,
         aspect: [4, 3],
         quality: 1,
      });

      if (!result.cancelled && result.uri) {
         setAvatar(result.uri);
      }
   }

   return (
      <KeyboardAvoidingView behavior='position' enabled>
         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container>
               <StatusBar 
                  barStyle='light-content'
                  translucent
                  backgroundColor='transparent'
               />
               <Header>
                  <HeaderTop>
                     <BackButton color={theme.colors.shape} />
                     <HeaderTitle>Editar Perfil</HeaderTitle>
                     <LogoutButton onPress={signOut} >
                        <Feather
                           name='power'
                           size={24}
                           color={theme.colors.shape}
                        />
                     </LogoutButton>
                  </HeaderTop>
                  <PhotoContainer>
                     {avatar && <Photo source={{ uri: avatar }} />}
                     <PhotoButton onPress={handleAvatarSelect}>
                        <Feather
                           name='camera'
                           size={24}
                           color={theme.colors.shape}
                        />
                     </PhotoButton>
                  </PhotoContainer>

               </Header>
               <Content
                  style={{ marginBottom: useBottomTabBarHeight() }}
               >
                  <Options>
                     <Option 
                        active={option === 'dataEdit'}
                        onPress={() => handleOptionChange('dataEdit')}
                     >
                        <OptionTitle active={option === 'dataEdit'}>
                           Dados
                        </OptionTitle>
                     </Option>
                     <Option 
                        active={option === 'passwordEdit'}
                        onPress={() => handleOptionChange('passwordEdit')}
                     >
                        <OptionTitle active={option === 'passwordEdit'}>
                           Troca Senha
                        </OptionTitle>
                     </Option>
                  </Options>

                  {
                     option === 'dataEdit' ? (
                        <Section>
                           <Input
                              iconName='user'
                              placeholder='Nome'
                              autoCorrect={false}
                              autoCapitalize='none'
                              onChangeText={setName}
                              value={name}
                              defaultValue={user.name}
                           />
                           <Input
                              iconName='mail'
                              editable={false}
                              defaultValue={user.email}
                           />
                           <Input
                              iconName='credit-card'
                              placeholder='CNH'
                              autoCorrect={false}
                              autoCapitalize='none'
                              keyboardType='numeric'
                              onChangeText={setDriverLicense}
                              value={driverLicense}
                              defaultValue={user.driver_license}
                           />
                        </Section>
                     ) : (
                        <Section>
                           <PasswordInput
                              iconName='lock'
                              placeholder='Senha Atual'
                              onChangeText={setPassword}
                              value={password}
                           />
                           <PasswordInput
                              iconName='lock'
                              placeholder='Nova Senha'
                              onChangeText={setPassword}
                              value={password}
                           />
                           <PasswordInput
                              iconName='lock'
                              placeholder='Repetir Senha'
                              value={confirmPassword}
                              onChangeText={setConfirmPassword}
                           />
                        </Section>
                     )
                  }
               </Content>
            </Container>
         </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
   );
}