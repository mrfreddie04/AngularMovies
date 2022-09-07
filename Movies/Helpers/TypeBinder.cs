using Microsoft.AspNetCore.Mvc.ModelBinding;
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Movies.Helpers
{
  public class TypeBinder<T> : IModelBinder
  {
    public Task BindModelAsync(ModelBindingContext bindingContext)
    {
      var propertyName = bindingContext.ModelName;
      var value = bindingContext.ValueProvider.GetValue(propertyName);
      if(value == ValueProviderResult.None)
      {
        //no value - nothing to bind
        return Task.CompletedTask;
      }

      try
      {
        
        var deserialized = JsonConvert.DeserializeObject<T>(value.FirstValue);
        //var deserialized2 = System.Text.Json.JsonSerializer.Deserialize<T>(value.FirstValue);
        bindingContext.Result = ModelBindingResult.Success(deserialized);
      }
      catch 
      {
        bindingContext.ModelState.TryAddModelError(propertyName, "Given value is not of the correct type");
      }
      return Task.CompletedTask;
    }
  }
}
