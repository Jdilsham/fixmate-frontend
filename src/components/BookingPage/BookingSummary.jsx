import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function BookingSummary({ service, pricingType }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Booking Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex justify-between text-base">
          <span className="opacity-70">Service</span>
          <span>{service.serviceTitle}</span>
        </div>

        <div className="flex justify-between text-base">
          <span className="opacity-70">Location</span>
          <span>{service.location}</span>
        </div>

        <div className="border-t border-border pt-4 flex justify-between text-lg font-semibold">
          <span>Total</span>
          {pricingType === "HOURLY" ? (
            <span className="text-accent">LKR {service.hourlyRate} / hour</span>
          ) : (
            <span className="text-accent">Fixed price to be confirmed</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
