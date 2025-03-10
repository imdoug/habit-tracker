import { View, Alert, Text, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import FormField from '../../components/FormField'
import { VideoView , useVideoPlayer } from 'expo-video'
import { icons } from '../../constants'
import CustomButton from '../../components/CustomButton'
// import * as DocumentPicker from 'expo-document-picker'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import { createVideo } from '../../lib/appwrite'
import { useGlobalContext } from "../../context/GlobalProvider";

const Create = () => {
  const { user } = useGlobalContext()
  const [uploading, setUploading] = useState(false)

  const [form, setForm] = useState({
    title: '',
    video: null,
    thumbnail: null,
    prompt: ''
  })

  const player = useVideoPlayer(form.video, player => {
    player.loop = true;
  });

  const openPicker = async (selectType) =>{
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    // const result = await DocumentPicker.getDocumentAsync({
    //   type: selectType === 'image' ?
    //   ['image/png', 'image/jpg','image/jpeg'] :
    //   ['video/mp4', 'video/gif']
    // })

    if(!result.canceled){
      if(selectType === "image"){
        setForm({...form, thumbnail: result.assets[0]})
      }
      if(selectType === "video"){
        setForm({...form, video: result.assets[0]})
      }
    }
    // else{
    //   setTimeout(()=>{
    //     Alert.alert('Document picked', JSON.stringify(result, null, 2))
    //   }, 100)
    // }
  }

  const submit = async () =>{
      if(!form.prompt || !form.thumbnail || !form.title || !form.video){
        return Alert.alert('Please fill in all the fields')
      }

      setUploading(true)

      try {
        await createVideo({
          ...form, userId: user.$id
        })


        Alert.alert("Success", "Post uploaded successfully")
        router.push('/')


      } catch (error) {
        Alert.alert('Error',error.message)
      } finally {
        setForm({
          title: '',
          video: null,
          thumbnail: null,
          prompt: ''
        })
        setUploading(false)
      }
  }

  return (
    <SafeAreaView className="bg-primary h-full w-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">
          Upload Video
        </Text>
        <FormField 
          title="Video Title"
          value={form.title}
          placeholder={"Give your video a catchy title"}
          handleChangeText={(e)=> setForm({...form, title: e})}
          otherStyles={"mt-10"}
        />
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">Upload Video</Text>
          <TouchableOpacity onPress={()=> openPicker('video')}>
            {form.video 
              ? 
              (
                <VideoView 
                  style={{ width: '100%',height: 240,borderRadius: 12 }}
                  player={player} 
                 // allowsFullscreen 
                  //allowsPictureInPicture 
                  //nativeControls
                />
              )
              : (
                <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                  <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                    <Image source={icons.upload} resizeMethod='contain' className="w-1/2 h-1/2"/>

                  </View>
                </View>
              )
            }
          </TouchableOpacity>
        </View>
        <View className="mt-7 space-y-2">
        <Text className="text-base text-gray-100 font-pmedium">
          Thumbnail image
        </Text>
        <TouchableOpacity onPress={()=> openPicker('image')}>
            {form.thumbnail 
              ? 
              (
              <Image source={{ uri: form.thumbnail.uri}} resizeMode='contain' className="w-full h-64 rounded-2xl"/>
              )
              : (
                <View className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
                    <Image source={icons.upload} resizeMethod='contain' className="w-5 h-5"/>
                    <Text className="text-sm text-gray-100 font-pmedium">
                      Choose a file
                    </Text>
                </View>
              )
            }
          </TouchableOpacity>
        </View>
        <FormField 
          title="Ai Prompt"
          value={form.prompt}
          placeholder={"The prompt you used to create this video"}
          handleChangeText={(e)=> setForm({...form, prompt: e})}
          otherStyles={"mt-7"}
        />
        <CustomButton
          title={'Submit and Publish'}
          containerStyles={"mt-7"}
          handlePress={submit}
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Create