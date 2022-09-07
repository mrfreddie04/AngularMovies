using Movies.Validations;
using System.ComponentModel.DataAnnotations;

namespace Movies.DTOs
{
  public class GenreCreateDTO
  {
    [Required(ErrorMessage = "The field with name {0} is required")]
    [StringLength(50)]
    [FirstLetterUppercase]
    public string Name { get; set; }
  }
}
