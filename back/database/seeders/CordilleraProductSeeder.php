<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CordilleraProductSeeder extends Seeder
{
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('products')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $products = [
            [
                'name' => 'Cordillera Inabel Shawl',
                'category' => 'Cordillera Inabel',
                'description' => 'Handwoven shawl from the Cordillera region.',
                'price' => 120,
                'stock' => 10,
                'barcode' => 'CI001',
                'images' => null, 
            ],
            [
                'name' => 'Ikat Table Runner',
                'category' => 'Ikat',
                'description' => 'Traditional ikat weaving from Cordillera.',
                'price' => 150,
                'stock' => 15,
                'barcode' => 'IK001',
                'images' => null,
            ],
            [
                'name' => 'Kalinga Weaving Bag',
                'category' => 'Kalinga Weaving',
                'description' => 'Handwoven Kalinga bag, authentic design.',
                'price' => 250,
                'stock' => 12,
                'barcode' => 'KL001',
                'images' => null,
            ],
            [
                'name' => 'Cordillera Inabel Blanket',
                'category' => 'Cordillera Inabel',
                'description' => 'Soft and colorful handwoven blanket.',
                'price' => 800,
                'stock' => 8,
                'barcode' => 'CI002',
                'images' => null,
            ],
            [
                'name' => 'Ikat Wall Hanging',
                'category' => 'Ikat',
                'description' => 'Decorative ikat wall hanging from Cordillera.',
                'price' => 500,
                'stock' => 5,
                'barcode' => 'IK002',
                'images' => null,
            ],
            [
                'name' => 'Kalinga Weaving Table Mat',
                'category' => 'Kalinga Weaving',
                'description' => 'Handwoven table mat with traditional patterns.',
                'price' => 200,
                'stock' => 20,
                'barcode' => 'KL002',
                'images' => null,
            ],
            [
                'name' => 'Cordillera Inabel Cushion Cover',
                'category' => 'Cordillera Inabel',
                'description' => 'Handwoven cushion cover, soft texture.',
                'price' => 120,
                'stock' => 25,
                'barcode' => 'CI003',
                'images' => null,
            ],
            [
                'name' => 'Ikat Tote Bag',
                'category' => 'Ikat',
                'description' => 'Stylish tote bag made from ikat weaving.',
                'price' => 110,
                'stock' => 14,
                'barcode' => 'IK003',
                'images' => null,
            ],
            [
                'name' => 'Kalinga Weaving Wall Decor',
                'category' => 'Kalinga Weaving',
                'description' => 'Unique handwoven wall decor piece.',
                'price' => 300,
                'stock' => 6,
                'barcode' => 'KL003',
                'images' => null,
            ],
        ];

        DB::table('products')->insert($products);
    }
}
