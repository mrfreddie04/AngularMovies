import { AbstractControl } from "@angular/forms"

type CapitalizedError = { capitalized: { message: string }} | null;

export const capitalized = (control: AbstractControl): CapitalizedError => {
  const value = (control.value as string);
  if(!value || value.length===0) return null;
  const [firstLetter] = value;
  if(firstLetter === firstLetter.toUpperCase()) return null;
  return { capitalized: { message: "The first letter must be uppercase"} };
}