# TaskFlow — Kanban Proje Yönetim Tahtası

TaskFlow, ekiplerin görevlerini sürükle-bırak (drag-and-drop) mantığıyla yönetebildiği, modern ve performans odaklı bir proje yönetim aracıdır.

## 🚀 Canlı Önizleme
[TaskFlow Uygulamasını İnceleyin](https://taskflow-pi-virid.vercel.app)

## 🛠️ Kullanılan Teknolojiler
* **Framework:** Next.js (App Router)
* **Veritabanı & ORM:** Supabase (PostgreSQL) & Prisma ORM
* **Kimlik Doğrulama:** Clerk
* **Sürükle-Bırak:** @dnd-kit/core
* **Stil:** Tailwind CSS

## 🧠 Mimari Kararlar ve Yaklaşımlar

* **Neden `dnd-kit` Seçildi?**
  Modern, modüler, hafif olması ve dokunmatik cihazlar (mobil sensörler) için sunduğu harika destek nedeniyle tercih edilmiştir. Bakımı durdurulan `react-beautiful-dnd` yerine güncel ve React ekosistemiyle tam uyumlu bir çözümdür.
* **Sıralama (Sorting) Algoritması:**
  Kartların sırası değiştirildiğinde tüm veritabanını güncellemek yerine, performans maliyetini minimuma indiren **Lexicographical Indexing** (İki kartın pozisyon değerinin ortalamasını alma) mantığı kullanılmıştır. Bu sayede sayfa yenilendiğinde bile sıralama kusursuz korunur.
* **Optimistic UI (İyimser Arayüz):**
  Kullanıcı deneyimini akıcı tutmak için, sürükle-bırak işlemi yapıldığında kart anında ekranda yeni konumuna geçer, veritabanı (Supabase) güncellemeleri arka planda sessizce yürütülür.
* **Mobil Uyumluluk:**
  Mobil cihazlarda sayfa kaydırma işlemi ile kart sürükleme işleminin çakışmaması için özel bir `TouchSensor` yapılandırması (250ms gecikme) eklenmiştir.

## ⚙️ Kurulum (Yerel Geliştirme İçin)

1. Repoyu klonlayın: `git clone https://github.com/KULLANICI_ADIN/taskflow.git`
2. Paketleri yükleyin: `npm install`
3. `.env` dosyasını oluşturup gerekli Clerk ve Supabase değişkenlerini ekleyin.
4. Veritabanını eşitleyin: `npx prisma db push`
5. Projeyi başlatın: `npm run dev`