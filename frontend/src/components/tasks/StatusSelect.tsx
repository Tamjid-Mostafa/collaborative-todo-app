"use client";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Props = {
  value: "in-progress" | "completed" | "stale";
  onChange: (value: "in-progress" | "completed" | "stale") => void;
  disabled?: boolean;
};

export function StatusSelect({ value, onChange, disabled }: Props) {
  return (
    <Select
      disabled={disabled}
      value={value}
      onValueChange={(v) => onChange(v as any)}
    >
      <SelectTrigger className="w-32">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="in-progress">In Progress</SelectItem>
        <SelectItem value="completed">Completed</SelectItem>
        <SelectItem value="stale">Stale</SelectItem>
      </SelectContent>
    </Select>
  );
}
