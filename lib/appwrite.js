import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite'
import uuid from 'react-native-uuid';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.doug.aora',
    projectId: '67b21f830036a358da38',
    databaseId: '67b220fb0021ac31b29f',
    userCollectionId: '67b2210e0015477d3805',
    videoCollectionId: '67b221380008d7d78ac4',
    storageId: '67b222a700380182129f'
}

const { 
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId
} = config

//init your react-native SDK
const client = new Client()

client
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setPlatform(platform)

const account = new Account(client)
const avatars = new Avatars(client)
const databases = new Databases(client)
const storage = new Storage(client)



export const createUser = async (email, password, username) => {
   try {
     const newAccont = await account.create(
            ID.unique(),
            email,
            password,
            username
        )
        if(!newAccont) throw Error

        const avatarUrl = avatars.getInitials(username)

        await signin(email, password)

        const newUser = await databases.createDocument(
            databaseId,
            userCollectionId,
            ID.unique(),
        {
            accountId: newAccont.$id,
            email,
            username,
            avatar: avatarUrl
        })

        return newUser

   } catch (error) {
        console.log(error)
        throw new Error(error)
   }
} 

export const signin = async (email, password) => {
    try {
        const session = await account.createEmailPasswordSession(email, password)
        return session 
    } catch (error) {
        throw new Error(error)
    }
}

export const getCurrentUser = async () =>{
    try {
    const currentAccount = await account.get()

    if (!currentAccount) throw Error

    const currentUser = await databases.listDocuments(
        databaseId,
        userCollectionId,
        [Query.equal('accountId', currentAccount.$id)]
    )
    if(!currentUser) throw Error 

    return currentUser.documents[0]

    } catch (error) {
        console.log(error)
    }
}

export const getAllPosts = async () =>{
    try {
        const posts = await databases.listDocuments(
            databaseId, 
            videoCollectionId,
            [Query.orderDesc('$createdAt')]
        )

        return posts.documents
    } catch (error) {
        throw new Error(error)
    }
}

export const getLatestPosts = async () =>{
    try {
        const posts = await databases.listDocuments(
            databaseId, 
            videoCollectionId, 
            [Query.orderDesc('$createdAt', Query.limit(7))]
    )

        return posts.documents
    } catch (error) {
        throw new Error(error)
    }
}

export const searchPosts = async (query) => {
    try {
      const posts = await databases.listDocuments(
        databaseId,
        videoCollectionId,
        [Query.search("title", query)]
      );
  
      if (!posts) throw new Error("Something went wrong");
  
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
}

export const getUserPosts = async (userId) => {
    try {
      const posts = await databases.listDocuments(
        databaseId,
        videoCollectionId,
        [Query.equal("creator", userId)]
      );
  
      if (!posts) throw new Error("Something went wrong");
  
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
}

export const signOut = async () =>{
    try {
        const session = await account.deleteSession('current')

        return session
    } catch (error) {
        throw new Error(error)
    }
}

export const uploadFile = async (file, type) =>{
    console.log("Upload File", file)
    if(!file) return

    //using Document Picker 
    // const asset = {
    //     name: file.name,
    //     type: file.mimeType,
    //     size: file.size,
    //     uri: file.uri
    // }
    const asset = {
        name: uuid.v4(),
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri
    }
    console.log(asset)
    try {
        const uploadedFile = await storage.createFile(
            storageId,
            ID.unique(),
            asset
        )

        const fileUrl = await getFilePreview(uploadedFile.$id, type)
        return fileUrl
    } catch (error) {
        throw new Error(error)
    }
}

export const getFilePreview = async (fileId, type) =>{
    let fileUrl;
    try {
        if(type === "video"){
            fileUrl = storage.getFileView(
                storageId, 
                fileId
            )
        }else if(type === "image" ){
            fileUrl = storage.getFilePreview(
                storageId, 
                fileId, 
                2000, 
                2000, 
                'top', 
                100
            )
        }else{
            throw new Error('Invalid file type')
        }

        if(!fileUrl) throw Error

        return fileUrl
    } catch (error) {
        throw new Error(error)
    }
}

export const createVideo = async (form)=>{
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video')
        ])

        const newPost = await databases.createDocument(
            databaseId,
            videoCollectionId,
            ID.unique(),
            {
                title: form.title,
                thumbnail: thumbnailUrl,
                video: videoUrl,
                prompt: form.prompt,
                creator: form.userId
            }
        )

        return newPost
    } catch (error) {
        throw new Error(error)
    }
}