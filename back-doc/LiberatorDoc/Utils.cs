namespace LiberatorDoc;

public static class Utils
{
    public static T? GetNullable<T>(this T[] array, int index) where T : class
    {
        if (index >= 0 && index < array.Length)
        {
            return array[index];
        }
        else
        {
            return null;
        }
    } 

}