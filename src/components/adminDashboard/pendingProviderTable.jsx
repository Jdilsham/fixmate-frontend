// src/components/admin/PendingProvidersTable.jsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PendingProvidersTable() {
  return (
    <Card className="p-4 rounded-2xl">
      <h2 className="text-lg font-semibold mb-4">Pending Providers</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Skill</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b">
              <td className="py-2">John Doe</td>
              <td>john@example.com</td>
              <td>Electrician</td>
              <td className="space-x-2">
                <Button size="sm">Approve</Button>
                <Button size="sm" variant="destructive">
                  Reject
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
}
