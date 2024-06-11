export default function CustomButton({
  children,
  color = "indigo",
  disabled = false,
  onClick,
  size = "md",
  type,
  className = "w-32 h-8",
}) {
  return (
    <button
      type={type}
      className={`${className} text-white bg-green-600 font-medium rounded disabled:opacity-50`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
