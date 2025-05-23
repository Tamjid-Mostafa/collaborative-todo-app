"use client";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Props = {
  value: "low" | "medium" | "high";
  onChange: (value: "low" | "medium" | "high") => void;
  disabled?: boolean
};

export function PrioritySelect({ value, onChange, disabled }: Props) {
  return (
    <Select disabled={disabled} value={value} onValueChange={(v) => onChange(v as any)}>
      <SelectTrigger className="w-32">
        <SelectValue placeholder="Priority" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="low">Low</SelectItem>
        <SelectItem value="medium">Medium</SelectItem>
        <SelectItem value="high">High</SelectItem>
      </SelectContent>
    </Select>
  );
}
