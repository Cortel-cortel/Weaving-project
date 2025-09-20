<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use Illuminate\Http\Request;

class DonationController extends Controller
{
    /**
     * Store a new donation (public access).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'email'      => 'nullable|email|max:255',
            'phone'      => 'nullable|string|max:20',
            'amount'     => 'required|numeric|min:1',
            'fundraiser' => 'nullable|string|max:255',
            'message'    => 'nullable|string',
        ]);

        $validated['donated_at'] = now();

        $donation = Donation::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Donation received successfully!',
            'data'    => $donation,
        ], 201);
    }

    /**
     * List all donations (public access).
     */
    public function index()
    {
        $donations = Donation::orderBy('donated_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data'    => $donations,
        ]);
    }

    /**
     * Show a specific donation (public access).
     */
    public function show($id)
    {
        $donation = Donation::findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => $donation,
        ]);
    }

    /**
     * Delete a donation (public access).
     */
    public function destroy($id)
    {
        $donation = Donation::findOrFail($id);
        $donation->delete();

        return response()->json([
            'success' => true,
            'message' => 'Donation deleted successfully.',
        ]);
    }
}
