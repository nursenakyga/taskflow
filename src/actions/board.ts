// src/actions/board.ts
"use server"

import { db } from "@/lib/db";

// Kartın yerini veritabanında güncelleyecek olan fonksiyon
export async function updateCardPosition(cardId: string, columnId: string, newPosition: number) {
  try {
    const updatedCard = await db.card.update({
      where: { id: cardId },
      data: { 
        columnId: columnId,
        position: newPosition 
      }
    });
    
    return { success: true, data: updatedCard };
  } catch (error) {
    console.error("Kart güncellenirken hata oluştu:", error);
    return { success: false, error: "Veritabanı hatası" };
  }
}
export async function createCard(columnId: string, title: string, position: number) {
  try {
    const newCard = await db.card.create({
      data: {
        title: title,
        columnId: columnId,
        position: position,
      }
    });
    
    return { success: true, data: newCard };
  } catch (error) {
    console.error("Kart oluşturulurken hata:", error);
    return { success: false, error: "Veritabanı hatası" };
  }
}

export async function deleteCard(cardId: string) {
  try {
    await db.card.delete({
      where: { id: cardId }
    });
    
    return { success: true };
  } catch (error) {
    console.error("Kart silinirken hata oluştu:", error);
    return { success: false, error: "Veritabanı hatası" };
  }
}


export async function updateCardContent(cardId: string, title: string, description: string | null) {
  try {
    const updatedCard = await db.card.update({
      where: { id: cardId },
      data: { 
        title: title,
        description: description
      }
    });
    
    return { success: true, data: updatedCard };
  } catch (error) {
    console.error("Kart içeriği güncellenirken hata oluştu:", error);
    return { success: false, error: "Veritabanı hatası" };
  }
}