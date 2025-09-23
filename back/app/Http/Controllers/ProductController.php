<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    // List all products
    public function index(): JsonResponse
    {
        $products = Product::all();
        return response()->json(['data' => $products], 200);
    }

    // Add a new product
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|unique:products,name',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = $request->only(['name', 'price', 'stock', 'category', 'description']);

        if ($request->hasFile('image')) {
            $filename = time().'_'.$request->file('image')->getClientOriginalName();
            $path = $request->file('image')->storeAs('products', $filename, 'public');
            $data['image'] = $path;
        }

        $product = Product::create($data);

        return response()->json(['message' => 'Product created successfully', 'data' => $product], 201);
    }

    // Get single product
    public function show($id): JsonResponse
    {
        $product = Product::find($id);
        if (!$product) return response()->json(['error' => 'Product not found'], 404);

        return response()->json(['data' => $product], 200);
    }

    // Update product
    public function update(Request $request, $id): JsonResponse
    {
        $product = Product::find($id);
        if (!$product) return response()->json(['error' => 'Product not found'], 404);

        $request->validate([
            'name' => 'required|string|unique:products,name,'.$id,
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = $request->only(['name', 'price', 'stock', 'category', 'description']);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($product->image && Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }

            $filename = time().'_'.$request->file('image')->getClientOriginalName();
            $path = $request->file('image')->storeAs('products', $filename, 'public');
            $data['image'] = $path;
        }

        $product->update($data);

        return response()->json(['message' => 'Product updated successfully', 'data' => $product], 200);
    }

    // Delete product
    public function destroy($id): JsonResponse
    {
        $product = Product::find($id);
        if (!$product) return response()->json(['error' => 'Product not found'], 404);

        if ($product->image && Storage::disk('public')->exists($product->image)) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully'], 200);
    }
}
