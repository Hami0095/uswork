"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useEffect, useState } from "react"

export default function Settings() {
  const [agencyName, setAgencyName] = useState("Upwork Agency Operator")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading settings from local storage or DB
    const savedName = localStorage.getItem("agencyName")
    if (savedName) setAgencyName(savedName)
    setLoading(false)
  }, [])

  const handleSave = () => {
    localStorage.setItem("agencyName", agencyName)
    toast.success("Settings saved successfully!")
  }

  if (loading) return null

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your agency preferences and interface settings.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>General Information</CardTitle>
            <CardDescription>Basic details about your agency workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agencyName">Agency Name</Label>
              <Input 
                id="agencyName" 
                value={agencyName} 
                onChange={(e) => setAgencyName(e.target.value)} 
                placeholder="e.g. My Agency" 
              />
            </div>
            <Button onClick={handleSave}>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel of the dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Currently using the system default dark theme. Theme switching functionality will be added in a future update.
            </p>
            <div className="flex gap-4 mt-4">
              <div className="flex flex-col gap-2 items-center cursor-pointer">
                <div className="h-20 w-32 rounded-md border-2 border-primary bg-zinc-950 flex items-center justify-center">
                  <span className="text-xs text-zinc-400">Dark</span>
                </div>
                <Label className="text-xs">Dark (Active)</Label>
              </div>
              <div className="flex flex-col gap-2 items-center opacity-50 cursor-not-allowed">
                <div className="h-20 w-32 rounded-md border-2 border-border bg-white flex items-center justify-center">
                  <span className="text-xs text-zinc-500">Light</span>
                </div>
                <Label className="text-xs">Light</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
