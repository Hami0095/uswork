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
} from "recharts"
import { Briefcase, DollarSign, Target, Zap, Users } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

// Build last-7-days labels
function getLast7Days() {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push({
      name: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: d.toISOString().split("T")[0],
      proposals: 0,
      hired: 0,
    })
  }
  return days
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [recentProposals, setRecentProposals] = useState<any[]>([])
  const [chartData, setChartData] = useState(getLast7Days())
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalProposals: 0,
    totalConnects: 0,
    winRate: 0,
    profileCount: 0,
  })

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    setLoading(true)

    // Fetch all proposals
    const { data: proposals } = await supabase
      .from("Proposal")
      .select("id, jobTitle, status, appliedAt, Profile ( name )")
      .order("appliedAt", { ascending: false })

    // Fetch all profiles for connects + earnings
    const { data: profiles } = await supabase
      .from("Profile")
      .select("connectsBalance, totalEarnings")

    if (proposals) {
      // Recent 5
      setRecentProposals(proposals.slice(0, 5))

      // Chart: count proposals per day for last 7 days
      const days = getLast7Days()
      proposals.forEach((p) => {
        const pDate = p.appliedAt?.split("T")[0]
        const dayEntry = days.find((d) => d.date === pDate)
        if (dayEntry) {
          dayEntry.proposals += 1
          if (p.status === "Hired") dayEntry.hired += 1
        }
      })
      setChartData(days)

      // Win rate = Hired / total proposals
      const hired = proposals.filter((p) => p.status === "Hired").length
      const winRate =
        proposals.length > 0
          ? Math.round((hired / proposals.length) * 100 * 10) / 10
          : 0

      // Aggregate profile stats
      const totalConnects = profiles
        ? profiles.reduce((sum, p) => sum + (p.connectsBalance ?? 0), 0)
        : 0
      const totalEarnings = profiles
        ? profiles.reduce((sum, p) => sum + (p.totalEarnings ?? 0), 0)
        : 0

      setStats({
        totalEarnings,
        totalProposals: proposals.length,
        totalConnects,
        winRate,
        profileCount: profiles?.length ?? 0,
      })
    }

    setLoading(false)
  }

  const fmt = (n: number) =>
    n >= 1000
      ? `$${(n / 1000).toFixed(1)}k`
      : `$${n.toLocaleString()}`

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">
          Track agency performance, connects, and proposals across all profiles.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "—" : fmt(stats.totalEarnings)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {stats.profileCount} profile{stats.profileCount !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proposals Sent</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "—" : stats.totalProposals.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All time, all profiles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connects Remaining</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "—" : stats.totalConnects.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {stats.profileCount} profile{stats.profileCount !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "—" : `${stats.winRate}%`}
            </div>
            <p className="text-xs text-muted-foreground">Proposals → Hired</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart + Recent Proposals */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Proposal Activity</CardTitle>
            <CardDescription>
              Proposals sent and hires in the last 7 days.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
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
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                      backgroundColor: "hsl(var(--background))",
                      color: "#f97316",
                    }}
                    itemStyle={{ color: "#f97316" }}
                    labelStyle={{ color: "#f97316", fontWeight: 600 }}
                  />
                  <Bar
                    dataKey="proposals"
                    name="Proposals"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    activeBar={{ fill: "hsl(var(--primary))", opacity: 0.8 }}
                  />
                  <Bar
                    dataKey="hired"
                    name="Hired"
                    fill="#f97316"
                    radius={[4, 4, 0, 0]}
                    activeBar={{ fill: "#f97316", opacity: 0.8 }}
                  />
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
            <div className="space-y-5 mt-2">
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : recentProposals.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No proposals yet. Head to{" "}
                  <a href="/proposals" className="underline text-primary">
                    Proposals
                  </a>{" "}
                  to log one!
                </p>
              ) : (
                recentProposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-0.5 max-w-[65%]">
                      <p className="text-sm font-medium leading-none truncate">
                        {proposal.jobTitle}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {proposal.Profile?.name || "Unknown Profile"}
                      </p>
                    </div>
                    <Badge
                      variant={
                        proposal.status === "Hired"
                          ? "default"
                          : proposal.status === "Interview"
                          ? "secondary"
                          : proposal.status === "Rejected"
                          ? "destructive"
                          : "outline"
                      }
                    >
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
