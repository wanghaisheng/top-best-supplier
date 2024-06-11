export default function ProgressBar(props: { progress: any; values: any }) {
  const { progress, values } = props;

  if (progress === 0) {
    return null;
  }

  const valueLength = values.length - 1;

  return (
    <div className={`animate-pulse py-4`}>
      <div className="w-full bg-gray-200 rounded-md h-4 overflow-hidden">
        <div
          className="bg-blue-600 h-4 rounded-md"
          style={{ width: `${(progress / valueLength) * 100}%` }}
        />
      </div>

      {valueLength === progress ? (
        <div className="text-xs text-center text-gray-500">
          Upload Success! 🎉
        </div>
      ) : (
        <div className="text-xs text-center text-gray-500">
          {progress}/{valueLength}
        </div>
      )}
    </div>
  );
}
