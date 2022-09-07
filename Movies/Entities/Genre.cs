using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Movies.Validations;

namespace Movies.Entities
{
  public class Genre
  {
    public int Id { get; set; }

    [Required(ErrorMessage = "The field with name {0} is required")]
    [StringLength(50)]
    [FirstLetterUppercase]
    public string Name { get; set; }

    public ICollection<MovieGenre> MoviesGenres { get; set; }
  }

  //public class Genre: IValidatableObject
  //{
  //  public int Id { get; set; }

  //  [Required(ErrorMessage = "The field with name {0} is required")]
  //  [StringLength(50)]
  //  [FirstLetterUppercase]
  //  public string Name { get; set; }
  //  //[Range(18,120)]
  //  //public int Age { get; set; }
  //  //[CreditCard]
  //  //public string CreditCard { get; set; }
  //  //[Url]
  //  //public string Url { get; set; }

  //  public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
  //  {     
  //    if (!string.IsNullOrEmpty(Name))
  //    {
  //      var firstLetter = Name[0].ToString();
  //      if (firstLetter != firstLetter.ToUpper())
  //      {
  //        yield return new ValidationResult("First letter must be upper case",
  //          new string[] {nameof(Name)}
  //        );
  //        yield break;
  //      }
  //    }

  //    yield return ValidationResult.Success;
  //  }
  //}
}
