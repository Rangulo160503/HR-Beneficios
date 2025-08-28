var builder = WebApplication.CreateBuilder(args);

// NO agregamos RazorPages
// builder.Services.AddRazorPages(); 

var app = builder.Build();

// Producción
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();

//  Sirve archivos del build de React (wwwroot)
app.UseStaticFiles();

app.UseRouting();

//  Redirige todas las rutas SPA al index.html
app.MapFallbackToFile("index.html");

app.Run();
