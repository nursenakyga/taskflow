// src/app/page.tsx
import Board from "@/components/Board";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  // 1. Giriş yapan kullanıcının ID'sini Clerk'ten alıyoruz
  const { userId } = await auth();

  // Güvenlik önlemi: Kullanıcı yoksa giriş sayfasına yönlendir
  if (!userId) {
    redirect("/");
  }

  // 2. Veritabanından sadece bu kullanıcıya ait olan Board'u çekiyoruz
  let board = await db.board.findFirst({
    where: { 
      userId: userId 
    },
    include: {
      columns: {
        orderBy: { position: 'asc' },
        include: {
          cards: {
            orderBy: { position: 'asc' }
          }
        }
      }
    }
  });

  // 3. Eğer kullanıcının henüz bir tahtası yoksa, ona özel ilk verileri oluşturuyoruz.
  if (!board) {
    board = await db.board.create({
      data: {
        title: "Kişisel Çalışma Tahtam",
        userId: userId, 
        columns: {
          create: [
            {
              title: "Yapılacaklar",
              position: 1000,
              cards: {
                create: [
                  { title: "Projeyi Canlıya Al", description: "Vercel deploy işlemi", position: 1000 },
                  { title: "Mülakata Hazırlan", description: "Mimari kararları gözden geçir", position: 2000 }
                ]
              }
            },
            { title: "Devam Edenler", position: 2000 },
            { title: "Tamamlananlar", position: 3000 }
          ]
        }
      },
      include: {
        columns: {
          include: { cards: true }
        }
      }
    });
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">{board.title}</h1>
        <Board initialData={board.columns} />
      </div>
    </main>
  );
}