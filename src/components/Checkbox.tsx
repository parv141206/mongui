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
    <>
      <label className="custom-checkbox">
        {label}
        <input
          className="checkbox normal-input"
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="checkmark"></span>
      </label>
    </>
  );
}
