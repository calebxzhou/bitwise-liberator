namespace LiberatorDoc.Models;

public record DocTableContent(string TableName,List<string> Headers,List<List<string>> RowCells);