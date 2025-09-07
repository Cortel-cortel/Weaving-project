<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CheckoutController;

// =======================
// Public Routes
// =======================

// Product listing (all users)
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

// Authentication
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// =======================
// Protected Routes (Authenticated Users)
// =======================
Route::middleware(['auth:sanctum'])->group(function () {

    // =======================
    // User Routes
    // =======================
    Route::get('/user', function (Request $request) {
        return response()->json([
            'success' => true,
            'user' => $request->user(),
            'isAdmin' => (bool) $request->user()->is_admin,
        ]);
    });

    // User-specific cart
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);
    Route::delete('/cart/clear', [CartController::class, 'destroyAll']);


       // Checkout route
    Route::post('/checkout', [CheckoutController::class, 'store']);
    
    // =======================
    // Admin Routes
    // =======================
    Route::middleware('admin')->group(function () {

        // Admin dashboard
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
    });
});
