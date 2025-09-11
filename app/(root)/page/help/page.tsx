import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function HelpPage() {
  return (
    <div
      className="relative min-h-[100vh]"
      style={{
        backgroundImage: "url('/images/noice.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/15 to-white/20" />

      <div className="relative z-[1] mx-auto max-w-4xl px-4 py-12 md:py-16">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/icons/Adobe Express - file.png"
            alt="App icon"
            width={64}
            height={64}
            className="mb-2"
          />
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Help & FAQs</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-base md:text-lg">
            Find answers to common questions or reach out for support.
          </p>
        </div>

        <Card className="backdrop-blur border-muted/60 bg-white/80">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Quick answers to get you moving</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm leading-7 md:text-base">
              <li>
                <strong>How do I add a product?</strong>
                <br />
                Go to{' '}
                <Link className="text-primary underline underline-offset-4" href="/product/add">
                  Add Product
                </Link>{' '}
                and fill out the form.
              </li>
              <li>
                <strong>How can I see my listed products?</strong>
                <br />
                Visit{' '}
                <Link className="text-primary underline underline-offset-4" href="/your-products">
                  Your Products
                </Link>{' '}
                to view your listings.
              </li>
              <li>
                <strong>What if I receive a wrong or fake product?</strong>
                <br />
                Contact{' '}
                <Link className="text-primary underline underline-offset-4" href="mailto:sameer754811@gmail.com">
                  Customer Service
                </Link>{' '}
                immediately with details and evidence.
              </li>
              <li>
                <strong>How do I reset my password?</strong>
                <br />
                Use the password reset link on the sign-in page or contact support.
              </li>
              <li>
                <strong>How long does it take to get a response?</strong>
                <br />
                We respond to all queries within 24 hours.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6 backdrop-blur border-muted/60 bg-white/80">
          <CardHeader>
            <CardTitle>Still need help?</CardTitle>
            <CardDescription>Reach our support team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button asChild>
                <Link href="mailto:sameer754811@gmail.com">Email Support</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="tel:8630900119">Call Support</Link>
              </Button>
            </div>
            <p className="text-muted-foreground mt-3 text-center text-sm">
              We&apos;re here to support you!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 