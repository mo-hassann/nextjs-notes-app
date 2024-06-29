import { Card, CardContent } from "@/components/ui/card";

type props = {
  title: string;
  doneIn: string;
  description: string | null;
  categories: ({ id: string; name: string } | null)[] | null;
  state: string;
};

export default function TodoCard({ description, doneIn, state, title, categories }: props) {
  return (
    <Card>
      <CardContent>
        <h4>{title}</h4>
        <p>{description}</p>
        {categories ? (
          categories.map((category) => category && <span key={category.id}>{category.name}</span>)
        ) : (
          <span>no categories</span>
        )}
        <p>{doneIn.toString()}</p>
        <p>{state}</p>
      </CardContent>
    </Card>
  );
}
