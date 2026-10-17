export const SERVER_PORT = 3000

export const POSTGRES_PATH = '/var/lib/postgresql'
export const POSTGRES_DB = 'twenty'
export const POSTGRES_USER = 'postgres'
export const REDIS_PORT = 6379
// Twenty writes uploads here (STORAGE_TYPE=local); both server and worker
// mount the same volume at this path, matching upstream compose.
export const STORAGE_PATH = '/app/packages/twenty-server/.local-storage'
