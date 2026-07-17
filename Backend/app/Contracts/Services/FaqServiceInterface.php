<?php

namespace App\Contracts\Services;

use App\Models\Faq;
use Illuminate\Database\Eloquent\Collection;

interface FaqServiceInterface extends BaseServiceInterface
{
    public function all(bool $activeOnly = false): Collection;

    public function find(int $id): Faq;

    public function create(array $data): Faq;

    public function update(int $id, array $data): Faq;

    public function delete(int $id): bool;
}
