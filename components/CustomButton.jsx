import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const CustomButton = ({title, handlePress, containerStyles, textStyles, isLoading}) => {
  return (
    <TouchableOpacity 
        className={`bg-secondary rounded-xl min-h-[62px] justify-center items-center ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}
        onPress={handlePress}
        activeOpacity={0.7} 
        disabled={isLoading} 
    >
      <Text className={`${textStyles}text-primary font-psemibold text-lg`}>
            {title}
      </Text>
    </TouchableOpacity>
  )
}

export default CustomButton