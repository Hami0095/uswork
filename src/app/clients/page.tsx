"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Trash2, Edit } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

export default function Clients() {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ id: null, name: '', company: '', country: '' })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    const { data } = await supabase.from('Client').select('*').order('createdAt', { ascending: false })
    if (data) setClients(data)
    setLoading(false)
  }

  const handleOpenModal = (client?: any) => {
    if (client) {
      setFormData({
        id: client.id,
        name: client.name,
        company: client.company || '',
        country: client.country || '',
      })
    } else {
      setFormData({ id: null, name: '', company: '', country: '' })
    }
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    if (formData.id) {
      await supabase.from('Client').update({
        name: formData.name,
        company: formData.company,
        country: formData.country,
      }).eq('id', formData.id)
    } else {
      await supabase.from('Client').insert({
        name: formData.name,
        company: formData.company,
        country: formData.country,
      })
    }
    setIsModalOpen(false)
    fetchData()
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this client?")) {
      await supabase.from('Client').delete().eq('id', id)
      fetchData()
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients Directory</h1>
          <p className="text-muted-foreground mt-1">Manage external clients and company associations.</p>
        </div>
        <Button onClick={() => handleOpenModal()}><Plus className="w-4 h-4 mr-2" /> Add Client</Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{formData.id ? 'Edit Client' : 'Add New Client'}</DialogTitle>
            <DialogDescription>
              {formData.id ? 'Update client details.' : 'Enter details for the new client.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" className="col-span-3" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">Company</Label>
              <Input id="company" className="col-span-3" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="country" className="text-right">Country</Label>
              <Input id="country" className="col-span-3" value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>All Clients</CardTitle>
          <CardDescription>Directory of all clients you've interacted with.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Company</th>
                  <th className="px-6 py-3 font-medium">Country</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="px-6 py-4 text-center text-muted-foreground">Loading...</td></tr>
                ) : clients.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-4 text-center text-muted-foreground">No clients found.</td></tr>
                ) : (
                  clients.map((client) => (
                    <tr key={client.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{client.name}</td>
                      <td className="px-6 py-4 text-muted-foreground">{client.company || '-'}</td>
                      <td className="px-6 py-4 text-muted-foreground">{client.country || '-'}</td>
                      <td className="px-6 py-4 text-right space-x-2 flex justify-end">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenModal(client)}>
                          <Edit className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(client.id)}>
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
