<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(Request $request)
    {
        // Validate input
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|unique:users',
            'password' => 'required|string|min:6|confirmed', // expects password_confirmation
        ]);

        // Create user (role always 'user')
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => 'user',
        ]);

        // Create token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success'  => true,
            'message'  => 'User registered successfully',
            'user'     => $user,
            'isAdmin'  => $user->role === 'admin',
            'token'    => $token,
            'redirect' => '/home', 
        ], 201);
    }

    /**
     * Login user or admin.
     */
public function login(Request $request)
{
    // Validate input
    $request->validate([
        'email'    => 'required|string|email',
        'password' => 'required|string',
    ]);

    $user = User::where('email', $request->email)->first();

    // Security best practice: don't reveal if email exists or not
    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json([
            'success' => false,
            'message' => 'The email or password you entered is incorrect. Please try again.',
        ], 401);
    }

    // Create token
    $token = $user->createToken('auth_token')->plainTextToken;

    // Determine redirect route
    $redirect = $user->role === 'admin' ? '/dashboard' : '/home';

    return response()->json([
        'success'  => true,
        'message'  => 'Login successful! Welcome back, ' . $user->name . '.',
        'user'     => $user,
        'isAdmin'  => $user->role === 'admin',
        'token'    => $token,
        'redirect' => $redirect,
    ]);
}
}
