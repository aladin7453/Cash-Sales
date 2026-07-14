import {versionPath } from "@/lib/constants";

const cache: Record<string, Record<string, number | null>> = {};
const promiseCache: Record<string, Promise<void> | undefined> = {};

export const getColumnLength = async (
    moduleName: string,
    headers: HeadersInit,
) => {
    if (cache[moduleName]) return cache[moduleName];

    if (promiseCache[moduleName]) {
        await promiseCache[moduleName];
        return cache[moduleName];
    }
    promiseCache[moduleName] = (async () => {
        const res = await fetch(
            "public/columnLength.json",
            { method: "GET", headers }
        );

        if (!res.ok) {
            cache[moduleName] = {};
            return;
        }

        const data = await res.json();
        const moduleData = data[moduleName] || [];

        cache[moduleName] = {};
        moduleData.forEach((col: any) => {
            cache[moduleName][col.name] = col.maxLength;
        });
    })();

    await promiseCache[moduleName];
    delete promiseCache[moduleName];

    return cache[moduleName];
};