<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
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
    public function store(Request $request)
    {
        try {
            $request->validate([
                'barcode' => 'required|unique:products,barcode',
                'name' => 'required|unique:products,name',
                'price' => 'required|numeric|min:0',
                'stock' => 'required|integer|min:0',
                'category' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            $data = $request->only(['barcode','name','price','stock','category','description']);

            // Handle multiple image uploads
            $imagePaths = [];
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $file) {
                    $originalName = str_replace(' ', '_', $file->getClientOriginalName());
                    $path = $file->storeAs('products', $originalName, 'public');
                    $imagePaths[] = $path;
                }
            }
            $data['images'] = json_encode($imagePaths);

            $product = Product::create($data);
            return response()->json(['message' => 'Product created successfully', 'data' => $product], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Server error: ' . $e->getMessage()], 500);
        }
    }

    // Get a single product
    public function show(int $id): JsonResponse
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }
        return response()->json(['data' => $product], 200);
    }

    // Update a product
    public function update(Request $request, int $id): JsonResponse
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        $validatedData = $request->validate([
            'barcode' => 'required|unique:products,barcode,' . $id,
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        // Handle multiple image uploads
        if ($request->hasFile('images')) {
            $imagePaths = [];
            foreach ($request->file('images') as $file) {
                $originalName = str_replace(' ', '_', $file->getClientOriginalName());
                $path = $file->storeAs('products', $originalName, 'public');
                $imagePaths[] = $path;
            }
            $validatedData['images'] = json_encode($imagePaths);
        }

        $product->update($validatedData);
        return response()->json(['message' => 'Product updated successfully', 'data' => $product], 200);
    }

    // Delete a product
    public function destroy(int $id): JsonResponse
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        // Delete all images
        if ($product->images) {
            $images = json_decode($product->images, true);
            foreach ($images as $img) {
                if (\Storage::disk('public')->exists($img)) {
                    \Storage::disk('public')->delete($img);
                }
            }
        }

        $product->delete();
        return response()->json(['message' => 'Product deleted successfully'], 200);
    }
}
