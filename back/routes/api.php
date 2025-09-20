<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\OrderController;

// =======================
// Public Routes
// =======================

// Product listing
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

// Donations
Route::post('/donations', [DonationController::class, 'store']);
Route::get('/donations', [DonationController::class, 'index']);
Route::get('/donations/{id}', [DonationController::class, 'show']);
Route::delete('/donations/{id}', [DonationController::class, 'destroy']);

// Authentication
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// =======================
// Protected Routes (Authenticated Users)
// =======================
Route::middleware(['auth:sanctum'])->group(function () {

    // User info
    Route::get('/user', function (Request $request) {
        return response()->json([
            'success' => true,
            'user' => $request->user(),
            'isAdmin' => (bool) $request->user()->is_admin,
        ]);
    });

    // Cart routes
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);
    Route::delete('/cart/clear', [CartController::class, 'destroyAll']);

    // Checkout
    Route::post('/checkout', [CheckoutController::class, 'store']);

    // Orders accessible by any authenticated user
    Route::get('/orders', [OrderController::class, 'index']);      
    Route::get('/orders/{id}', [OrderController::class, 'show']);

    // =======================
    // Admin-only routes
    // =======================
    Route::middleware('admin')->group(function () {

        Route::get('/dashboard', function () {
            return response()->json([
                'success' => true,
                'message' => 'Welcome Admin',
            ]);
        });

        // Product management
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);

        // Admin-only order updates/deletes
        Route::put('/orders/{id}', [OrderController::class, 'update']); 
        Route::delete('/orders/{id}', [OrderController::class, 'destroy']);
    });
});
