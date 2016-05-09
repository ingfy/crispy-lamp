export function find<T>(elements: T[], matcher: (element: T) => boolean) : T {
    for (var e of elements)
        if (matcher(e)) return e;
        
    return null;
}

export function nodeListToArray<T extends Node>(input: NodeListOf<T>): T[] {
    return Array.prototype.slice.call(input);
}

export function toArray(input: DOMTokenList) : string[] {
    return Array.prototype.slice.call(input);
}