
var builder = WebApplication.CreateBuilder(args);
// Add CORS services.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
});
builder.Services.AddControllers(); 
var app = builder.Build();
// Configure the HTTP request pipeline.
app.MapControllers();
 
app.UseCors(b => b
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());
 

app.Run();
 