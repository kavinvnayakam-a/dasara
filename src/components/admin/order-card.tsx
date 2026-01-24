"use client"

import type { Order } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { Clock, Check, Utensils, CheckCheck } from "lucide-react";
import { Badge } from "../ui/badge";

type OrderCardProps = {
  order: Order;
  onStatusUpdate: (orderId: string, status: Order['status']) => void;
};

const statusConfig = {
    Received: { icon: Clock, color: 'bg-blue-500' },
    Preparing: { icon: Utensils, color: 'bg-orange-500' },
    Served: { icon: Check, color: 'bg-green-500' },
    Completed: { icon: CheckCheck, color: 'bg-gray-500' },
};


export function OrderCard({ order, onStatusUpdate }: OrderCardProps) {
    const CurrentStatusIcon = statusConfig[order.status].icon;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>Table {order.tableId}</CardTitle>
                <p className="text-xs text-muted-foreground">
                    {new Date(order.timestamp).toLocaleTimeString()}
                </p>
            </div>
            <Badge variant={order.status === 'Received' ? 'default' : 'secondary'} className={order.status === 'Received' ? 'bg-primary text-primary-foreground' : ''}>
                <CurrentStatusIcon className="mr-1 h-3 w-3" />
                {order.status}
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-2 overflow-y-auto max-h-48">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>{item.quantity}x {item.name}</span>
            <span className="text-muted-foreground">{formatCurrency(item.price * item.quantity)}</span>
          </div>
        ))}
      </CardContent>
      <Separator className="my-2"/>
      <CardFooter className="flex-col items-stretch space-y-2 pt-4">
        <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>{formatCurrency(order.totalPrice)}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-2">
            <Button size="sm" variant={order.status === 'Preparing' ? 'default' : 'outline'} onClick={() => onStatusUpdate(order.id, 'Preparing')}>Preparing</Button>
            <Button size="sm" variant={order.status === 'Served' ? 'default' : 'outline'} onClick={() => onStatusUpdate(order.id, 'Served')}>Served</Button>
            <Button size="sm" variant="outline" onClick={() => onStatusUpdate(order.id, 'Completed')}>Complete</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
