'use client'

import { useState } from 'react'
import {
  BYBCounter,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Slider,
} from '@beforeyoubid/design-system'

/**
 * Placeholder for the savings-calculator POC (roadmap action 5.4).
 * Exists to prove the workspace:* consumption path end to end:
 * tokens → globals.css → components → a real Next.js page.
 */
export default function Home() {
  const [reports, setReports] = useState(3)
  const savingsPerReport = 60
  const savings = reports * savingsPerReport

  return (
    <main className="mx-auto max-w-site p-section-sm">
      <h1 className="text-heading-lg tracking-heading text-navy">BYB savings calculator</h1>
      <p className="mt-2 text-body-md text-muted-foreground">
        Demo surface — consumes <code>@beforeyoubid/design-system</code> via <code>workspace:*</code>.
      </p>

      <Card className="mt-8 max-w-md">
        <CardHeader>
          <CardTitle>Estimate your savings</CardTitle>
          <CardDescription>Shared reports mean one inspection, many buyers.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div>
            <div className="mb-3 flex justify-between text-body-sm text-muted-foreground">
              <span>Reports purchased</span>
              <span className="font-semibold text-foreground">{reports}</span>
            </div>
            <Slider
              value={reports}
              onValueChange={(value) => setReports(Array.isArray(value) ? value[0] : value)}
              min={1}
              max={10}
              step={1}
            />
          </div>
          <div className="rounded-md bg-mint-l3 p-4 text-center">
            <span className="text-body-sm text-mint-90">You could save</span>
            <BYBCounter variant="white" value={`$${savings}`} label="vs individual inspections" />
          </div>
          <Button variant="lime" size="lg">
            Get started
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
