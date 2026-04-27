// src/components/Column.tsx
"use client";

import { useState } from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { useRouter } from "next/navigation";
import Card from "./Card";
import { createCard } from "@/actions/board";

export default function Column({ column }: { column: any }) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");

  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardTitle.trim()) return;

    // Yeni kartın pozisyonunu hesapla (en sondaki kartın pozisyonu + 1000)
    const lastCard = column.cards[column.cards.length - 1];
    const newPosition = lastCard ? lastCard.position + 1000 : 1000;

    // Veritabanına kaydet
    await createCard(column.id, newCardTitle, newPosition);
    
    // Formu temizle ve sayfayı yenileyerek yeni veriyi ekrana yansıt
    setNewCardTitle("");
    setIsAdding(false);
    router.refresh(); 
  };

  return (
    <div 
      ref={setNodeRef}
      className="bg-gray-200/50 rounded-xl p-4 min-w-[300px] flex flex-col gap-4"
    >
      <h3 className="font-semibold text-gray-700">{column.title}</h3>
      
      <div className="flex flex-col gap-3 min-h-[150px]">
        <SortableContext items={column.cards.map((c: any) => c.id)} strategy={verticalListSortingStrategy}>
          {column.cards.map((card: any) => (
            <Card key={card.id} card={card} />
          ))}
        </SortableContext>
      </div>

      {/* YENİ KART EKLEME BÖLÜMÜ */}
      {isAdding ? (
        <form onSubmit={handleAddCard} className="mt-2">
          <input
            type="text"
            autoFocus
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            placeholder="Görev başlığı girin..."
            className="w-full p-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 text-gray-800"
          />
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-700 transition">
              Ekle
            </button>
            <button type="button" onClick={() => setIsAdding(false)} className="text-gray-500 px-2 text-sm hover:text-gray-700">
              İptal
            </button>
          </div>
        </form>
      ) : (
        <button 
          onClick={() => setIsAdding(true)}
          className="mt-2 flex items-center gap-1 text-gray-500 hover:text-gray-800 hover:bg-gray-300/50 p-2 rounded-md transition text-sm font-medium w-full"
        >
          <span>+ Yeni Kart Ekle</span>
        </button>
      )}
    </div>
  );
}