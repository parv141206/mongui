import { Checkbox as ShadcnCheckbox } from "@/components/ui/checkbox";

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center space-x-2">
      <ShadcnCheckbox
        id={label}
        checked={checked}
        onCheckedChange={onChange}
        className="h-5 w-5 border-2 border-white/20"
      />
      <label
        htmlFor={label}
        className="font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
    </div>
  );
}
