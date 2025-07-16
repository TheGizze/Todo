

export function containsSpecialChars(str: string) {
  const specialChars = /[`!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?~]/;
  return specialChars.test(str);
}

export function containsValidCharacters(str: string){
    const validCharacters = /^[a-zA-Z0-9 .,!?:;\-_'\(\)]+$/;
    return validCharacters.test(str);
}

export function validateString(str: string){
    const validationErrors: string[] =[];
    if(str.length === 0) validationErrors.push("Must not be empty.");
    if(str.length < 3) validationErrors.push("Must be at least 3 characters long");
    if(str.length > 50) validationErrors.push("Can't be longer than 50 characters");
    if(containsSpecialChars(str)) validationErrors.push("Must not contain special characters");
    if(!containsValidCharacters(str)) validationErrors.push("Use only valid characters a-zA-Z0-9 ");
    return validationErrors;
}