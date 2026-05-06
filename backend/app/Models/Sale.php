<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'total',
        'status',
        'date',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
