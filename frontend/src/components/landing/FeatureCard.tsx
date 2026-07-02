interface FeatureCardProps {
  title: string;
  description: string;
}

export default function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="border border-hairline rounded-sm p-5">
      <h3 className="text-lg mb-2 text-paper">{title}</h3>
      <p className="text-sm text-mute leading-relaxed">{description}</p>
    </div>
  );
}
