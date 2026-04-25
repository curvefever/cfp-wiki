import { Icon } from "../../../../components/ui/icon";

export function HomeLink({ className }: { className?: string }) {
  return (
    <a
      href="/home"
      className={`pr-5 py-3 w-fit flex items-center ${className}`}
    >
      <Icon icon="arrow-left" className="h-8" />
      <span className="ml-2">Home</span>
    </a>
  );
}
