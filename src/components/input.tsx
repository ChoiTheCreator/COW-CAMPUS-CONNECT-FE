interface InputProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
}

export default function Input({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
}: InputProps) {
  return (
    <div className="flex flex-col text-sm gap-1.5">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={`rounded-md pl-3 py-2 ${
          error ? "border border-red-500" : "border border-[#CBD5E1]"
        }`}
        placeholder={placeholder}
      />
      {error ? (
        <span className="text-red-500 text-xs">{error}</span>
      ) : (
        <span className="text-[#64748B] text-xs">{placeholder}</span>
      )}
    </div>
  );
}
