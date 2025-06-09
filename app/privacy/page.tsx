import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>
            <p className="text-muted-foreground">
              UltraXas Store is committed to protecting your privacy. We collect minimal information necessary to
              provide our services, including app usage statistics and crash reports to improve user experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">How We Use Your Information</h2>
            <p className="text-muted-foreground">
              We use collected information solely to improve our services, provide app recommendations, and ensure the
              security of our platform. We never sell or share personal data with third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Data Storage</h2>
            <p className="text-muted-foreground">
              All data is stored securely using industry-standard encryption. App files are stored locally on your
              device and in our secure cloud storage for backup purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Contact</h2>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy, please contact us at privacy@ultraxas.com or through
              our GitHub repository.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}
