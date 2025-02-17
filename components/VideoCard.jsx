import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useEvent } from 'expo';
import { icons } from '../constants'
import { useVideoPlayer, VideoView } from "expo-video";

const VideoCard = ({video: { title, thumbnail, video, creator: { username, avatar}}}) => {
    const [play, setPlay] = useState(false)

    const player = useVideoPlayer(video, player => {
        player.loop = true;
      });

    const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
      

  return (
    <View className="flex-col items-center px-4 mb-14">
        <View className="flex-row gap-3 items-start">
            <View className="justify-center items-center flex-row flex-1">
                <View className="w-[46px] h-[46px] justify-center items-center p-0.5">
                    <Image source={{uri: avatar}} className="w-full h-full rounded-lg" resizeMode='cover'/>
                </View>
                <View className="justify-center flex-1 gap-y-1 ml-3">
                    <Text className="text-white font-psemibold text-sm" numberOfLines={1}>
                        {title}
                    </Text>
                    <Text className="text-gray-100 font-pregular text-sx" numberOfLines={1}>
                        {username}
                    </Text>
                </View>
            </View>
            <View className="pt-2">
                <Image source={icons.menu} className="w-5 h-5" resizeMode='contain'/>
            </View>
        </View>
        {   play 
            ? (<VideoView
                style={{ width: '100%',height: 240,borderRadius: 12 }}
                player={player} 
                allowsFullscreen 
                allowsPictureInPicture 
                nativeControls
                />) 

            : (<TouchableOpacity 
                    activeOpacity={0.7} 
                    onPress={()=> {
                        if (isPlaying) {
                            player.pause();
                            setPlay(false)
                          } else {
                            player.play();
                            setPlay(true)
                          }
                    }} 
                    className="w-full h-60 rouned-xl mt-3 relative justify-center items-center">
                    <Image  source={{uri: thumbnail}} className="w-full h-full rounded-xl mt-3" resizeMode='cover'/>
                    <Image source={icons.play} className="w-12 h-12 absolute" resizeMode='contain'/>
            </TouchableOpacity>)}

    </View>
  )
}

export default VideoCard