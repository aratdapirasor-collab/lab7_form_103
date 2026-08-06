'use client';

import { useState } from 'react';

export default function PriceCalculator() {
  const [quantity, setQuantity] = useState(1);

  const pricePerItem = 150;

  const total = quantity * pricePerItem;

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        เครื่องคำนวณราคา
      </h1>

      <div className="max-w-md space-y-3">
        <div>
          <label className="block mb-1">
            จำนวนสินค้า
          </label>

          <input
            type="number"
            value={quantity}
            min={1}
            onChange={(e) =>
              setQuantity(Number(e.target.value))
            }
            className="border p-2 rounded w-full"
          />
        </div>

        <p>
          ราคาต่อชิ้น: {pricePerItem.toLocaleString()} บาท
        </p>

        <p className="text-xl font-bold">
          ราคารวม: {total.toLocaleString()} บาท
        </p>
      </div>
    </main>
  );
}