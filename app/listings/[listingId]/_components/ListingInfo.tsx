import React from "react";
import dynamic from "next/dynamic";

import Avatar from "@/components/Avatar";
import ListingCategory from "./ListingCategory";
import { Category } from "@/types";
import Button from "@/components/Button";

interface ListingInfoProps {
  user: {
    image: string | null;
    name: string | null;
  };
  description: string;
  guestCount: number;
  roomCount: number;
  bathroomCount: number;
  category: Category | undefined;
  latlng: number[];
  structSrc: string
  listingId: string
}

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

const ListingInfo: React.FC<ListingInfoProps> = ({
  user,
  description,
  guestCount,
  roomCount,
  bathroomCount,
  category,
  latlng,
  structSrc,
  listingId
}) => {
  return (
    <div className="col-span-4 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <hr />
          {structSrc != 'NOT_AVAILABLE' && <a href={'/view/' + listingId}> <Button> Check out the 3d views </Button> </a>}
          {structSrc == 'NOT_AVAILABLE' && <Button disabled> Unfortunaly 3D view is not currently avalible </Button>}
        <hr />
        <div className="text-[16px] font-semibold flex flex-row items-center gap-2">
          <span className="mr-1">Hosted by</span> <Avatar src={user?.image} />
          <span> {user?.name}</span>
        </div>
        <div
          className="flex flex-row items-center gap-4 font-light text-neutral-700
          "
        >
          <span>{guestCount} guests</span>
          <span>{roomCount} rooms</span>
          <span>{bathroomCount} bathrooms</span>
        </div>
      </div>
      <hr />
      {category && (
        <ListingCategory
          icon={category.icon}
          label={category?.label}
          description={category?.description || ""}
        />
      )}
      <hr />
      <p className=" font-light text-neutral-500 text-[16px] ">{description}</p>
      <hr />
      <div className="h-[210px]">
        <Map center={latlng} />
      </div>
    </div>
  );
};

export default ListingInfo;
