"use client";
import MapForm from "@/components/forms/MapForm";
import { addMap } from "@/server/maplistRequests.client";

export const MapFormAdd_C = () => <MapForm onSubmit={addMap} />;
