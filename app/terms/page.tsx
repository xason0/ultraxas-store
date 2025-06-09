import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By using UltraXas Store, you agree to these terms of service. If you do not agree to these terms, please
              do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Use of Service</h2>
            <p className="text-muted-foreground">
              UltraXas Store provides a platform for downloading and managing Android applications. Users are
              responsible for ensuring they have the right to download and use any applications.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">User Responsibilities</h2>
            <p className="text-muted-foreground">
              Users must not upload malicious software, violate copyright laws, or use the service for illegal
              activities. We reserve the right to remove content and ban users who violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Disclaimer</h2>
            <p className="text-muted-foreground">
              UltraXas Store is provided "as is" without warranties. We are not responsible for any damages resulting
              from the use of applications downloaded through our platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Contact</h2>
            <p className="text-muted-foreground">
              For questions about these terms, contact us at legal@ultraxas.com or through our GitHub repository.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}
