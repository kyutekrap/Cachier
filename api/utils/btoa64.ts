export function btoa64(str: string) {
    const utf8Bytes = new TextEncoder().encode(str);
    return btoa(String.fromCharCode(...utf8Bytes));
}