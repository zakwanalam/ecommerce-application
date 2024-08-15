import { Badge } from "@/components/ui/badge";
import { TableRow,TableCell } from "@/components/ui/table";
import React from "react";

function OrderRow({order,...props}) {
    console.log(order);
    
  return (
    
    <TableRow {...props} className=" cursor-pointer">
      <TableCell>
        <div className="font-medium"> {order.customer_details?.name} </div>
        <div className="hidden text-sm text-muted-foreground md:inline">
          {order.customer_details?.email}
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell">Sale</TableCell>
      <TableCell className="hidden sm:table-cell">
        <Badge className="text-xs" variant="secondary">
          Fulfilled
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">{order?.created}</TableCell>
      <TableCell className="text-right">{order?.amount_total}</TableCell>
    </TableRow>
  );
}

export default OrderRow;
