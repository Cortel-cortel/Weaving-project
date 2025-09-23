<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SeedAll extends Command
{
    protected $signature = 'db:seed-all';
    protected $description = 'Truncate and seed AdminUser and default data';

    public function handle()
    {
        $this->info('Clearing tables...');

        // Truncate the tables safely
        DB::table('users')->truncate();
        DB::table('products')->truncate(); // adjust if your product table has another name

        $this->info('Seeding AdminUserSeeder...');
        $this->call('db:seed', ['--class' => 'Database\\Seeders\\AdminUserSeeder']);

        $this->info('Seeding CordilleraProductSeeder...');
        $this->call('db:seed', ['--class' => 'Database\\Seeders\\CordilleraProductSeeder']);

        $this->info('Seeding completed successfully!');
        return 0;
    }
}
