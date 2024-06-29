import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type props = {
  title: string;
  doneIn: string;
  description: string | null;
  categories: { id: string; name: string }[];
  state: string;
  onEdit: () => void;
};

export default function TodoCard({ description, doneIn, state, title, categories, onEdit }: props) {
  return (
    <Card>
      <CardContent>
        <Button onClick={onEdit}>edit</Button>
        <h4>{title}</h4>
        <p>{description}</p>
        <div className="space-x-2">
          {categories.length > 0 ? (
            categories.map(
              (category) =>
                category && (
                  <span className="bg-green-300 rounded-md p-1" key={category.id}>
                    {category.name}
                  </span>
                )
            )
          ) : (
            <span className="bg-rose-300 rounded-md p-1">no categories</span>
          )}
        </div>
        <p>{doneIn.toString()}</p>
        <p>{state}</p>
      </CardContent>
    </Card>
  );
}
