import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react"

const connectLogs = [
  { id: 1, action: "Proposal Submitted", job: "Senior React Developer", amount: -16, profile: "Alice V.", date: "May 24, 2026" },
  { id: 2, action: "Monthly Free Connects", job: "System", amount: +10, profile: "Bob M.", date: "May 23, 2026" },
  { id: 3, action: "Proposal Submitted", job: "Shopify Theme Customization", amount: -8, profile: "Bob M.", date: "May 23, 2026" },
  { id: 4, action: "Bought Connects", job: "System", amount: +150, profile: "Diana P.", date: "May 21, 2026" },
  { id: 5, action: "Proposal Submitted", job: "Figma to Next.js", amount: -12, profile: "Charlie D.", date: "May 21, 2026" },
]

export default function Connects() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Connects Manager</h1>
          <p className="text-muted-foreground mt-1">Track connects usage, forecast burn rates, and analyze ROI.</p>
        </div>
        <Button>Buy Connects</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,204</div>
            <p className="text-xs text-muted-foreground">-142 connects this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connects ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$37.50</div>
            <p className="text-xs text-muted-foreground">Revenue per connect spent</p>
          </CardContent>
        </Card>
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-destructive">Low Balance Warning</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">Diana P.</div>
            <p className="text-xs text-destructive/80">Only 80 connects remaining</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Detailed log of connects spent and earned.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mt-2">
            {connectLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${log.amount > 0 ? 'bg-secondary' : 'bg-muted'}`}>
                    {log.amount > 0 ? <TrendingUp className="w-5 h-5 text-foreground" /> : <TrendingDown className="w-5 h-5 text-muted-foreground" />}
                  </div>
                  <div>
                    <p className="font-medium">{log.action}</p>
                    <p className="text-sm text-muted-foreground">{log.job} • {log.profile}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${log.amount > 0 ? 'text-primary' : ''}`}>
                    {log.amount > 0 ? '+' : ''}{log.amount}
                  </p>
                  <p className="text-xs text-muted-foreground">{log.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
