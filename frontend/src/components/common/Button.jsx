const Button = ({ text, type = "submit" }) => {
  return (
    <button
      type={type}
      className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all duration-300"
    >
      {text}
    </button>
  );
};

export default Button;