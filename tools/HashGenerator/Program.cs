using System;
using BCrypt.Net;

namespace HashGenerator;

internal class Program
{
    private static void Main()
    {
        Console.WriteLine("Generador de hash bcrypt para admin local\n");
        Console.Write("Ingrese el password a hashear: ");
        var password = Console.ReadLine();

        if (string.IsNullOrWhiteSpace(password))
        {
            Console.WriteLine("\nNo se ingresó un password válido.");
            return;
        }

        var hash = BCrypt.Net.BCrypt.HashPassword(password);

        Console.WriteLine("\nHash generado (copiar y pegar en seed_admin_local.sql):");
        Console.WriteLine(hash);
    }
}
