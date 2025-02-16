import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite'


export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.doug.aora',
    projectId: '67b21f830036a358da38',
    databaseId: '67b220fb0021ac31b29f',
    userCollectionId: '67b2210e0015477d3805',
    videoCollectionId: '67b221380008d7d78ac4',
    storageId: '67b222a700380182129f'
}

//init your react-native SDK
const client = new Client()

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform)

const account = new Account(client)
const avatars = new Avatars(client)
const databases = new Databases(client)



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
            config.databaseId,
            config.userCollectionId,
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
        config.databaseId,
        config.userCollectionId,
        [Query.equal('accountId', currentAccount.$id)]
    )
    if(!currentUser) throw Error 

    return currentUser.documents[0]

    } catch (error) {
        console.log(error)
    }
}
