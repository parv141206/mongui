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
      <label htmlFor={label} className="pl-1 text-base text-white">
        {label}
      </label>
      <ShadcnCheckbox
        id={label}
        checked={checked}
        onCheckedChange={onChange}
        className="h-5 w-5 rounded-sm border border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-black"
      />
    </div>
  );
}
