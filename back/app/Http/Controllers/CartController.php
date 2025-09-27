<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CartController extends Controller
{
    //List all cart items.
    public function index(): JsonResponse
    {
        $cartItems = Cart::all();
        return response()->json(['data' => $cartItems], 200);
    }

    //Add a product to the cart
    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'product_id' => 'required|integer|min:1',
            'barcode' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:1',
            'category' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        try {
            // Check if product is already in the cart
            $existingItem = Cart::where('product_id', $validatedData['product_id'])->first();

            if ($existingItem) {
                $existingItem->quantity += $validatedData['quantity'];
                $existingItem->save();

                return response()->json([
                    'message' => 'Cart updated successfully',
                    'data' => $existingItem
                ], 200);
            }

            $cartItem = Cart::create($validatedData);

            return response()->json([
                'message' => 'Product added to cart successfully',
                'data' => $cartItem
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Server error: ' . $e->getMessage()
            ], 500);
        }
    }

    //Show details of a specific cart item.
    public function show(int $id): JsonResponse
    {
        $cartItem = Cart::find($id);

        if (!$cartItem) {
            return response()->json(['error' => 'Cart item not found'], 404);
        }

        return response()->json(['data' => $cartItem], 200);
    }

    //Update the quantity of a cart item.
    public function update(Request $request, int $id): JsonResponse
    {
        $cartItem = Cart::find($id);

        if (!$cartItem) {
            return response()->json(['error' => 'Cart item not found'], 404);
        }

        $validatedData = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cartItem->quantity = $validatedData['quantity'];
        $cartItem->save();

        return response()->json([
            'message' => 'Cart item updated successfully',
            'data' => $cartItem
        ], 200);
    }

    //Remove a cart item.
    public function destroy(int $id): JsonResponse
    {
        $cartItem = Cart::find($id);

        if (!$cartItem) {
            return response()->json(['error' => 'Cart item not found'], 404);
        }

        $cartItem->delete();

        return response()->json(['message' => 'Cart item deleted successfully'], 200);
    }

    //Clear the entire cart.
    public function destroyAll(): JsonResponse
    {
        Cart::query()->delete();

        return response()->json(['message' => 'All cart items have been deleted successfully'], 200);
    }
}
