<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ImportRequestRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Public endpoint
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nombre_pieza' => ['required', 'string', 'max:255'],
            'tipo_importacion' => ['required', 'in:tuning,repuestos,racing'],
            'email' => ['required', 'email', 'max:150'],
            'telefono' => ['required', 'string', 'max:20'],
            'mensaje' => ['required', 'string'],
            'marca_vehiculo' => ['required', 'string', 'max:100'],
            'modelo_vehiculo' => ['required', 'string', 'max:100'],
            'anio_vehiculo' => ['required', 'string', 'max:10'],
            'pais_origen' => ['required', 'string', 'max:100'],
            'nivel_urgencia' => ['required', 'in:baja,media,alta,urgente'],
            'imagenes' => ['nullable', 'array', 'max:5'],
            'imagenes.*' => ['image', 'max:10240'], // 10MB per image
        ];
    }
}
