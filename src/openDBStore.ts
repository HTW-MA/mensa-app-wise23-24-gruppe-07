const DB_NAME = 'meal-craft-database';
const DB_VERSION = 30;

export const openDatabase = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        if (!indexedDB) {
            reject('IndexedDB is not supported by this browser.');
            return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            reject(new Error('Failed to open database'));
        };

        request.onupgradeneeded = (event:any) => {
            const db = event.target.result;

            if (!db.objectStoreNames.contains('user-preferences')) {
                db.createObjectStore('user-preferences', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('canteen-list')) {
                db.createObjectStore('canteen-list', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('bookmarked-meals')) {
                db.createObjectStore('bookmarked-meals', { keyPath: 'id' });
            }
        };

        request.onsuccess = (event:any) => {
            resolve(event.target.result);
        };
    });
};
