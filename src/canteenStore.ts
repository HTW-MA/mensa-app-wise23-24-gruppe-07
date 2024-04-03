const DB_NAME = 'meal-craft-database';
const STORE_NAME = 'canteen-list';

export const openDatabase = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        if(!indexedDB) {
            reject(new Error('IndexedDB is not supported'));
        }

        const request = indexedDB.open(DB_NAME, 13);

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
            db.createObjectStore(STORE_NAME, {keyPath: 'id'});
        };

        request.onsuccess = () => {
            resolve(request.result);
        };
    });
};

export const checkAndAddCanteens = async (canteens: any[]): Promise<void> => {
    const db = await openDatabase();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    for (const canteen of canteens) {
        let request = store.get(canteen.id);
        await new Promise((resolve, reject) => {
            request.onsuccess = () => {
                if (!request.result) {
                    console.log("Adding canteen to DB:", canteen);
                    store.add(canteen);
                }
                resolve(true);
            };
            request.onerror = () => {
                console.error(`Error fetching canteen with ID ${canteen.ID}:`, request.error);
                reject(request.error);
            };
        });
    }

    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => {
            console.log('All canteens processed');
            resolve();
        };
        transaction.onerror = () => {
            console.error('Error during transaction:', transaction.error);
            reject(transaction.error);
        };
    });
};


export const getCanteensByUniversity = async (university: string): Promise<any[]> => {
    return new Promise(async (resolve, reject) => {
        const db = await openDatabase();
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onerror = (event) => {
            reject(`Database error: ${request.error?.message}`);
        };

        request.onsuccess = (event) => {
            const allCanteens = request.result as any[];

            const filteredCanteens = allCanteens.filter(canteen =>
                canteen.universities && canteen.universities.includes(university)
            );
            resolve(filteredCanteens);
            console.log(filteredCanteens);
        };
    });
};

