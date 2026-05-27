"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts"
import { Briefcase, DollarSign, Target, Zap } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

const data = [
  { name: "Mon", proposals: 4, interviews: 1 },
  { name: "Tue", proposals: 7, interviews: 2 },
  { name: "Wed", proposals: 5, interviews: 0 },
  { name: "Thu", proposals: 8, interviews: 3 },
  { name: "Fri", proposals: 12, interviews: 4 },
  { name: "Sat", proposals: 2, interviews: 0 },
  { name: "Sun", proposals: 3, interviews: 1 },
]

export default function Dashboard() {
  const [recentProposals, setRecentProposals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data: proposals, error } = await supabase
        .from('Proposal')
        .select(`
          id,
          jobTitle,
          status,
          Profile ( name )
        `)
        .order('appliedAt', { ascending: false })
        .limit(5)
      
      if (!error && proposals) {
        setRecentProposals(proposals)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Track agency performance, connects, and proposals across all profiles.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proposals Sent</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">+180 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connects Remaining</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,204</div>
            <p className="text-xs text-muted-foreground">Across 5 profiles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.4%</div>
            <p className="text-xs text-muted-foreground">+2.4% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Proposal Activity</CardTitle>
            <CardDescription>Proposals sent and interviews landed over the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `${value}`} 
                  />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: '1px solid hsl(var(--border))', 
                      backgroundColor: 'hsl(var(--background))',
                      color: 'hsl(var(--foreground))'
                    }} 
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Bar dataKey="proposals" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} activeBar={{ fill: 'hsl(var(--primary))', opacity: 0.8 }} />
                  <Bar dataKey="interviews" fill="hsl(var(--ring))" radius={[4, 4, 0, 0]} activeBar={{ fill: 'hsl(var(--ring))', opacity: 0.8 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Proposals</CardTitle>
            <CardDescription>Latest agency applications.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 mt-4">
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading proposals...</p>
              ) : recentProposals.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent proposals found.</p>
              ) : (
                recentProposals.map((proposal) => (
                  <div key={proposal.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{proposal.jobTitle}</p>
                      <p className="text-xs text-muted-foreground">{proposal.Profile?.name || 'Unknown Profile'}</p>
                    </div>
                    <Badge variant={
                      proposal.status === 'Hired' ? 'default' : 
                      proposal.status === 'Interview' ? 'secondary' : 
                      proposal.status === 'Rejected' ? 'destructive' : 'outline'
                    }>
                      {proposal.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
