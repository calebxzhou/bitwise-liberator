using System.Text.Json;

namespace LiberatorDoc;

public class Options
{
    public static JsonSerializerOptions Json = new JsonSerializerOptions
    {
        PropertyNameCaseInsensitive = true,
    };
}