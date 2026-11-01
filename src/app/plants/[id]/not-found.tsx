import { NotFoundView } from "@/components/not-found/not-found-view";

export default function PlantNotFound() {
  return (
    <NotFoundView
      title="This plant hasn't taken root here yet."
      body="We couldn't find that plant. It may not be in PlantLens yet, or the link may be mistyped."
    />
  );
}
