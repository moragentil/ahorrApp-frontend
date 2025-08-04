import { ScaleLoader } from 'react-spinners';

function BtnLoading({ text = "Cargando...", color = "#2563eb", height = 20 }) {
  return (
    <button
      type="button"
      disabled
      className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-blue-900 text-white opacity-70 cursor-not-allowed"
    >
      <ScaleLoader height={height} color={color} />
      <span>{text}</span>
    </button>
  );
}

export default BtnLoading;