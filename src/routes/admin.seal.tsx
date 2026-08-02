import { createFileRoute } from "@tanstack/react-router";
import { SealEmbed } from "@/components/SealEmbed";

export const Route = createFileRoute("/admin/seal")({
  component: SealEmbed,
});