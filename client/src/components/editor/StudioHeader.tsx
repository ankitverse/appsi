import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { Monitor, Save, Globe, ArrowLeft } from "lucide-react";

interface StudioHeaderProps {
  templateName: string;
  templateId: string;
  onSave: (name: string) => Promise<void>;
}

export default function StudioHeader({
  templateName,
  templateId,
  onSave,
}: StudioHeaderProps) {
  const [websiteName, setWebsiteName] = useState(
    templateName || "Untitled Website",
  );
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(websiteName);
      toast({
        title: "Success",
        description: "Your website has been saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your website",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-[hsl(var(--dark))] text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <span className="font-inter font-bold text-xl text-primary">
            Appsi
          </span>
          <div className="h-6 border-r border-gray-600"></div>
          <Input
            type="text"
            value={websiteName}
            onChange={(e) => setWebsiteName(e.target.value)}
            className="bg-gray-800 text-white border border-gray-700 rounded w-48"
          />
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            className="bg-gray-800 text-white border-gray-700"
          >
            <Monitor className="mr-2 h-4 w-4" /> Preview
          </Button>
          <Button
            className="bg-[hsl(var(--accent))] hover:bg-green-600 text-white"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
          <Button className="bg-[hsl(var(--secondary))] hover:bg-orange-600 text-white">
            <Globe className="mr-2 h-4 w-4" /> Publish
          </Button>
        </div>
      </div>
    </div>
  );
}
