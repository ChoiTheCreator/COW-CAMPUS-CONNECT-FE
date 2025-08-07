interface RadioSelectorProps {
  selectedGender: "male" | "female";
  onChange: (gender: "male" | "female") => void;
}

export default function RadioSelector({
  selectedGender,
  onChange,
}: RadioSelectorProps) {
  return (
    <div className="flex flex-col text-sm gap-2">
      <span>성별</span>
      <div className="flex flex-row gap-4">
        <label className="flex items-center gap-3">
          <input
            type="radio"
            name="gender"
            value="male"
            checked={selectedGender === "male"}
            onChange={() => onChange("male")}
            className="w-4 h-4"
          />
          <span>남자</span>
        </label>
        <label className="flex items-center gap-3">
          <input
            type="radio"
            name="gender"
            value="female"
            checked={selectedGender === "female"}
            onChange={() => onChange("female")}
            className="w-4 h-4"
          />
          <span>여자</span>
        </label>
      </div>
    </div>
  );
}
