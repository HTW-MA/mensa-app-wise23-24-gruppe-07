const DB_NAME = 'meal-craft-database';
const STORE_NAME = 'bookmarked-meals';

export const openDatabase = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        if(!indexedDB) {
            reject(new Error('IndexedDB is not supported'));
        }

        const request = indexedDB.open(DB_NAME, 1);

        request.onerror = () => {
            reject(new Error('Failed to open database'));
        };

        request.onupgradeneeded = (event: any) => {
            const db = event.target.result;
            db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        };

        request.onsuccess = () => {
            resolve(request.result);
        };
    });
};

export const addMealIdToBookmarkedMealIds = async (mealId: string): Promise<void> => {
    const db = await openDatabase();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.add({ value: mealId });
};

export const readAllBookmarkedMealIdsFromStore = async (): Promise<number[]> => {
    const db = await openDatabase();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            resolve(request.result.map((item: { value: number }) => item.value));
        };

        request.onerror = () => {
            reject(new Error('Failed to read numbers from store'));
        };
    });
};