<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int|null $category_id
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 * @property-read Category|null $category
 */
class FeaturedCategorySetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
    ];

    protected $casts = [
        'category_id' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the featured category.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
