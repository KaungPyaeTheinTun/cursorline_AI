<?php

namespace App\Contracts\Repositories;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface BaseRepositoryInterface
{
    public function all(array $columns = ['*']): \Illuminate\Database\Eloquent\Collection;

    public function findById(int $id, array $columns = ['*']): ?Model;

    public function create(array $data): Model;

    public function update(int $id, array $data): ?Model;

    public function delete(int $id): bool;

    public function paginated(int $perPage = 15, array $columns = ['*'], string $orderBy = 'id', string $direction = 'desc'): LengthAwarePaginator;

    public function count(): int;

    public function exists(int $id): bool;
}
