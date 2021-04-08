export const utility = {
    lastItem<T>(array: T[]): T | undefined {
        return array[array.length - 1];
    }
}