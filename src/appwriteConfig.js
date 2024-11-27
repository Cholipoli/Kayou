import { Client , Storage, Databases} from 'appwrite';

const client = new Client();

// Replace `http://localhost/v1` with your Appwrite server endpoint
client
  .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite server endpoint
  .setProject('6734c8dd00362854da62') // Your project ID

const storage = new Storage(client);
const databases = new Databases(client);

const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1', // Replace with your Appwrite endpoint
    projectId: '6734c8dd00362854da62', // Replace with your actual project ID
  };

export { client, storage, databases, appwriteConfig }; 
