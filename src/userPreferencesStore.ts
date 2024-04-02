const DB_NAME = 'meal-craft-database';
const STORE_NAME = 'user-preferences';
const PREFERENCE_KEY = 'user-preference';

export const openDatabase = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        if(!indexedDB) {
            reject(new Error('IndexedDB is not supported'));
        }

        const request = indexedDB.open(DB_NAME, 12);

        request.onerror = () => {
            reject(new Error('Failed to open database'));
        };

        request.onupgradeneeded = (event: any) => {
            console.log('Upgrading or creating database');
            const db = event.target.result;
            if (db.objectStoreNames.contains(STORE_NAME)) {
                console.log(`Deleting existing store: ${STORE_NAME}`);
                db.deleteObjectStore(STORE_NAME);
            }
            console.log(`Creating object store with keyPath: 'ID'`);
            db.createObjectStore(STORE_NAME);
        };

        request.onsuccess = () => {
            resolve(request.result);
        };
    });
};

export const addUserPreferences = async (role: string, university: string, canteen: object): Promise<void> => {
    console.log('Saving user preferences:', role, university, canteen);
    const db = await openDatabase();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    store.put({ role, university, canteen }, PREFERENCE_KEY);
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