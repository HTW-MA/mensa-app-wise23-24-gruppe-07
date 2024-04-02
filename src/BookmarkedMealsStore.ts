const DB_NAME = 'meal-craft-database';
const STORE_NAME = 'bookmarked-meals';

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
            const db = event.target.result;
            db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        };

        request.onsuccess = () => {
            resolve(request.result);
        };
    });
};

export const addMealIdToBookmarkedMealIds = async (mealId: string, mealName: string, price:string, iconSrc:string): Promise<void> => {
    const db = await openDatabase();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.add({ id: mealId, name: mealName, price: price, iconSrc: iconSrc});
};

export const removeMealIdFromBookmarkedMealIds = async (mealId: string): Promise<void> => {
    const db = await openDatabase();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete(mealId);
    console.log("Deleted meal with id: ", mealId);
};

export const readAllBookmarkedMealIdsFromStore = async (): Promise<string[]> => {
    const db = await openDatabase();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            resolve(request.result.map((item: { id: string }) => item.id));
        };

        request.onerror = () => {
            reject(new Error('Failed to read numbers from store'));
        };
    });
};

export const getAllBookmarkedMeals = async (): Promise<any[]> => {
    const db = await openDatabase();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(new Error('Failed to read numbers from store'));
        };
    });
}