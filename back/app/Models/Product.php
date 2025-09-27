<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
    'name',
    'description',
    'details',   
    'trivia',   
    'category',
    'price',
    'stock',
    'images',
    'barcode',
];


    protected $casts = [
        'images' => 'array',
    ];

    // Only return non-empty images, null if none
    public function getValidImagesAttribute()
    {
        $filtered = is_array($this->images) ? array_filter($this->images) : [];
        return !empty($filtered) ? $filtered : null;
    }
}
