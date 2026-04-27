// src/components/Board.tsx
"use client";
import { TouchSensor } from "@dnd-kit/core";
import { useState, useEffect } from "react";
import { 
  DndContext, 
  closestCorners, 
  DragEndEvent, 
  useSensor, 
  useSensors, 
  PointerSensor 
} from "@dnd-kit/core";
import Column from "./Column";
import { updateCardPosition } from "@/actions/board";

export default function Board({ initialData }: { initialData: any[] }) {
  const [isMounted, setIsMounted] = useState(false);
  const [columns, setColumns] = useState(initialData);


  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // Mobilde karta 0.25 saniye basılı tutunca sürükleme başlar
        tolerance: 5,
      },
    })
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Yeni kart eklendiğinde ekrandaki listeyi anında güncelleyen kısım
  useEffect(() => {
    setColumns(initialData);
  }, [initialData]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    const activeCardId = String(active.id);
    const overId = String(over.id);

    let sourceColumn = columns.find(col => col.cards.some((c: any) => c.id === activeCardId));
    let targetColumn = columns.find(col => col.id === overId || col.cards.some((c: any) => c.id === overId));

    if (!sourceColumn || !targetColumn) return;

    const activeCard = sourceColumn.cards.find((c: any) => c.id === activeCardId);
    if (!activeCard) return;

    // Deep copy ile state güncelliyoruz
    const newColumns = columns.map(col => ({
      ...col,
      cards: [...col.cards]
    }));
    
    const sourceColIndex = newColumns.findIndex(col => col.id === sourceColumn?.id);
    const targetColIndex = newColumns.findIndex(col => col.id === targetColumn?.id);

    newColumns[sourceColIndex].cards = newColumns[sourceColIndex].cards.filter((c: any) => c.id !== activeCardId);

    const overCardIndex = newColumns[targetColIndex].cards.findIndex((c: any) => c.id === overId);
    let newIndex = overCardIndex >= 0 ? overCardIndex : newColumns[targetColIndex].cards.length;

    newColumns[targetColIndex].cards.splice(newIndex, 0, activeCard);
    
    setColumns(newColumns);

    const targetCards = newColumns[targetColIndex].cards;
    let newPosition = 1000;

    if (targetCards.length === 1) {
      newPosition = 1000;
    } else if (newIndex === 0) {
      newPosition = targetCards[1].position / 2;
    } else if (newIndex === targetCards.length - 1) {
      newPosition = targetCards[newIndex - 1].position + 1000;
    } else {
      newPosition = (targetCards[newIndex - 1].position + targetCards[newIndex + 1].position) / 2;
    }

    activeCard.position = newPosition;
    await updateCardPosition(activeCardId, targetColumn.id, newPosition);
  };

  if (!isMounted) return null;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map((col) => (
          <Column key={col.id} column={col} />
        ))}
      </div>
    </DndContext>
  );
}