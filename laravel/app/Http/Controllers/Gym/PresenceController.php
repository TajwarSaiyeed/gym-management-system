<?php

namespace App\Http\Controllers\Gym;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PresenceController extends Controller
{
    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', 'in:online,offline'],
        ]);

        $request->user()->update([
            'is_active' => $data['status'] === 'online',
        ]);

        return back();
    }
}
