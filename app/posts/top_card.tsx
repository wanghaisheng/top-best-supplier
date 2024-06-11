import Topics from "./topics";

export default function TopCard({ post }) {
  if (!post) {
    return <div>Loading...</div>;
  }
  return (
    <div key={post.id} className="flex-grow p-4">
      <div className="bg-white p-6 shadow-xl rounded-lg">
        <h3 className="text-lg font-medium">
          Top {post.name} Best List accross the world
        </h3>
        <Topics topId={post.id} />
      </div>
    </div>
  );
}
