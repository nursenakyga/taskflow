// src/app/layout.tsx
import { ClerkProvider, SignInButton, UserButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import './globals.css'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Kullanıcının giriş yapıp yapmadığını doğrudan sunucudan kontrol ediyoruz.
  const { userId } = await auth();

  return (
    <ClerkProvider>
      <html lang="tr">
        <body>
          <header className="flex justify-between items-center p-4 bg-white shadow-sm">
            <h1 className="text-xl font-bold text-blue-600">TaskFlow</h1>
            <div>
              {/* Eğer userId varsa (giriş yapılmışsa) profil butonunu göster */}
              {userId ? (
                <UserButton />
              ) : (
                /* Eğer userId yoksa (giriş yapılmamışsa) Giriş Yap butonunu göster */
                <SignInButton mode="modal">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    Giriş Yap
                  </button>
                </SignInButton>
              )}
            </div>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}