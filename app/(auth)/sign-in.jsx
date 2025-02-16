import { View, Text, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import FromField from '../../components/FromField'
import  CustomButton from '../../components/CustomButton'
import { Link } from 'expo-router'
import { getCurrentUser, signin } from '../../lib/appwrite'
import { Alert } from 'react-native'
import { useGlobalContext } from '../../context/GlobalProvider'

const SignIn = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [isSubmitting, setIsSubmitting] = useState()
  const {setUser, setIsLoggedIn} = useGlobalContext()

  const submitForm = async() =>{
      if(!form.email || !form.password){
        Alert.alert('Error', 'Please fill in all the fields')
      }
  
      setIsSubmitting(true)
  
      try {
         await signin(form.email,form.password)
         const result = await getCurrentUser()
         setUser(result)
         setIsLoggedIn(true)
  
        Alert.alert('Success', 'User signed in successfully')
        router.replace('/home')
      } catch (error) {
        Alert.alert('Error', error.message)
      }
      finally{
        setIsSubmitting(false)
      }
    }
  

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image source={images.logo} resizeMode='contain' className="w-[115px] h-[35px]"/>
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
            Log in to Aorora
          </Text>
          <FromField 
            title="Email"
            value={form.email}
            handleChangeText={(e)=> setForm({...form, email: e})}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
           <FromField 
            title="Password"
            value={form.password}
            handleChangeText={(e)=> setForm({...form, password: e})}
            otherStyles="mt-7"
          />
          <CustomButton 
            title="Sign In"
            handlePress={submitForm}
            containerStyles={'mt-7'}
            isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account
            </Text>
            <Link href="/sign-up" className='text-lg font-psemibold text-secondary'>Sign Up</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn