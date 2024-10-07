
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function SortComboBox({sortType,setSortType}) {
  const [position, setPosition] = React.useState("bottom")

  return (
    <DropdownMenu className={'absolute z-40 bg-transparent'}>
      <DropdownMenuTrigger  asChild>
        <Button  className="bg-orange-500 max-sm:scale-90 text-white  translate-x-[-3px]   " variant="">Sort Order 
        <div className="pl-2">
            <svg  fill="none" height="18" viewBox="0 0 28 28" width="18"  xmlns="http://www.w3.org/2000/svg"><path d="M2 7.0625C2 6.47569 2.48843 6 3.09091 6H24.9091C25.5116 6 26 6.47569 26 7.0625C26 7.64931 25.5116 8.125 24.9091 8.125H3.09091C2.48843 8.125 2 7.64931 2 7.0625Z" fill="white"/><path d="M6.90909 14.5C6.90909 13.9132 7.39752 13.4375 8 13.4375H20C20.6025 13.4375 21.0909 13.9132 21.0909 14.5C21.0909 15.0868 20.6025 15.5625 20 15.5625H8C7.39752 15.5625 6.90909 15.0868 6.90909 14.5Z" fill="white"/><path d="M12.3636 20.875C11.7612 20.875 11.2727 21.3507 11.2727 21.9375C11.2727 22.5243 11.7612 23 12.3636 23H15.6364C16.2388 23 16.7273 22.5243 16.7273 21.9375C16.7273 21.3507 16.2388 20.875 15.6364 20.875H12.3636Z" fill="white"/></svg>
        </div>
        </Button>
      </DropdownMenuTrigger >
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Sort</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={sortType} onValueChange={setSortType}>
        <DropdownMenuRadioItem value="asc">A-Z </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="desc">Z-A</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="low-price">Lowest Price</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
