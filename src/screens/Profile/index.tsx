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
   Alert,
   Keyboard, 
   KeyboardAvoidingView, 
   StatusBar, 
   TouchableWithoutFeedback,  
} from 'react-native';
import { Input } from '../../components/Input';
import { PasswordInput } from '../../components/PasswordInput';
import { useAuth } from '../../hooks/auth';
import { Button } from '../../components/Button';
import * as Yup from 'yup';
import { useNetInfo } from '@react-native-community/netinfo';

export function Profile(){
   const { user, signOut, updateUser } = useAuth();
   const [option, setOption] = useState<'dataEdit' | 'passwordEdit'>('dataEdit');
   const [name, setName] = useState(user.name);
   const [driverLicense, setDriverLicense] = useState(user.driver_license);
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [avatar, setAvatar] = useState(user.avatar);
   const theme = useTheme();
   const netInfo = useNetInfo();

   function handleOptionChange(optionSelected: 'dataEdit' | 'passwordEdit') {
      if (netInfo.isConnected === false && optionSelected === 'passwordEdit') {
         Alert.alert('Você está offline!', 'Para mudar a senha, concte-se a internet.');
      } else {
         setOption(optionSelected);
      }
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

   async function handleProfileUpdate() {
      try {
         const schema = Yup.object().shape({
            driverLicense: Yup.string().required('CNH é obrigatória'),
            name: Yup.string().required('Nome é obrigatório'),
         });
         const data = { name, driverLicense };
         await schema.validate(data);
         await updateUser({
            id: user.id,
            avatar,
            name,
            driver_license: driverLicense,
            email: user.email,
            user_id: user.user_id,
            token: user.token,
         });
         Alert.alert('Perfil Atualizado!');
      } catch (error){
         if (error instanceof Yup.ValidationError) {
            return Alert.alert('Opa!', error.message);
         }
         return Alert.alert('Não foi possível atualizar o perfil.')
      }
   }

   async function handleSignOut() {
      Alert.alert(
         'Tem certeza?',
         'Se você sair, irá precisar de internet para conectar-se novamente.',
         [
            {
               text: 'Cancelar',
               onPress: () => {},
               style: 'cancel'
            },
            {
               text: 'Sair',
               onPress: () => signOut(),
            },
         ]
      );
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
                     <LogoutButton onPress={handleSignOut} >
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
                  <Button 
                     title='Salvar Alterações'
                     onPress={handleProfileUpdate}
                  />
               </Content>
            </Container>
         </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
   );
}