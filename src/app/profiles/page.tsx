"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Users, Plus, Edit, Trash2, Zap } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

const AVAILABILITY_OPTIONS = ["Available", "Busy", "Unavailable"]

const emptyForm = {
  id: null as string | null,
  name: "",
  niche: "",
  hourlyRate: 0,
  skills: "",
  connectsBalance: 0,
  successRate: null as number | null,
  activeContracts: 0,
  totalEarnings: 0,
  availability: "Available",
}

export default function Profiles() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState(emptyForm)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    const { data, error } = await supabase
      .from("Profile")
      .select("*")
      .order("createdAt", { ascending: false })
    if (data) setProfiles(data)
    setLoading(false)
  }

  const handleOpenModal = (profile?: any) => {
    if (profile) {
      setFormData({
        id: profile.id,
        name: profile.name,
        niche: profile.niche,
        hourlyRate: profile.hourlyRate,
        skills: Array.isArray(profile.skills) ? profile.skills.join(", ") : profile.skills || "",
        connectsBalance: profile.connectsBalance,
        successRate: profile.successRate ?? null,
        activeContracts: profile.activeContracts,
        totalEarnings: profile.totalEarnings,
        availability: profile.availability,
      })
    } else {
      setFormData(emptyForm)
    }
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    const payload = {
      name: formData.name,
      niche: formData.niche,
      hourlyRate: Number(formData.hourlyRate),
      skills: formData.skills
        ? formData.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      connectsBalance: Number(formData.connectsBalance),
      successRate: formData.successRate !== null ? Number(formData.successRate) : null,
      activeContracts: Number(formData.activeContracts),
      totalEarnings: Number(formData.totalEarnings),
      availability: formData.availability,
    }

    if (formData.id) {
      await supabase.from("Profile").update(payload).eq("id", formData.id)
    } else {
      await supabase.from("Profile").insert(payload)
    }
    setIsModalOpen(false)
    fetchData()
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this profile? This may also affect proposals linked to it.")) {
      await supabase.from("Profile").delete().eq("id", id)
      fetchData()
    }
  }

  const availabilityColor = (status: string) => {
    if (status === "Available") return "default"
    if (status === "Busy") return "secondary"
    return "destructive"
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Managed Profiles</h1>
          <p className="text-muted-foreground mt-1">
            Manage and optimize your agency's Upwork freelancer profiles.
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" /> Add Profile
        </Button>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{formData.id ? "Edit Profile" : "Add New Profile"}</DialogTitle>
            <DialogDescription>
              {formData.id
                ? "Update the details for this freelancer profile."
                : "Enter the details of the new Upwork freelancer profile."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2 grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Full Name</Label>
              <Input
                id="name"
                className="col-span-3"
                placeholder="e.g. Alice Carter"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="col-span-2 grid grid-cols-4 items-center gap-4">
              <Label htmlFor="niche" className="text-right">Niche</Label>
              <Input
                id="niche"
                className="col-span-3"
                placeholder="e.g. Full Stack Development"
                value={formData.niche}
                onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
              />
            </div>

            <div className="col-span-2 grid grid-cols-4 items-center gap-4">
              <Label htmlFor="skills" className="text-right">Skills</Label>
              <Input
                id="skills"
                className="col-span-3"
                placeholder="React, Node.js, TypeScript (comma-separated)"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              />
            </div>

            <div className="col-span-1 grid grid-cols-2 items-center gap-4">
              <Label htmlFor="rate" className="text-right">Hourly Rate ($)</Label>
              <Input
                id="rate"
                type="number"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: +e.target.value })}
              />
            </div>

            <div className="col-span-1 grid grid-cols-2 items-center gap-4">
              <Label htmlFor="connects" className="text-right">Connects</Label>
              <Input
                id="connects"
                type="number"
                value={formData.connectsBalance}
                onChange={(e) => setFormData({ ...formData, connectsBalance: +e.target.value })}
              />
            </div>

            <div className="col-span-1 grid grid-cols-2 items-center gap-4">
              <Label htmlFor="jss" className="text-right">JSS (%)</Label>
              <Input
                id="jss"
                type="number"
                placeholder="e.g. 94"
                value={formData.successRate ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    successRate: e.target.value === "" ? null : +e.target.value,
                  })
                }
              />
            </div>

            <div className="col-span-1 grid grid-cols-2 items-center gap-4">
              <Label htmlFor="contracts" className="text-right">Active Contracts</Label>
              <Input
                id="contracts"
                type="number"
                value={formData.activeContracts}
                onChange={(e) => setFormData({ ...formData, activeContracts: +e.target.value })}
              />
            </div>

            <div className="col-span-1 grid grid-cols-2 items-center gap-4">
              <Label htmlFor="earnings" className="text-right">Total Earnings ($)</Label>
              <Input
                id="earnings"
                type="number"
                value={formData.totalEarnings}
                onChange={(e) => setFormData({ ...formData, totalEarnings: +e.target.value })}
              />
            </div>

            <div className="col-span-1 grid grid-cols-2 items-center gap-4">
              <Label htmlFor="avail" className="text-right">Availability</Label>
              <select
                id="avail"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              >
                {AVAILABILITY_OPTIONS.map((o) => (
                  <option key={o} value={o} className="bg-background text-foreground">{o}</option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Profile</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Grid */}
      {loading ? (
        <div className="text-center text-muted-foreground py-16">Loading profiles...</div>
      ) : profiles.length === 0 ? (
        <div className="text-center text-muted-foreground py-16 border rounded-lg border-dashed">
          No profiles yet. Click <strong>Add Profile</strong> to get started!
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => (
            <Card
              key={profile.id}
              className="relative overflow-hidden group hover:border-foreground/30 transition-all"
            >
              {/* Action Buttons — revealed on hover */}
              <div className="absolute right-3 top-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleOpenModal(profile)}
                >
                  <Edit className="w-3.5 h-3.5 text-muted-foreground" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleDelete(profile.id)}
                >
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </Button>
              </div>

              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-foreground" />
                  </div>
                  <Badge variant={availabilityColor(profile.availability) as any} className="text-[10px]">
                    {profile.availability}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{profile.name}</CardTitle>
                <CardDescription className="text-sm font-medium">{profile.niche}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-muted-foreground text-xs mb-0.5">Hourly Rate</p>
                    <p className="font-semibold">${profile.hourlyRate}/hr</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-0.5">JSS</p>
                    <p className="font-semibold text-primary">
                      {profile.successRate != null ? `${profile.successRate}%` : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-0.5">Active</p>
                    <p className="font-semibold">{profile.activeContracts} contracts</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-0.5">Connects</p>
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-muted-foreground" />
                      <p className="font-semibold">{profile.connectsBalance}</p>
                      {profile.connectsBalance < 20 && (
                        <Badge variant="destructive" className="h-4 px-1 text-[10px]">Low</Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Skills */}
                {Array.isArray(profile.skills) && profile.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border/50">
                    {profile.skills.slice(0, 4).map((skill: string) => (
                      <Badge key={skill} variant="outline" className="text-[10px] h-5 px-1.5">
                        {skill}
                      </Badge>
                    ))}
                    {profile.skills.length > 4 && (
                      <Badge variant="outline" className="text-[10px] h-5 px-1.5">
                        +{profile.skills.length - 4} more
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
