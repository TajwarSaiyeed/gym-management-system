<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ExerciseList;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class ExerciseListController extends Controller
{
    public function index()
    {
        $exercises = ExerciseList::query()->get();

        if ($exercises->isEmpty()) {
            return response()->json(['data' => []], 200);
        }

        return response()->json(['status' => 'success', 'data' => $this->mapList($exercises)], 200);
    }

    public function store(Request $request)
    {
        if ($request->user()->role === 'user') {
            return response()->json(['error' => 'Not authorized'], 403);
        }

        $data = $request->validate(['name' => ['required', 'string']]);

        if (ExerciseList::query()->where('name', $data['name'])->exists()) {
            return response()->json(['error' => 'Exercise already exists'], 400);
        }

        $exercise = ExerciseList::create(['name' => $data['name']]);

        return response()->json(['status' => 'success', 'data' => $this->mapItem($exercise)], 201);
    }

    public function destroy(Request $request)
    {
        if ($request->user()->role === 'user') {
            return response()->json(['error' => 'Not authorized'], 403);
        }

        $data = $request->validate(['id' => ['required', 'string']]);

        $exercise = ExerciseList::query()->find($data['id']);

        if (! $exercise) {
            return response()->json(['error' => 'Exercise does not exist'], 400);
        }

        $exercise->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Exercise deleted successfully',
            'data' => $this->mapItem($exercise),
        ], 200);
    }

    /**
     * @param  Collection<int, ExerciseList>  $items
     * @return list<array<string, mixed>>
     */
    private function mapList($items): array
    {
        return $items->map(fn (ExerciseList $e) => $this->mapItem($e))->values()->all();
    }

    /**
     * @return array<string, mixed>
     */
    private function mapItem(ExerciseList $e): array
    {
        return [
            'id' => (string) $e->id,
            'name' => $e->name,
            'createdAt' => $e->created_at,
            'updatedAt' => $e->updated_at,
        ];
    }
}
