"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileText, Plus, Star, Copy, Edit2, Trash2 } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

export default function Templates() {
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ id: null, title: '', category: '', content: '', isFavorite: false })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    const { data } = await supabase.from('Template').select('*').order('createdAt', { ascending: false })
    if (data) setTemplates(data)
    setLoading(false)
  }

  const handleOpenModal = (template?: any) => {
    if (template) {
      setFormData({
        id: template.id,
        title: template.title,
        category: template.category,
        content: template.content,
        isFavorite: template.isFavorite,
      })
    } else {
      setFormData({ id: null, title: '', category: '', content: '', isFavorite: false })
    }
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    if (formData.id) {
      // Update
      await supabase.from('Template').update({
        title: formData.title,
        category: formData.category,
        content: formData.content,
        isFavorite: formData.isFavorite,
      }).eq('id', formData.id)
    } else {
      // Create
      await supabase.from('Template').insert({
        title: formData.title,
        category: formData.category,
        content: formData.content,
        isFavorite: formData.isFavorite,
      })
    }
    setIsModalOpen(false)
    fetchData()
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      await supabase.from('Template').delete().eq('id', id)
      fetchData()
    }
  }

  const toggleFavorite = async (id: string, currentStatus: boolean) => {
    await supabase.from('Template').update({ isFavorite: !currentStatus }).eq('id', id)
    fetchData()
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Proposal Templates</h1>
          <p className="text-muted-foreground mt-1">Manage reusable templates, analyze their conversion rates, and use AI to optimize.</p>
        </div>
        <Button onClick={() => handleOpenModal()}><Plus className="w-4 h-4 mr-2" /> New Template</Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{formData.id ? 'Edit Template' : 'Create Template'}</DialogTitle>
            <DialogDescription>
              {formData.id ? 'Modify your existing proposal template.' : 'Create a new reusable proposal template.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="e.g. Standard React Proposal" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" placeholder="e.g. Web Development" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea id="content" placeholder="Hi [Client], I can help you with..." className="min-h-[200px]" value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isFavorite" checked={formData.isFavorite} onChange={(e) => setFormData({...formData, isFavorite: e.target.checked})} className="w-4 h-4 text-primary bg-transparent border-input rounded" />
              <Label htmlFor="isFavorite" className="font-normal cursor-pointer">Mark as Favorite</Label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>Save Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="text-center text-muted-foreground py-8">Loading templates...</div>
      ) : templates.length === 0 ? (
        <div className="text-center text-muted-foreground py-8 border rounded-lg border-dashed">No templates found. Create one to get started!</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id} className="relative group flex flex-col h-full">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="mb-2">{template.category || 'Uncategorized'}</Badge>
                  <button onClick={() => toggleFavorite(template.id, template.isFavorite)}>
                    <Star className={`w-4 h-4 cursor-pointer transition-colors ${template.isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground hover:text-primary'}`} />
                  </button>
                </div>
                <CardTitle className="text-xl leading-tight line-clamp-1">{template.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-grow whitespace-pre-wrap">{template.content}</p>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity mt-auto pt-4 border-t border-border/50">
                  <Button variant="secondary" className="w-full h-8 text-xs" onClick={() => navigator.clipboard.writeText(template.content)}>
                    <Copy className="w-3 h-3 mr-2" /> Copy
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={() => handleOpenModal(template)}>
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 shrink-0 text-destructive hover:text-destructive" onClick={() => handleDelete(template.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
