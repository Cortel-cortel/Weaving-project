<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Call the Cordillera products seeder and the Admin seeder
        $this->call([
            CordilleraProductSeeder::class,
            AdminUserSeeder::class, // 👈 added this line
        ]);
    }
}
