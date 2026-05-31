import Link from "next/link"
import { Wheat, Croissant, Heart, Clock, MapPin, ShoppingBag } from "lucide-react"

import { Header } from "@/components/header"
import { AnimatedHeart } from "@/components/animated-heart"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const products = [
  {
    icon: Wheat,
    title: "לחם מחמצת",
    description: "מחמצת אם בת שלוש שנים, קמח מלא טחון בריחיים, שעות ארוכות של תפיחה איטית.",
    price: "₪32",
    badge: "הכי נמכר",
  },
  {
    icon: Heart,
    title: "חלות שבת",
    description: "חלות קלועות בעבודת יד, רכות מבפנים, פריכות מבחוץ. אופות בכל יום חמישי בלבד.",
    price: "₪28",
    badge: "ערב שבת",
  },
  {
    icon: Croissant,
    title: "מאפים מתוקים",
    description: "קרואסונים, רוגלך שוקולד, ובורקסים מתוקים. נאפים טריים כל בוקר בשש.",
    price: "₪12-18",
    badge: null,
  },
]

export default function Page() {
  return (
    <div className="bg-background text-foreground min-h-svh">
      <Header />

      <main>
        <section className="mx-auto max-w-6xl px-6 py-20" dir="rtl">
          <div className="mb-4 flex items-center justify-center gap-2">
            <AnimatedHeart />
            <span className="text-sm">נאפה באהבה כל בוקר</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-center">
            לחם בייתי כמו פעם,<br />
            רק שאמא אופה אותו
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 text-center">
            מאפייה ביתית קטנה בלב השכונה. מחמצת טבעית, קמח מלא וזמן, בלי קיצורי דרך,<br />
            בלי תוספות, רק מה שאמא הייתה שמה.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button render={<Link href="/menu" />} size="lg">
              להזמין עכשיו
              <ShoppingBag className="size-4 ms-2" />
            </Button>
            <Button render={<Link href="/menu" />} variant="outline" size="lg">
              לתפריט המלא
            </Button>
          </div>
        </section>

        <Separator className="mx-auto max-w-6xl" />

        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              מה אופים השבוע
            </h2>
            <p className="text-muted-foreground mt-3">
              שלושה דברים בלבד. כל אחד מהם — באהבה.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const Icon = product.icon
              return (
                <Card key={product.title} className="flex flex-col">
                  <CardHeader>
                    <div className="mb-3 flex items-center justify-between">
                      <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-lg">
                        <Icon className="size-6" />
                      </div>
                      {product.badge && (
                        <Badge variant="secondary">{product.badge}</Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl">{product.title}</CardTitle>
                    <CardDescription className="leading-relaxed">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto flex items-center justify-between">
                    <span className="text-2xl font-semibold">{product.price}</span>
                    <Button render={<Link href="/menu" />} variant="ghost" size="sm">
                      להזמנה
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        <Separator className="mx-auto max-w-6xl" />

        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 text-primary flex size-12 shrink-0 items-center justify-center rounded-lg">
                <Clock className="size-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">שעות פעילות</h3>
                <p className="text-muted-foreground mt-1">
                  ראשון–חמישי: 07:00–14:00
                  <br />
                  שישי: 06:00–13:00
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 text-primary flex size-12 shrink-0 items-center justify-center rounded-lg">
                <MapPin className="size-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">איפה למצוא אותנו</h3>
                <p className="text-muted-foreground mt-1">
                  איסוף עצמי מהבית, או משלוחים בתל אביב והסביבה.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-border/40 border-t">
        <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 py-8 text-sm sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} לחם של אמא. כל הזכויות שמורות.</p>
          <p className="font-mono text-xs">
            לחץ <kbd className="bg-muted rounded px-1.5 py-0.5">d</kbd> למצב כהה
          </p>
        </div>
      </footer>
    </div>
  )
}
