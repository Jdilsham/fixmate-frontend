import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function BookingsTable({role, bookings}){
    const isProvider = role === "SERVICE_PROVIDER";

    

    return(
        <div className="rounded-xl border-2 border-border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            {isProvider ? "Customer" : "Provider"}
                        </TableHead>
                        <TableHead>
                            Service
                        </TableHead>
                        <TableHead>
                            Date
                        </TableHead>
                        <TableHead>
                            Status
                        </TableHead>
                    </TableRow>
                </TableHeader>
                
                <TableBody>
                    {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                            <TableCell className="font-medium">
                                {isProvider ? booking.customerName : booking.providerName}
                        </TableCell>
                        <TableCell>{booking.service}</TableCell>
                        <TableCell>{booking.date}</TableCell>
                        <TableCell>{booking.status}</TableCell>
                        <TableCell><Badge variant="secondary">
                            {booking.status}
                        </Badge></TableCell>
                        </TableRow>
                    ))}

                    {bookings.length === 0 && (
                        <TableRow>
                            <TableCell colspan={5} className="text-center py-4 text-muted-foreground">
                                No bookings found.
                            </TableCell>
                        </TableRow>
                    )}

                </TableBody>
            </Table>
        </div>
    )
}