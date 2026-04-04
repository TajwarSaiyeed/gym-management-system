<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DietFoodList;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class DietFoodController extends Controller
{
    public function index()
    {
        $foods = DietFoodList::query()->get();

        if ($foods->isEmpty()) {
            return response()->json(['data' => []], 200);
        }

        return response()->json(['status' => 'success', 'data' => $this->mapList($foods)], 200);
    }

    public function store(Request $request)
    {
        if ($request->user()->role === 'user') {
            return response()->json(['error' => 'Not authorized'], 403);
        }

        $data = $request->validate(['name' => ['required', 'string']]);

        if (DietFoodList::query()->where('name', $data['name'])->exists()) {
            return response()->json(['error' => 'Food already exists'], 400);
        }

        $food = DietFoodList::create(['name' => $data['name']]);

        return response()->json(['status' => 'success', 'data' => $this->mapItem($food)], 201);
    }

    public function destroy(Request $request)
    {
        if ($request->user()->role === 'user') {
            return response()->json(['error' => 'Not authorized'], 403);
        }

        $data = $request->validate(['id' => ['required', 'string']]);

        $food = DietFoodList::query()->find($data['id']);

        if (! $food) {
            return response()->json(['error' => 'Food does not exist'], 400);
        }

        $food->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Exercise deleted successfully',
            'data' => $this->mapItem($food),
        ], 200);
    }

    /**
     * @param  Collection<int, DietFoodList>  $items
     * @return list<array<string, mixed>>
     */
    private function mapList($items): array
    {
        return $items->map(fn (DietFoodList $e) => $this->mapItem($e))->values()->all();
    }

    /**
     * @return array<string, mixed>
     */
    private function mapItem(DietFoodList $e): array
    {
        return [
            'id' => (string) $e->id,
            'name' => $e->name,
            'createdAt' => $e->created_at,
            'updatedAt' => $e->updated_at,
        ];
    }
}
