import { ClipLoader } from 'react-spinners';

function BtnLoading({ color = "hsl(var(--primary))", height = 40 }) {
  return (
    <button
      type="button"
      disabled
      className="flex items-center justify-center gap-2 px-4 py-2 rounded-md cursor-not-allowed bg-muted"
    >
      <ClipLoader height={height} color={color} />
    </button>
  );
}

export default BtnLoading;