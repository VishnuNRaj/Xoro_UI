import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import useProfileSettings from "@/Hooks/User/Profile/useProfileSettings";
import { Plus, X } from "lucide-react";

export default function EditProfile() {
  const {
    handleChange,
    data,
    handleUpdate,
    handleClear,
    handleDescription,
    handleDescriptionDelete,
  } = useProfileSettings();

  return (
    <ScrollArea className="h-[300px] w-full rounded-md border dark:border-white border-gray-800">
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="Name"
            placeholder="Name..."
            value={data.Name}
            onChange={handleChange}
            className="dark:border-white border-gray-800"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="Username"
            placeholder="Username..."
            value={data.Username}
            onChange={handleChange}
            className="dark:border-white border-gray-800"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <div className="flex space-x-2">
            <Input
              id="description"
              name="DescString"
              placeholder="Descriptions..."
              value={data.DescString}
              onChange={handleChange}
              className="dark:border-white border-gray-800"
            />
            <Button onClick={handleDescription} className="text-white" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {data.Description.map((tag, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 bg-blue-100 dark:bg-secondary rounded-lg"
            >
              <span className="text-sm font-medium truncate">{tag}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDescriptionDelete(idx)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <div className="flex justify-end text-white space-x-2">
          <Button onClick={handleUpdate} variant="default">
            Update
          </Button>
          <Button onClick={handleClear} className="bg-accent-dark hover:bg-accent-light" variant="default">
            Cancel
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}
