import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import TextType from '@/components/TextType'

export default function AboutUsPage() {
  return (
    <div
      className="relative min-h-[100vh]"
      style={{
        backgroundImage: "url('/images/toroto.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/15 to-white/20" />

      <div className="relative z-[1] mx-auto max-w-5xl px-4 py-12 md:py-16">
        <div className="mb-8 text-center">
          <TextType 
            as="h1"
            text={["About Moltres", "Welcome to Moltres", "Your Gaming Marketplace"]}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="|"
            className="text-3xl font-bold tracking-tight md:text-4xl"
          />
          <TextType 
            as="p"
            text={["A social marketplace for console gamers to buy, sell, and connect.", "Connect with gamers worldwide.", "Trade your favorite games safely."]}
            typingSpeed={50}
            pauseDuration={2000}
            showCursor={true}
            cursorCharacter="|"
            className="text-muted-foreground mx-auto mt-3 max-w-2xl text-base md:text-lg"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="backdrop-blur border-muted/60 bg-white/80">
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
              <CardDescription>
                Building a safe, utility-first platform for the gaming community.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm md:text-base leading-7">
              <p>
                <strong>Moltres</strong> connects gamers and enables safe trading of pre-owned
                PlayStation and Xbox titles while fostering real community.
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur border-muted/60 bg-white/80">
            <CardHeader>
              <CardTitle>Why Choose Moltres?</CardTitle>
              <CardDescription>Made for gamers, built for trust.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm md:text-base space-y-3 leading-7">
                <li>• Location-based discovery for real connections</li>
                <li>• Secure trading and user verification</li>
                <li>• Community-driven features with messaging and wishlists ahead</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 backdrop-blur border-muted/60 bg-white/80">
          <CardHeader>
            <CardTitle>What We Do</CardTitle>
            <CardDescription>Tools and features that help you trade smarter</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm md:text-base space-y-3 leading-7">
              <li>• Buy and sell used PS/Xbox titles with nearby gamers</li>
              <li>• Discover sellers and players via map-based search</li>
              <li>• Match with teammates by shared interests</li>
              <li>• Grow a vibrant, trustworthy gaming community</li>
            </ul>
            <p className="mt-4 text-sm md:text-base">
              Whether you are hunting your next favorite game or building a team, Moltres is here to
              help you make it happen.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}