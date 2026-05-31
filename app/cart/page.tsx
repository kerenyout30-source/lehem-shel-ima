import Link from "next/link"

import { Header } from "@/components/header"
import { CartItems, CartTotal } from "@/components/cart/cart-items"
import { CheckoutForm } from "@/components/cart/checkout-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth"

export default async function CartPage() {
  const user = await getCurrentUser()

  return (
    <div className="bg-background text-foreground min-h-svh">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="mb-8 text-3xl font-bold tracking-tight">הסל שלי</h1>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>הפריטים בסל</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <CartItems />
              <CartTotal />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>פרטי הזמנה</CardTitle>
              {!user && (
                <p className="text-muted-foreground mt-2 text-sm">
                  * אתה יכול להזמין ללא חשבון. אם תרצה, תוכל ליצור חשבון אחרי ההזמנה
                </p>
              )}
            </CardHeader>
            <CardContent>
              <CheckoutForm
                defaultName={user?.profile?.full_name ?? ""}
                defaultPhone={user?.profile?.phone ?? ""}
                defaultEmail={user?.email ?? ""}
              />
            </CardContent>
          </Card>

          {!user && (
            <Card>
              <CardHeader>
                <CardTitle>יש לך כבר חשבון?</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className="text-muted-foreground text-sm">
                  התחבר כדי לראות את ההזמנות שלך בהיסטוריית ההזמנות
                </p>
                <div className="flex gap-2">
                  <Button render={<Link href="/login?next=/cart" />}>
                    התחברות
                  </Button>
                  <Button
                    render={<Link href="/signup?next=/cart" />}
                    variant="outline"
                  >
                    הרשמה חדשה
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
