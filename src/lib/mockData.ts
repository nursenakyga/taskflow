// src/lib/mockData.ts

export const initialData = [
  {
    id: "col-1",
    title: "Yapılacaklar",
    cards: [
      // Aralarında geniş boşluklar bırakıyoruz (1000, 2000)
      { id: "card-1", title: "Veritabanı Tasarımı", description: "Prisma ile şema oluşturulacak", position: 1000 },
      { id: "card-2", title: "UI Tasarımı", description: "Tailwind ile temel bileşenler yazılacak", position: 2000 },
    ]
  },
  {
    id: "col-2",
    title: "Devam Edenler",
    cards: [
      { id: "card-3", title: "Proje Kurulumu", description: "Next.js ve dnd-kit kuruldu", position: 1000 }
    ]
  },
  {
    id: "col-3",
    title: "Tamamlananlar",
    cards: []
  }
];