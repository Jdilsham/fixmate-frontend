import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function JobCard({
  profession,
  description,
  location,
  contact,
}) {
  return (
    <Card className="max-w-4xl min-h-40   ">
      <CardHeader>
        <div className="w-full flex justify-around items-center p-4">
          <CardTitle className="text-4xl font-semibold">
            Wanted {profession}
          </CardTitle>
          <span className="text-lg opacity-70 max-w-xl">📍 {location}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full flex flex-col gap-4">
          <div className="w-full p-4 bg-muted rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">{profession}</h2>
            <p className="text-lg opacity-70">{description}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <button className="min-w-40 flex justify-end items-center">
          {contact}
        </button>
      </CardFooter>
    </Card>
  );
}
