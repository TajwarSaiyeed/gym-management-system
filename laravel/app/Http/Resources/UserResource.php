<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'image' => $this->image,
            'role' => $this->role,
            'isActive' => $this->is_active,
            'gender' => $this->gender,
            'age' => $this->age,
            'height' => $this->height,
            'weight' => $this->weight,
            'goal' => $this->goal,
            'level' => $this->level,
            'adminId' => $this->admin_id !== null ? (string) $this->admin_id : null,
            'trainerId' => $this->trainer_id !== null ? (string) $this->trainer_id : null,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
