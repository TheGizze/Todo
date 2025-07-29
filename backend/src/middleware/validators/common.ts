

export function containsOnlyValidCharacters(str: string){
    const validCharacters = /^[a-zA-Z0-9 .,!?:;\-_'\(\)]+$/;
    return validCharacters.test(str);
}

export function validateString(str: string){
    const validationErrors: string[] =[];
    if(typeof str !== 'string') validationErrors.push("Must be a string");
    if(str.length === 0) validationErrors.push("Must not be empty.");
    if(str.length < 3) validationErrors.push("Must be at least 3 characters long");
    if(str.length > 50) validationErrors.push("Can't be longer than 50 characters");
    if(str.length > 0 && !containsOnlyValidCharacters(str)) validationErrors.push("Only letters, numbers, spaces, and basic punctuation (.,!?:;-_'()) are allowed");
    return validationErrors;
}