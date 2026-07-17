<?php

namespace App\Repositories;

use App\Contracts\Repositories\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

abstract class BaseRepository implements BaseRepositoryInterface
{
    protected Model $model;

    abstract protected function model(): Model;

    public function __construct()
    {
        $this->model = $this->model();
    }

    public function all(array $columns = ['*']): Collection
    {
        return $this->model->query()->get($columns);
    }

    public function findById(int $id, array $columns = ['*']): ?Model
    {
        return $this->model->query()->find($id, $columns);
    }

    public function create(array $data): Model
    {
        return $this->model->query()->create($data);
    }

    public function update(int $id, array $data): ?Model
    {
        $model = $this->findById($id);

        if (! $model) {
            return null;
        }

        $model->update($data);

        return $model->fresh();
    }

    public function delete(int $id): bool
    {
        $model = $this->findById($id);

        if (! $model) {
            return false;
        }

        return $model->delete();
    }

    public function paginated(int $perPage = 15, array $columns = ['*'], string $orderBy = 'id', string $direction = 'desc'): LengthAwarePaginator
    {
        return $this->model->query()
            ->orderBy($orderBy, $direction)
            ->paginate($perPage, $columns);
    }

    public function count(): int
    {
        return $this->model->query()->count();
    }

    public function exists(int $id): bool
    {
        return $this->model->query()->where('id', $id)->exists();
    }
}
