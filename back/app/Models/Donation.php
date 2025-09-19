<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    use HasFactory;

    // Table name (optional since Laravel guesses "donations")
    protected $table = 'donations';

    // Fillable fields for mass assignment
    protected $fillable = [
        'name',
        'email',
        'phone',
        'amount',
        'fundraiser',
        'message',
        'donated_at',
    ];

    // Cast donated_at to a Carbon datetime object
    protected $casts = [
        'donated_at' => 'datetime',
    ];
}
