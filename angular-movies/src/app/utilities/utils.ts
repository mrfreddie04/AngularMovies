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

  if(response.error) {
    if(typeof response.error === "string") {
      result.push(response.error);
    } else {
      const mapErrors = response.error.errors;
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
    console.log("Error",field.errors);
    if(field.hasError('required')) return `The "${fieldName}" field is required`;
    if(field.hasError('capitalized')) return field.getError('capitalized').message;
    return "";
  }  
}

export const isErrors = (form: FormGroup) => {
  return (fieldName: string): boolean => {    
    const field = form.get(fieldName);
    return (!!field.errors && field.touched);
  } 
}

