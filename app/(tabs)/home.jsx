import {  useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {  FlatList, Image, RefreshControl, Text, View } from "react-native";
import { useGlobalContext } from "../../context/GlobalProvider";

import { images } from "../../constants";
import SearchField from "../../components/SearchField";
 import Trending from "../../components/Trending";
import EmptyState from "../../components/EmptyState";
import { getAllPosts, getLatestPosts } from '../../lib/appwrite'
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";

const Home = () => {

  const { user } = useGlobalContext();
  const { data: latestPosts } = useAppwrite(getLatestPosts)
  const { data: posts, refetch } = useAppwrite(getAllPosts)
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () =>{
    setRefreshing(true)

    await refetch()
    setRefreshing(false)
  }


  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
         data={posts}
        keyExtractor={(item) => item.$id }
        renderItem={({item})=>(
          <VideoCard video={item}/>
        )}
        ListHeaderComponent={()=>(
          <View className="flex my-6 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  {user?.username}
                </Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>

            <SearchField />

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-lg font-pregular text-gray-100 mb-3">
                Latest Videos
              </Text>

             <Trending posts={ latestPosts ?? []} /> 
            </View>
            </View>
        )}
        ListEmptyComponent={()=>(
          <EmptyState title="No videos found"
          subtitle="Be the first one to upload a video"/>
        )}
        refreshControl={ <RefreshControl  refreshing={refreshing} onRefresh={onRefresh}/> }
      />
    </SafeAreaView>
  )
}

export default Home