﻿using Abstracciones.Modelos;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Abstracciones.Interfaces.API
{
    public interface IProveedorController
    {
        Task<IActionResult> Agregar(ProveedorRequest proveedor);
        Task<IActionResult> Editar(Guid Id, ProveedorRequest proveedor);
        Task<IActionResult> Eliminar(Guid Id);
        Task<IActionResult> Obtener();
        Task<IActionResult> Obtener(Guid Id);
    }
}
