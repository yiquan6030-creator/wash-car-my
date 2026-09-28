import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
const key = 'washcar-local-v2';
export async function readLocal(): Promise<unknown> {
    const raw = Platform.OS === 'web' ? globalThis.localStorage?.getItem(key)
        : await FileSystem.readAsStringAsync(`${FileSystem.documentDirectory}${key}.json`).catch(() => null);
    return raw ? JSON.parse(raw) : null;
}
export async function writeLocal(value: unknown) {
    const raw = JSON.stringify(value);
    if (Platform.OS === 'web')
        globalThis.localStorage.setItem(key, raw);
    else
        await FileSystem.writeAsStringAsync(`${FileSystem.documentDirectory}${key}.json`, raw);
}
