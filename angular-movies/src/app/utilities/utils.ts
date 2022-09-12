import { FormGroup } from "@angular/forms";

export const toBase64 = (file: File): Promise<string>  => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export const parseWebApiErrors = (response: any): string[] => {
  const result: string[] = [];

  console.log("API Response", response);

  if(response.error) {
    const error = response.error;
    if(typeof error === "string") {
      result.push(error);
    } else if(Array.isArray(error)) {      
      result.push(...error.map( err => err.description));
    } else {
      const mapErrors = error.errors;
      const entries = Object.entries(mapErrors);
      entries.forEach(([field,errors]) => {
        if(Array.isArray(errors)) {
          errors.forEach(errMessage => result.push(`${field}: ${errMessage}`));
        }          
      });
    };
  }

  return result;
}

export const formatDateFormData = (date: Date): string => {
  date = new Date(date);
  const format = new Intl.DateTimeFormat("en", { year: "numeric", month: "2-digit", day: "2-digit"})
  const [
    {value: month},,
    {value: day},,
    {value: year}
  ] = format.formatToParts(date);

  //yyyy-MM-dd
  return `${year}-${month}-${day}`;
} 

export const getErrorMessage = (form: FormGroup) => {
  return (fieldName: string): string => {
    const field = form.get(fieldName);    
    for(let error of Object.keys(field.errors)) {
      const err = field.errors[error];
      if(error === 'required') return `"Field is required.`;
      if(error === 'capitalized') return field.getError('capitalized').message;
      if(error === 'email') return `Invalid email format.`;
      if(error === 'minlength') {
        return `Value you entered is ${err.actualLength} chars long. It must be at least ${err.requiredLength} chars long.`
      }       
    };
    // if(field.hasError('required')) return `The "${fieldName}" field is required`;
    // if(field.hasError('capitalized')) return field.getError('capitalized').message;
    // if(field.hasError('email')) return `Invalid email format`;
    // if(field.hasError('minLength')) {
    //   return `The "${fieldName}" field`;
    // }  
    return "";
  }  
}

export const isErrors = (form: FormGroup) => {
  return (fieldName: string): boolean => {    
    const field = form.get(fieldName);
    return (!!field.errors && field.touched);
  } 
}

