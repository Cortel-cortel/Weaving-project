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
        $products = Product::all()->map(function ($product) {
            $product->image_url = $product->image ? asset('storage/' . $product->image) : null;
            return $product;
        });

        return response()->json(['data' => $products], 200);
    }

    // Get single product
    public function show($id): JsonResponse
    {
        $product = Product::find($id);
        if (!$product) return response()->json(['error' => 'Product not found'], 404);

        $product->image_url = $product->image ? asset('storage/' . $product->image) : null;
        return response()->json(['data' => $product], 200);
    }

    // Create product
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:products,name',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $data = $request->only(['name', 'price', 'stock', 'category', 'description']);
        $data['barcode'] = 'PRD' . str_pad(Product::max('id') + 1, 4, '0', STR_PAD_LEFT);

        $product = Product::create($data);
        $product->image_url = null;

        return response()->json(['message' => 'Product created successfully', 'data' => $product], 201);
    }

    // Upload main image
    public function uploadImage(Request $request, $id): JsonResponse
    {
        $product = Product::find($id);
        if (!$product) return response()->json(['error' => 'Product not found'], 404);

        $request->validate(['image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048']);

        // Delete old image
        if ($product->image && Storage::disk('public')->exists($product->image)) {
            Storage::disk('public')->delete($product->image);
        }

        $file = $request->file('image');
        $filename = time() . '_' . $file->getClientOriginalName();
        $path = $file->storeAs('products', $filename, 'public');

        $product->image = $path;
        $product->save();
        $product->image_url = asset('storage/' . $path);

        return response()->json(['message' => 'Image uploaded successfully', 'data' => $product], 200);
    }

    // Update product
    public function update(Request $request, $id): JsonResponse
    {
        $product = Product::find($id);
        if (!$product) return response()->json(['error' => 'Product not found'], 404);

        $request->validate([
            'name' => 'required|string|unique:products,name,' . $id,
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $product->update($request->only(['name', 'price', 'stock', 'category', 'description']));
        $product->image_url = $product->image ? asset('storage/' . $product->image) : null;

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
