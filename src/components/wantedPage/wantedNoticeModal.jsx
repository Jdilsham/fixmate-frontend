import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
const API = import.meta.env.VITE_BACKEND_URL;

export default function WantedNoticeModal({ isOpen, onClose, onCreated }) {
  const [formData, setFormData] = useState({ profession: "", requiredCount: 1, location: "", description: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API}/api/wanted`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify(formData)
    });
    if (res.ok) { onCreated(); onClose(); }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl">
        <DialogHeader><DialogTitle className="text-2xl font-bold">Post a Wanted Notice</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2"><Label>Professional Needed</Label><Input required value={formData.profession} onChange={e => setFormData({...formData, profession: e.target.value})} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Worker Count</Label><Input type="number" min="1" required value={formData.requiredCount} onChange={e => setFormData({...formData, requiredCount: parseInt(e.target.value)})} /></div>
            <div className="space-y-2"><Label>Location</Label><Input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} /></div>
          </div>
          <div className="space-y-2"><Label>Description</Label><Textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
          <DialogFooter><Button variant="fixmate" onClick={onClose} type="button">Cancel</Button><Button variant="fixmate" type="submit">Publish</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}