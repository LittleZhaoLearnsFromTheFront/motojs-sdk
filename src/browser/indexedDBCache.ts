import { _global } from "../shared/global";

type Options = {
    dbName: string,
    tableName: string // 表名
    keyPath?: string,  // 设置主键 （需要为添加对象内的key，否则新增和获取都会失败）
    indexs?: IDBIndex[], //
}

export class IndexedDBCache {
    private indexedDB = this.getIndexDB()
    private db: IDBDatabase | null = null; // 数据库
    private dbName: string
    private tableName: string
    private dbversion = 1
    private keyPath?: string
    private indexs: IDBIndex[]
    constructor(options: Options) {
        const { dbName, tableName, keyPath, indexs } = options
        this.dbName = dbName
        this.tableName = tableName
        this.keyPath = keyPath
        this.indexs = indexs ?? []
        this.initDB()
    }

    // 初始化数据库
    private initDB() {
        const indexedDB = this.indexedDB
        if (!indexedDB) return
        const createTable = (db: IDBDatabase) => {
            if (!db.objectStoreNames.contains(this.tableName)) {
                const objectStore = db.createObjectStore(this.tableName, this.keyPath ? {
                    keyPath: this.keyPath,
                } : { autoIncrement: true });
                this.indexs.forEach(element => {
                    // 三个参数分别为索引名称、索引所在的属性、配置对象（说明该属性是否包含重复的值）
                    objectStore.createIndex(element.name, element.name, { unique: element.unique });
                });
            }
        }
        return new Promise((resolve, reject) => {
            const openRequest = indexedDB.open(this.dbName, this.dbversion)
            openRequest.onsuccess = () => {
                this.db = openRequest.result
                createTable(this.db)
                console.log('open indexedDB success!!!');
                resolve('success')
            }

            openRequest.onerror = () => {
                console.error('open indexedDB error!!!');
                reject('error')
            }
            openRequest.onupgradeneeded = (event) => {
                const db = (event?.target as any)?.result
                createTable(db)
                resolve('upgradeneeded indexedDB sucess!!!');
            }
        });
    }
    /**
     * 添加数据
     * @param data 
     * @returns 
     */

    add(data: any) {
        return new Promise((resolve, reject) => {
            const transaction = this.db?.transaction(this.tableName, 'readwrite')
            const table = transaction?.objectStore(this.tableName)
            const res = table?.add(data)
            if (!res) return
            res.onsuccess = () => resolve('add to table success')
            res.onerror = () => reject('add to table error')
        })
    }
    /**
     * 修改
     * @param params 
     * @returns 
     */
    update(params: any) {
        return new Promise((resolve, reject) => {
            const res = this.db
                ?.transaction(this.tableName, 'readwrite')
                .objectStore(this.tableName)
                .put(params)
            if (!res) return
            res.onsuccess = () => resolve('update to table success')
            res.onerror = () => reject('update to table error')
        })
    }
    /**
     * 删除
     * @param key 
     * @returns 
     */
    remove(key: string | number) {
        return new Promise((resolve, reject) => {
            const res = this.db
                ?.transaction(this.tableName, 'readwrite')
                .objectStore(this.tableName)
                .delete(key)
            if (!res) return
            res.onsuccess = () => resolve('remove to table success')
            res.onerror = () => reject('remove to table error')
        })
    }
    /**
     * 清空表中数据
     * @returns 
     */
    clear() {
        return new Promise((resolve, reject) => {
            const res = this.db
                ?.transaction(this.tableName, 'readwrite')
                .objectStore(this.tableName)
                .clear()
            if (!res) return
            res.onsuccess = () => resolve('clear to table success')
            res.onerror = () => reject('clear to table error')
        })
    }
    /**
     * 获取数据
     * 如果key不传则返回全部
     * @param key 
     */
    getDataByKey(key?: string | number) {
        return new Promise((resolve, reject) => {
            const res = this.db
                ?.transaction(this.tableName, 'readonly')
                .objectStore(this.tableName)
                .getAll(key)
            if (!res) return
            res.onsuccess = () => resolve(res.result)
            res.onerror = () => resolve(reject('find data to table error'))
        })
    }
    /**
     * 断开indexedDB链接
     */
    closeDB() {
        this.db?.close()
    }
    /**
     * 删除库
     * @returns 
     */
    deleteDB() {
        const indexedDB = this.indexedDB
        if (!indexedDB) return
        const deleteRequest = indexedDB.deleteDatabase(this.dbName)
        deleteRequest.onsuccess = () => {
            console.log(`delete database ${this.dbName} success`);
        }
        deleteRequest.onerror = () => {
            console.error(`delete database ${this.dbName} error`);
        }
    }

    hasIndexedDB() {
        return !!this.indexedDB
    }

    private getIndexDB(): IDBFactory | null {
        if ('indexedDB' in _global) return _global.indexedDB
        if ('webkitIndexedDB' in _global) return _global.webkitIndexedDB as IDBFactory
        if ('mozIndexedDB' in _global) return _global.mozIndexedDB as IDBFactory
        console.error('error is open indexedDB');
        return null
    }
}   