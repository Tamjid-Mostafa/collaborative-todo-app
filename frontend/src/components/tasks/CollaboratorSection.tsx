// CollaboratorSection.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useApi } from "@/lib/api-client";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "./types";
import { Loader2 } from "lucide-react";


type Props = {
  todoId: string;
  canInvite: boolean;
  owner?: User;
  editors?: User[];
  viewers?: User[];
};

export function CollaboratorSection({ todoId, canInvite, owner, editors = [], viewers = [] }: Props) {
  const api = useApi();
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState("");
  const [role, setRole] = useState<"editor" | "viewer">("viewer");

  const { data: users = [], isLoading: loadingUsers } = useQuery<User[]>({
    queryKey: ["all-users"],
    queryFn: async () => {
      const res = await api.get("/user");
      return res.data;
    },
  });

  const inviteMutation = useMutation({
    mutationFn: async () => {
      return api.post(`/todos/${todoId}/invite`, { userId: selectedUserId, role });
    },
    onSuccess: () => {
      toast.success("User invited successfully");
      queryClient.invalidateQueries({ queryKey: ["todo-details", todoId] });
      setSelectedUserId("");
    },
    onError: () => {
      toast.error("Failed to send invite. Please try again.");
    },
  });

  const handleInvite = () => {
    if (!selectedUserId) return;
    inviteMutation.mutate();
  };
  const filteredUsers = users.filter(user => user._id !== owner?._id);
  return (
    <div className="mt-10 border-t pt-6 space-y-4">
      <h2 className="text-lg font-semibold">Collaborators</h2>

      <div className="text-sm">
        <p><strong>Owner:</strong> {owner?.username}</p>
        {editors.length > 0 && (
          <p><strong>Editors:</strong> {editors.map((u) => u.username).join(", ")}</p>
        )}
        {viewers.length > 0 && (
          <p><strong>Viewers:</strong> {viewers.map((u) => u.username).join(", ")}</p>
        )}
      </div>

      {canInvite ? (
        <div className="flex gap-2 flex-wrap items-center">
          <Select
            value={selectedUserId}
            onValueChange={setSelectedUserId}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select user to invite" />
            </SelectTrigger>
            <SelectContent>
              {filteredUsers.map((user) => (
                <SelectItem key={user._id} value={user._id}>
                  {user.username}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={role}
            onValueChange={(v) => setRole(v as "editor" | "viewer")}
          >
            <SelectTrigger className="border px-2 py-1 rounded">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="viewer">Viewer</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleInvite} disabled={inviteMutation.isPending} className="cursor-pointer">
            {inviteMutation.isPending ? <>Inviting...<Loader2 className="animate-spin" /></> : "Invite"}
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Only the owner can invite users.</p>
      )}
    </div>
  );
}
