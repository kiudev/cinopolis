// import { useState, useEffect } from "react";
// import axios from "axios";
// import { key } from "./key";

// import {
//    Popover,
//    PopoverContent,
//    PopoverTrigger,
// } from "@/components/ui/popover";

// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";

// interface Props {
//    genres: Object[],

// }

// export default function GenreFilter({ genres }: Props) {
//    return (
//       <Popover>
//          <PopoverTrigger>Genres</PopoverTrigger>

//          <PopoverContent className="bg-blue-700 w-[40rem] h-60 grid grid-rows-4 grid-flow-col border-none rounded-xl">
//             {genres.map(genre => (
//                <div className="flex flex-row items-center gap-2" key={genre.id}>
//                   <Checkbox
//                      className="text-blue-900 bg-blue-600"
//                      id={genre.name}
//                   />
//                   <Label
//                      className=" text-blue-600  border-none"
//                      htmlFor={genre.name}
//                   >
//                      {genre.name}
//                   </Label>
//                </div>
//             ))}
//          </PopoverContent>
//       </Popover>
//    );
// }
