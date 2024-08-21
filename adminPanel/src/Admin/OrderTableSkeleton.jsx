import { Skeleton } from "@/components/ui/skeleton";
import { TableRow } from "@/components/ui/table";
import React from "react";

function OrderTableSkeleton() {
  return (
    <TableRow>
      <Skeleton className={"w-full my-1 h-10"} />
    </TableRow>
  );
}

export default OrderTableSkeleton;
