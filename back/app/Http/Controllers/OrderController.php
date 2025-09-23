<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    // List all orders
    public function index()
    {
        $orders = Order::with(['user', 'items.product'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Transform items to include product_name directly
        $orders->transform(function ($order) {
            $order->user_name = $order->user->name ?? $order->customer_name ?? 'Unknown User';
            $order->user_email = $order->user->email ?? $order->customer_email ?? 'Unknown Email';
            $order->status = $order->status ?? 'Pending';

            $order->items->transform(function ($item) {
                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'product_name' => $item->product->name ?? 'Unknown Product',
                    'price' => $item->price,
                    'quantity' => $item->quantity,
                ];
            });

            return $order;
        });

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    // Show single order
    public function show($id)
    {
        $order = Order::with(['user', 'items.product'])->find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        $order->user_name = $order->user->name ?? $order->customer_name ?? 'Unknown User';
        $order->user_email = $order->user->email ?? $order->customer_email ?? 'Unknown Email';
        $order->status = $order->status ?? 'Pending';

        $order->items->transform(function ($item) {
            return [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'product_name' => $item->product->name ?? 'Unknown Product',
                'price' => $item->price,
                'quantity' => $item->quantity,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }

    // Update order status (public-safe)
    public function update(Request $request, $id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        $newStatus = $request->input('status');

        if ($newStatus && in_array($newStatus, ['Pending', 'Processing', 'Completed', 'Cancelled'])) {
            $order->status = $newStatus;
            $order->save();

            return response()->json([
                'success' => true,
                'message' => 'Order updated successfully',
                'data' => $order
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid or missing status'
        ], 400);
    }

    // Delete an order (public-safe)
    public function destroy($id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        $order->delete();

        return response()->json([
            'success' => true,
            'message' => 'Order deleted successfully'
        ]);
    }
}
