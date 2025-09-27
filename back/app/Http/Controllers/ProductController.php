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
            $product->image_urls = $product->valid_images
                ? collect($product->valid_images)
                    ->map(fn($img) => asset('storage/' . $img))
                    ->values()
                : null;
            return $product;
        });

        return response()->json(['data' => $products]);
    }

    // Get single product
    public function show($id): JsonResponse
    {
        $product = Product::find($id);
        if (!$product) return response()->json(['error' => 'Product not found'], 404);

        $product->image_urls = $product->valid_images
            ? collect($product->valid_images)
                ->map(fn($img) => asset('storage/' . $img))
                ->values()
            : null;

        return response()->json(['data' => $product]);
    }

    // Create product
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'        => 'required|string|unique:products,name',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'category'    => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'details'     => 'nullable|string',
            'trivia'      => 'nullable|string',
        ]);

        $data = $request->only([
            'name', 'price', 'stock', 'category', 'description', 'details', 'trivia'
        ]);
        $data['barcode'] = 'PRD' . str_pad(Product::max('id') + 1, 4, '0', STR_PAD_LEFT);
        $data['images'] = null; 

        $product = Product::create($data);
        $product->image_urls = null;

        return response()->json([
            'message' => 'Product created successfully',
            'data'    => $product
        ], 201);
    }

    // Upload multiple images
    public function uploadImage(Request $request, $id): JsonResponse
    {
        $product = Product::find($id);
        if (!$product) return response()->json(['error' => 'Product not found'], 404);

        $request->validate([
            'images'   => 'required',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048'
        ]);

        if (!$request->hasFile('images')) {
            return response()->json(['error' => 'No images uploaded'], 422);
        }

        $uploadedPaths = [];
        foreach ($request->file('images') as $file) {
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('products', $filename, 'public');
            $uploadedPaths[] = $path;
        }

        $existingImages = is_array($product->images) ? array_filter($product->images) : [];
        $product->images = array_merge($existingImages, $uploadedPaths);
        $product->save();

        $product->image_urls = collect($product->valid_images)
            ->map(fn($img) => asset('storage/' . $img))
            ->values();

        return response()->json([
            'message' => 'Images uploaded successfully',
            'data'    => $product
        ], 200);
    }

    // Update product
    public function update(Request $request, $id): JsonResponse
    {
        $product = Product::find($id);
        if (!$product) return response()->json(['error' => 'Product not found'], 404);

        $request->validate([
            'name'        => 'required|string|unique:products,name,' . $id,
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'category'    => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'details'     => 'nullable|string',
            'trivia'      => 'nullable|string',
        ]);

        $product->update($request->only([
            'name', 'price', 'stock', 'category', 'description', 'details', 'trivia'
        ]));

        $product->image_urls = $product->valid_images
            ? collect($product->valid_images)->map(fn($img) => asset('storage/' . $img))->values()
            : null;

        return response()->json(['message' => 'Product updated', 'data' => $product]);
    }

    // Delete product
    public function destroy($id): JsonResponse
    {
        $product = Product::find($id);
        if (!$product) return response()->json(['error' => 'Product not found'], 404);

        if ($product->valid_images) {
            foreach ($product->valid_images as $img) {
                if (Storage::disk('public')->exists($img)) {
                    Storage::disk('public')->delete($img);
                }
            }
        }

        $product->delete();
        return response()->json(['message' => 'Product deleted']);
    }
}
