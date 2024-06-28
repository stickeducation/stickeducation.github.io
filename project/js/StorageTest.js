// Function to open the IndexedDB
function openTestDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('threejs-editor', 1); // Change database name to 'threejs-editor'

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('states')) {
                db.createObjectStore('states', { keyPath: 'id', autoIncrement: true }); // Ensure keyPath is set
            }
        };

        request.onsuccess = (event) => {
            console.log('IndexedDB opened successfully');
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            console.error('Error opening IndexedDB:', event);
            reject(event.target.error);
        };
    });
}

// Function to save data to IndexedDB
export async function addDataToIndexedDB(db, keyValuePairs) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['states'], 'readwrite');
        const objectStore = transaction.objectStore('states');

        keyValuePairs.forEach((pair, index) => {
            const request = objectStore.put({ id: index, key: pair.key, value: pair.value });
            request.onsuccess = () => {
                console.log('Data added to IndexedDB:', pair);
            };
            request.onerror = (event) => {
                reject(event.target.error);
            };
        });

        transaction.oncomplete = () => {
            resolve();
        };

        transaction.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

export { openTestDatabase };
