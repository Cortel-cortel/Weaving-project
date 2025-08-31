<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CordilleraProductSeeder extends Seeder
{
    public function run()
    {
        // Clear the table first (disable foreign key check to avoid errors)
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('products')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $products = [
            [
                'name' => 'Cordillera Inabel Shawl',
                'category' => 'Cordillera Inabel',
                'description' => 'Handwoven shawl from the Cordillera region.',
                'price' => 1200,
                'stock' => 10,
                'barcode' => 'CI001',
            ],
            [
                'name' => 'Ikat Table Runner',
                'category' => 'Ikat',
                'description' => 'Traditional ikat weaving from Cordillera.',
                'price' => 800,
                'stock' => 15,
                'barcode' => 'IK001',
            ],
            [
                'name' => 'Kalinga Weaving Bag',
                'category' => 'Kalinga Weaving',
                'description' => 'Handwoven Kalinga bag, authentic design.',
                'price' => 950,
                'stock' => 12,
                'barcode' => 'KL001',
            ],
            // Additional products
            [
                'name' => 'Cordillera Inabel Blanket',
                'category' => 'Cordillera Inabel',
                'description' => 'Soft and colorful handwoven blanket.',
                'price' => 2500,
                'stock' => 8,
                'barcode' => 'CI002',
            ],
            [
                'name' => 'Ikat Wall Hanging',
                'category' => 'Ikat',
                'description' => 'Decorative ikat wall hanging from Cordillera.',
                'price' => 1500,
                'stock' => 5,
                'barcode' => 'IK002',
            ],
            [
                'name' => 'Kalinga Weaving Table Mat',
                'category' => 'Kalinga Weaving',
                'description' => 'Handwoven table mat with traditional patterns.',
                'price' => 700,
                'stock' => 20,
                'barcode' => 'KL002',
            ],
            [
                'name' => 'Cordillera Inabel Cushion Cover',
                'category' => 'Cordillera Inabel',
                'description' => 'Handwoven cushion cover, soft texture.',
                'price' => 600,
                'stock' => 25,
                'barcode' => 'CI003',
            ],
            [
                'name' => 'Ikat Tote Bag',
                'category' => 'Ikat',
                'description' => 'Stylish tote bag made from ikat weaving.',
                'price' => 1100,
                'stock' => 14,
                'barcode' => 'IK003',
            ],
            [
                'name' => 'Kalinga Weaving Wall Decor',
                'category' => 'Kalinga Weaving',
                'description' => 'Unique handwoven wall decor piece.',
                'price' => 1300,
                'stock' => 6,
                'barcode' => 'KL003',
            ],
        ];

        DB::table('products')->insert($products);
    }
}
