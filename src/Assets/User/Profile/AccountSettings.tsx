import React, { memo } from "react";
import { Toaster } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings, User } from "lucide-react";
import useProfileSettings from "@/Hooks/User/Profile/useProfileSettings";
import EditProfile from "./EditProfile";

interface SecureAccountProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AccountSettings: React.FC<SecureAccountProps> = memo(
  ({ open, setOpen }) => {
    const { type, handleType } = useProfileSettings();

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] bg-blue-light dark:bg-background dark:text-white">
          <DialogHeader>
            <div className="flex items-center h-[50px] justify-between">
              {type === "Edit" ? "Edit Profile" : "Profile Settings"}
              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleType("Set")}
                >
                  <Settings
                    className={`h-4 w-4 ${
                      type === "Set" ? "text-primary" : ""
                    }`}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleType("Edit")}
                >
                  <User
                    className={`h-4 w-4 ${
                      type === "Edit" ? "text-primary" : ""
                    }`}
                  />
                </Button>
              </div>
            </div>
          </DialogHeader>

          {type === "Edit" && <EditProfile />}
        </DialogContent>
        <Toaster richColors position="top-right" />
      </Dialog>
    );
  }
);

export default AccountSettings;
