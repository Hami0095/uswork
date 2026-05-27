"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Filter, Trash2, Edit } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

export default function Proposals() {
  const [proposals, setProposals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ id: null, jobTitle: '', connectsSpent: 0, status: 'Applied', profileId: '' })
  const [profiles, setProfiles] = useState<any[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    const { data: propsData } = await supabase
      .from('Proposal')
      .select(`
        id,
        jobTitle,
        status,
        connectsSpent,
        appliedAt,
        profileId,
        Profile ( name )
      `)
      .order('appliedAt', { ascending: false })

    const { data: profsData } = await supabase.from('Profile').select('id, name')

    if (propsData) setProposals(propsData)
    if (profsData) setProfiles(profsData)
    setLoading(false)
  }

  const handleOpenModal = (proposal?: any) => {
    if (proposal) {
      setFormData({
        id: proposal.id,
        jobTitle: proposal.jobTitle,
        connectsSpent: proposal.connectsSpent,
        status: proposal.status,
        profileId: proposal.profileId,
      })
    } else {
      setFormData({ id: null, jobTitle: '', connectsSpent: 0, status: 'Applied', profileId: profiles.length > 0 ? profiles[0].id : '' })
    }
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    if (formData.id) {
      // Update
      await supabase.from('Proposal').update({
        jobTitle: formData.jobTitle,
        connectsSpent: formData.connectsSpent,
        status: formData.status,
        profileId: formData.profileId,
      }).eq('id', formData.id)
    } else {
      // Create
      await supabase.from('Proposal').insert({
        jobTitle: formData.jobTitle,
        connectsSpent: formData.connectsSpent,
        status: formData.status,
        profileId: formData.profileId,
      })
    }
    setIsModalOpen(false)
    fetchData()
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this proposal?")) {
      await supabase.from('Proposal').delete().eq('id', id)
      fetchData()
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Proposal Tracking</h1>
          <p className="text-muted-foreground mt-1">Manage and track all Upwork applications across the agency.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
          <Button onClick={() => handleOpenModal()}><Plus className="w-4 h-4 mr-2" /> Log Proposal</Button>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{formData.id ? 'Edit Proposal' : 'Log New Proposal'}</DialogTitle>
            <DialogDescription>
              {formData.id ? 'Update the status or details of the application.' : 'Enter the details of your new Upwork application.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="jobTitle" className="text-right">Job Title</Label>
              <Input id="jobTitle" className="col-span-3" value={formData.jobTitle} onChange={(e) => setFormData({...formData, jobTitle: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="profile" className="text-right">Profile</Label>
              <select 
                id="profile" 
                className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                value={formData.profileId} 
                onChange={(e) => setFormData({...formData, profileId: e.target.value})}
              >
                {profiles.map(p => <option key={p.id} value={p.id} className="bg-background text-foreground">{p.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Status</Label>
              <select 
                id="status" 
                className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                value={formData.status} 
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="Applied" className="bg-background text-foreground">Applied</option>
                <option value="Viewed" className="bg-background text-foreground">Viewed</option>
                <option value="Interview" className="bg-background text-foreground">Interview</option>
                <option value="Hired" className="bg-background text-foreground">Hired</option>
                <option value="Rejected" className="bg-background text-foreground">Rejected</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="connects" className="text-right">Connects</Label>
              <Input id="connects" type="number" className="col-span-3" value={formData.connectsSpent} onChange={(e) => setFormData({...formData, connectsSpent: parseInt(e.target.value) || 0})} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>A comprehensive list of all active and past proposals.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 font-medium">Job Title</th>
                  <th className="px-6 py-3 font-medium">Profile Used</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Connects</th>
                  <th className="px-6 py-3 font-medium text-right">Date</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-4 text-center text-muted-foreground">Loading...</td></tr>
                ) : proposals.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-4 text-center text-muted-foreground">No proposals found.</td></tr>
                ) : (
                  proposals.map((proposal) => (
                    <tr key={proposal.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{proposal.jobTitle}</td>
                      <td className="px-6 py-4">{proposal.Profile?.name || 'Unknown'}</td>
                      <td className="px-6 py-4">
                        <Badge variant={
                          proposal.status === 'Hired' ? 'default' : 
                          proposal.status === 'Interview' ? 'secondary' : 
                          proposal.status === 'Rejected' ? 'destructive' : 'outline'
                        }>
                          {proposal.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right font-medium">{proposal.connectsSpent}</td>
                      <td className="px-6 py-4 text-right text-muted-foreground">{new Date(proposal.appliedAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right space-x-2 flex justify-end">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenModal(proposal)}>
                          <Edit className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(proposal.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
