import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Edit, Users, Briefcase, Zap } from "lucide-react"

const activities = [
  { id: 1, type: "proposal", text: "Alice V. submitted a proposal for 'Full-Stack Next.js Developer'.", time: "2 hours ago", icon: Briefcase },
  { id: 2, type: "profile", text: "Manager updated Bob M.'s hourly rate to $50/hr.", time: "5 hours ago", icon: Users },
  { id: 3, type: "connects", text: "Agency purchased 150 connects.", time: "1 day ago", icon: Zap },
  { id: 4, type: "system", text: "AI Insights generated new optimization recommendation for 'Diana P.'", time: "1 day ago", icon: Activity },
  { id: 5, type: "template", text: "Charlie D. updated the 'Figma to React Base' template.", time: "2 days ago", icon: Edit },
]

export default function ActivityLogs() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
        <p className="text-muted-foreground mt-1">Audit trail of all actions across the agency platform.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="relative border-l border-border ml-3 space-y-8">
            {activities.map((activity) => (
              <div key={activity.id} className="relative pl-6">
                <span className="absolute -left-3.5 top-1 w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center">
                  <activity.icon className="w-3.5 h-3.5 text-muted-foreground" />
                </span>
                <div>
                  <p className="text-sm font-medium">{activity.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
