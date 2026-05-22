const Input = ({
  label,
  type,
  name,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-black"
      />
    </div>
  );
};

export default Input;