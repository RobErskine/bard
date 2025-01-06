import Link from "next/link";
import { Button } from "./button";

export interface ChildListItemProps {
	children: React.ReactNode;
	className?: string;
	child: {
		id: string;
		name: string;
		birthdate: string;
	}
}

function getAge(dateString: string) {
	const today = new Date();
	const birthDate = new Date(dateString);
	let age = today.getFullYear() - birthDate.getFullYear();
	const m = today.getMonth() - birthDate.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}
	return age;
}

function ChildListItem({ className, child }: ChildListItemProps) {
  return (
  <>
		<div
			key={child.id}
			className="p-4 border rounded-lg flex justify-between items-center"
		>
			<div>
				<h3 className="font-medium">{child.name}</h3>
				<p className="text-sm text-muted-foreground">{child.name}</p>
			</div>
			<Link href={`/account/children/${child.id}`}>
				<Button variant="outline">View Details</Button>
			</Link>
		</div>
	</>
  );
}

export { ChildListItem,};