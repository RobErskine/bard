import Link from "next/link";
import { Button } from "./button";

export interface ChildListItemProps {
	className?: string;
	child: {
		id: string;
		name: string;
		birthdate: string;
	}
}

function getAge(dateString: string) {
	const today = new Date();
	const [year, month, day] = dateString.split('-').map(Number);
	const birthDate = new Date(year, month - 1, day); // month is 0-indexed in Date constructor
	
	const years = today.getFullYear() - birthDate.getFullYear();
	const months = today.getMonth() - birthDate.getMonth();
	const adjustedMonths = months < 0 ? months + 12 : months;
	let totalMonths = years * 12 + adjustedMonths;

	// Calculate days for infants under 1 month
	const timeDiff = today.getTime() - birthDate.getTime();
	const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

	// Adjust for day of month
	if (today.getDate() < birthDate.getDate()) {
		totalMonths--;
	}

	if (daysDiff < 30) {
		if (daysDiff === 1) return "1 day";
		return `${daysDiff} days old`;
	} else if (totalMonths < 12) {
		if (totalMonths === 1) return "1 month";
		return `${totalMonths} months old`;
	} else {
		if (years === 1) return "1 year";
		return `${years} years old`;
	}
}

function birthdayCountdown(birthday: string) {
	const [year, month, day] = birthday.split('-').map(Number);
	const today = new Date();
	const birthDate = new Date(year, month - 1, day);
	const daysUntilBirthday = Math.ceil((birthDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

	if (today.getMonth() === birthDate.getMonth() && today.getDate() === birthDate.getDate()) {
		return "Today is their birthday!";
	}

	if (daysUntilBirthday <= 90 && daysUntilBirthday > 0) {
		return `in ${daysUntilBirthday} days`;
	}

	return "";
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
				<p className="text-sm text-muted-foreground">
					{getAge(child.birthdate)}
					{birthdayCountdown(child.birthdate)}</p>
			</div>
			<Link href={`/account/children/${child.id}`}>
				<Button variant="outline">View Details</Button>
			</Link>
		</div>
	</>
  );
}

export { ChildListItem,};