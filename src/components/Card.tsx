// src/components/Card.tsx
"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { deleteCard, updateCardContent } from "@/actions/board";
import { useRouter } from "next/navigation";

export default function Card({ card }: { card: { id: string, title: string, description?: string } }) {
  const router = useRouter();
  
  // Düzenleme modu için state (durum) tanımlamaları
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);
  const [editDescription, setEditDescription] = useState(card.description || "");
  
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    data: { type: "Card", card },
    disabled: isEditing, 
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (confirm("Bu görevi silmek istediğinize emin misiniz?")) {
      await deleteCard(card.id);
      router.refresh(); 
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    await updateCardContent(card.id, editTitle, editDescription);
    setIsEditing(false);
    router.refresh(); // Değişikliklerin ekrana yansıması için sayfayı yenile
  };

  // Kart sürüklenirken arkada bıraktığı gölge
  if (isDragging) {
    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        className="bg-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-400 h-[80px]" 
      />
    );
  }

  // düzenleme modunda (Form Görünümü)
  if (isEditing) {
    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        // Form açıkken tıklamaların sürükleme başlatmasını engellemek için stopPropagation
        onPointerDown={(e) => e.stopPropagation()} 
        className="bg-white p-4 rounded-lg shadow-md border-2 border-blue-400"
      >
        <form onSubmit={handleSave} className="flex flex-col gap-2">
          <input
            type="text"
            autoFocus
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            placeholder="Görev başlığı"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 resize-none"
            placeholder="Açıklama (Opsiyonel)"
            rows={2}
          />
          <div className="flex gap-2 justify-end mt-1">
            <button type="button" onClick={() => setIsEditing(false)} className="text-gray-500 text-xs px-2 py-1 hover:text-gray-700 font-medium">
              İptal
            </button>
            <button type="submit" className="bg-blue-600 text-white text-xs px-3 py-1 rounded-md hover:bg-blue-700 font-medium transition">
              Kaydet
            </button>
          </div>
        </form>
      </div>
    );
  }

  // NORMAL GÖRÜNÜM
  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners} 
      className="group relative bg-white p-4 rounded-lg shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      <h4 className="font-medium text-gray-800 pr-12">{card.title}</h4>
      {card.description && (
        <p className="text-sm text-gray-500 mt-1">{card.description}</p>
      )}

      {/* DÜZENLE & SİL İKONLARI - Sağ üst köşe */}
      <div className="absolute top-3 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Düzenle İkonu */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="text-gray-400 hover:text-blue-500 p-1"
          title="Düzenle"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
          </svg>
        </button>

        {/* Sil İkonu */}
        <button
          onClick={handleDelete}
          onPointerDown={(e) => e.stopPropagation()}
          className="text-gray-400 hover:text-red-500 p-1"
          title="Sil"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>
    </div>
  );
}