using System.ComponentModel.DataAnnotations;

namespace Movies.Validations
{
  public class FirstLetterUppercaseAttribute: ValidationAttribute
  {
    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
      //only apply to non-empty values, taken care by Required validator
      if(value == null || string.IsNullOrEmpty(value.ToString()))
      {
        return ValidationResult.Success;
      }

      var firstLetter = value.ToString()[0].ToString();
      if(firstLetter != firstLetter.ToUpper()) 
      {
        return new ValidationResult("First letter must be upper case");
      }

      return ValidationResult.Success;
    }
  }
}
