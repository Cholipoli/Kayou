import { Client, Databases, Query } from 'appwrite';
import appwriteConfig from '../appwriteConfig'; // Import any custom config if needed

const client = new Client();
client.setEndpoint('https://cloud.appwrite.io/v1').setProject('6734c8dd00362854da62');
const databases = new Databases(client);

// Function to query documents
export const returnRockPoints = async (rockNumber = -1) => {
    console.log('huhil')
    if (rockNumber != -1){
        console.log('hey')
        const rn = parseInt(rockNumber)
        try {
            const response = await databases.listDocuments(
                '6734d04f00181a1b460b',
                '6734d5150027f6a88371',
                [
                    Query.equal('RockKey', rn),
                    Query.orderAsc("DateTime")
                ] // Pass query filters here
            );
            return response.documents;
        } catch (error) {
            console.error('Error querying documents:', error);
            throw error; // Re-throw for further handling
        }
    }
    else {
        try {
            const response = await databases.listDocuments(
                '6734d04f00181a1b460b',
                '6734d5150027f6a88371',
                [
                    Query.orderAsc("DateTime")
                ] // Pass query filters here
            );
            return response.documents;
        } catch (error) {
            console.error('Error querying documents:', error);
            throw error; // Re-throw for further handling
        }
    }

};


export const returnRockImage = async (rockNumber) => {
    //TODO - this is not yet implemented



    const rn = parseInt(rockNumber)
    try {
        const response = await databases.listDocuments(
            '6734d04f00181a1b460b',
            '6734d08c00346a7062da',
            [
                Query.equal('RockKey', rn),
            ] // Pass query filters here
        );
        return response.documents;
    } catch (error) {
        console.error('Error querying documents:', error);
        throw error; // Re-throw for further handling
    }


};

export const returnRocks = async () => {
    //TODO - this is not yet implemented
    try {
        const response = await databases.listDocuments(
            '6734d04f00181a1b460b',
            '6734d08c00346a7062da',
            [] // Pass query filters here
        );
        return response.documents;
    } catch (error) {
        console.error('Error querying documents:', error);
        throw error; // Re-throw for further handling
    }
};