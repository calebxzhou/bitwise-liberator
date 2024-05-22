var builder = WebApplication.CreateBuilder(args);
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

// Add CORS services.
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll",
        builder => {
            builder
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
});
builder.Services.AddControllers();
var app = builder.Build();


app.UseDefaultFiles(new DefaultFilesOptions {
    DefaultFileNames = new List<string> { "index.html" }
});
app.UseStaticFiles();
app.UseRouting();

// UseCors should be placed here
app.UseCors(b => b
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());

app.UseEndpoints(endpoints => {
    endpoints.MapControllers();
    // ... other mappings
});

app.Run();
