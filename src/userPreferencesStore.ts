import {Canteen} from "./pages/Interfaces";
import {openDatabase} from "./openDBStore";

const STORE_NAME = 'user-preferences';
const PREFERENCE_KEY = 'user-preference';

export const addUserPreferences = async (role: string, university: string, canteen: object): Promise<void> => {
    console.log('Saving user preferences:', role, university, canteen);
    const db = await openDatabase();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    store.put({
        id: PREFERENCE_KEY,
        role,
        university,
        canteen
    });
    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => {
            console.log('User preferences saved!');
            resolve();
        };
        transaction.onerror = () => {
            console.error('Error saving user preferences:', transaction.error);
            reject(transaction.error);
        };
    });
};

export const getCanteenFromPreferences = async (): Promise<Canteen> => {
    const db = await openDatabase();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    let request = store.get(PREFERENCE_KEY);
    return await new Promise((resolve, reject) => {
        request.onsuccess = () => {
            console.log('User canteen preferences fetched:', request.result.canteen);
            resolve(request.result.canteen);
        };
        request.onerror = () => {
            console.error('Error fetching user preferences:', request.error);
            reject(request.error);
        };
    });
}

export const getUniversityFromPreferences = async (): Promise<string> => {
    const db = await openDatabase();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    let request = store.get(PREFERENCE_KEY);
    return await new Promise((resolve, reject) => {
        request.onsuccess = () => {
            console.log('User university preferences fetched:', request.result.university);
            resolve(request.result.university);
        };
        request.onerror = () => {
            console.error('Error fetching user preferences:', request.error);
            reject(request.error);
        };
    });
}