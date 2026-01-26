<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property string $price
 * @property string|null $precio_de_oferta
 * @property int|null $stock
 * @property string|null $SKU
 * @property string|null $imagen
 * @property int $category_id
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 * @property-read Category $category
 */
class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'precio_de_oferta',
        'stock',
        'SKU',
        'imagen',
        'category_id',
        'compatibilidad',
        'origen',
        'marca',
        'peso',
        'condicion',
        'disponibilidad',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'precio_de_oferta' => 'decimal:2',
        'stock' => 'integer',
        'category_id' => 'integer',
        'peso' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the category that owns the product.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    /**
     * Get the additional images for the product.
     */
    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('order');
    }
}