function validateKey(key) {
    // Check if key is null or empty
    if (key === null || key === undefined || key.trim() === '') {
        return "Key cannot be null or empty.";
    }

    // Check if key contains spaces
    if (key.includes(" ")) {
        return "Key cannot contain spaces.";
    }

    // Check if key starts or ends with '.'
    if (key.startsWith(".") || key.endsWith(".")) {
        return "Key cannot start or end with '.'";
    }

    // Check if key contains multiple consecutive '.'
    if (key.includes("..")) {
        return "Key cannot contain multiple consecutive '.'"
    }

    // Check if each part of the key separated by '.' is empty
    const parts = key.split(".");
    for (const part of parts) {
        if (part.trim() === '') {
            return "Key contains empty part(s).";
        }
    }

    return null;
}
export default validateKey;
