

export function containsSpecialChars(str: string) {
  const specialChars = /[`@#$%^&*+=\[\]{}"\\|<>\/?~]/;
  return specialChars.test(str);
}

export function validateString(str: string){
    const validationErrors: string[] =[];
    if(typeof str !== 'string') validationErrors.push("Must be a string");
    if(str.length === 0) validationErrors.push("Must not be empty.");
    if(str.length < 3) validationErrors.push("Must be at least 3 characters long");
    if(str.length > 50) validationErrors.push("Can't be longer than 50 characters");
    if(containsSpecialChars(str)) validationErrors.push("Must not contain special characters: `@#$%^&*+=[]{}\"\\|<>/?~");
    return validationErrors;
}